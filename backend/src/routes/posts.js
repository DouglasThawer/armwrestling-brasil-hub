import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../database/config.js';
import { 
  authenticateToken, 
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Listar posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filtrar por status
 *       - in: query
 *         name: author_id
 *         schema:
 *           type: integer
 *         description: Filtrar por autor
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrar por tag
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/', [
  queryValidator('status').optional().isIn(['draft', 'published', 'archived']),
  queryValidator('author_id').optional().isInt(),
  queryValidator('tag').optional().trim(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { status, author_id, tag, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construir query base
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (author_id) {
      whereConditions.push(`p.author_id = $${paramIndex++}`);
      queryParams.push(author_id);
    }

    if (tag) {
      whereConditions.push(`$3 = ANY(p.tags)`);
      queryParams.push(tag);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Query principal
    const mainQuery = `
      SELECT 
        p.id, p.title, p.content, p.excerpt, p.image_url, p.status,
        p.published_at, p.tags, p.created_at, p.updated_at,
        u.id as author_id, u.first_name, u.last_name, u.email as author_email
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ${whereClause}
      ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);
    const result = await query(mainQuery, queryParams);

    res.json({
      success: true,
      data: {
        posts: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar posts:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Criar novo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               image_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('excerpt').optional().trim(),
  body('image_url').optional().isURL(),
  body('status').optional().isIn(['draft', 'published']),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    // Validar dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { title, content, excerpt, image_url, status = 'draft', tags = [] } = req.body;

    // Criar post
    const result = await query(`
      INSERT INTO posts (
        title, content, excerpt, image_url, status, tags, author_id,
        published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title, content, excerpt, image_url, status, tags, req.user.id,
      status === 'published' ? new Date() : null
    ]);

    const post = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Post criado com sucesso',
      data: post
    });

  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obter post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do post
 *       404:
 *         description: Post não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.id, p.title, p.content, p.excerpt, p.image_url, p.status,
        p.published_at, p.tags, p.created_at, p.updated_at,
        u.id as author_id, u.first_name, u.last_name, u.email as author_email
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    const post = result.rows[0];

    // Se post não for publicado, apenas admin pode ver
    if (post.status !== 'published' && (!req.user || req.user.user_type !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Atualizar post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               image_url:
 *                 type: string
 *               status:
 *                 type: string
 *               tags:
 *                 type: array
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Post não encontrado
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().trim(),
  body('content').optional().trim(),
  body('excerpt').optional().trim(),
  body('image_url').optional().isURL(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    // Validar dados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;

    // Construir campos para atualização
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateFields.push(`${key} = $${paramIndex++}`);
        queryParams.push(req.body[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    // Se status mudou para published, definir published_at
    if (req.body.status === 'published') {
      updateFields.push(`published_at = $${paramIndex++}`);
      queryParams.push(new Date());
    }

    // Adicionar ID aos parâmetros
    queryParams.push(id);

    const result = await query(`
      UPDATE posts 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Post atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Deletar post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deletado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se post existe
    const postResult = await query('SELECT id, title FROM posts WHERE id = $1', [id]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    // Deletar post
    await query('DELETE FROM posts WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Post deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/posts/{id}/publish:
 *   post:
 *     summary: Publicar post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post publicado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post('/:id/publish', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se post existe
    const postResult = await query('SELECT id, title, status FROM posts WHERE id = $1', [id]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }

    const post = postResult.rows[0];

    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Post já está publicado'
      });
    }

    // Publicar post
    const result = await query(`
      UPDATE posts 
      SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);

    res.json({
      success: true,
      message: 'Post publicado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao publicar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/posts/tags:
 *   get:
 *     summary: Obter todas as tags
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de tags
 */
router.get('/tags/all', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT unnest(tags) as tag
      FROM posts
      WHERE status = 'published' AND tags IS NOT NULL
      ORDER BY tag
    `);

    const tags = result.rows.map(row => row.tag);

    res.json({
      success: true,
      data: tags
    });

  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
