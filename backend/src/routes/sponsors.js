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
 * /api/sponsors:
 *   get:
 *     summary: Listar patrocinadores
 *     tags: [Patrocinadores]
 *     parameters:
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *           enum: [bronze, silver, gold, platinum]
 *         description: Filtrar por plano
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
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
 *         description: Lista de patrocinadores
 */
router.get('/', [
  queryValidator('plan').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  queryValidator('is_active').optional().isBoolean(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { plan, is_active, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construir query base
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (plan) {
      whereConditions.push(`plan = $${paramIndex++}`);
      queryParams.push(plan);
    }

    if (is_active !== undefined) {
      whereConditions.push(`is_active = $${paramIndex++}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM sponsors
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Query principal
    const mainQuery = `
      SELECT 
        id, name, description, logo_url, website, plan, start_date, end_date,
        is_active, created_at, updated_at
      FROM sponsors
      ${whereClause}
      ORDER BY 
        CASE plan
          WHEN 'platinum' THEN 1
          WHEN 'gold' THEN 2
          WHEN 'silver' THEN 3
          WHEN 'bronze' THEN 4
        END,
        created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);
    const result = await query(mainQuery, queryParams);

    res.json({
      success: true,
      data: {
        sponsors: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar patrocinadores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sponsors:
 *   post:
 *     summary: Criar novo patrocinador
 *     tags: [Patrocinadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - plan
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               website:
 *                 type: string
 *               plan:
 *                 type: string
 *                 enum: [bronze, silver, gold, platinum]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Patrocinador criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('plan').isIn(['bronze', 'silver', 'gold', 'platinum']),
  body('logo_url').optional().isURL(),
  body('website').optional().isURL(),
  body('start_date').optional().isDate(),
  body('end_date').optional().isDate()
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

    const { name, description, logo_url, website, plan, start_date, end_date } = req.body;

    // Verificar se datas são válidas
    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: 'Data de início deve ser anterior à data de fim'
      });
    }

    // Criar patrocinador
    const result = await query(`
      INSERT INTO sponsors (
        name, description, logo_url, website, plan, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, description, logo_url, website, plan, start_date, end_date]);

    const sponsor = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Patrocinador criado com sucesso',
      data: sponsor
    });

  } catch (error) {
    console.error('Erro ao criar patrocinador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sponsors/{id}:
 *   get:
 *     summary: Obter patrocinador por ID
 *     tags: [Patrocinadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do patrocinador
 *       404:
 *         description: Patrocinador não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        id, name, description, logo_url, website, plan, start_date, end_date,
        is_active, created_at, updated_at
      FROM sponsors WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patrocinador não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar patrocinador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sponsors/{id}:
 *   put:
 *     summary: Atualizar patrocinador
 *     tags: [Patrocinadores]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               website:
 *                 type: string
 *               plan:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Patrocinador atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Patrocinador não encontrado
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('logo_url').optional().isURL(),
  body('website').optional().isURL(),
  body('plan').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  body('start_date').optional().isDate(),
  body('end_date').optional().isDate(),
  body('is_active').optional().isBoolean()
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

    // Verificar se datas são válidas
    if (req.body.start_date && req.body.end_date && 
        new Date(req.body.start_date) >= new Date(req.body.end_date)) {
      return res.status(400).json({
        success: false,
        message: 'Data de início deve ser anterior à data de fim'
      });
    }

    // Adicionar ID aos parâmetros
    queryParams.push(id);

    const result = await query(`
      UPDATE sponsors 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patrocinador não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Patrocinador atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar patrocinador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sponsors/{id}:
 *   delete:
 *     summary: Deletar patrocinador
 *     tags: [Patrocinadores]
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
 *         description: Patrocinador deletado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se patrocinador existe
    const sponsorResult = await query('SELECT id, name FROM sponsors WHERE id = $1', [id]);
    if (sponsorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patrocinador não encontrado'
      });
    }

    // Deletar patrocinador
    await query('DELETE FROM sponsors WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Patrocinador deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar patrocinador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sponsors/plans:
 *   get:
 *     summary: Obter informações sobre planos de patrocínio
 *     tags: [Patrocinadores]
 *     responses:
 *       200:
 *         description: Informações dos planos
 */
router.get('/plans/info', async (req, res) => {
  try {
    const plans = [
      {
        name: 'bronze',
        title: 'Bronze',
        description: 'Plano básico de patrocínio',
        features: ['Logo na página inicial', 'Mencionado em eventos'],
        price: 'R$ 100/mês'
      },
      {
        name: 'silver',
        title: 'Prata',
        description: 'Plano intermediário de patrocínio',
        features: ['Logo na página inicial', 'Mencionado em eventos', 'Banner em páginas específicas'],
        price: 'R$ 250/mês'
      },
      {
        name: 'gold',
        title: 'Ouro',
        description: 'Plano avançado de patrocínio',
        features: ['Logo na página inicial', 'Mencionado em eventos', 'Banner em páginas específicas', 'Destaque em eventos'],
        price: 'R$ 500/mês'
      },
      {
        name: 'platinum',
        title: 'Platina',
        description: 'Plano premium de patrocínio',
        features: ['Logo na página inicial', 'Mencionado em eventos', 'Banner em páginas específicas', 'Destaque em eventos', 'Conteúdo personalizado'],
        price: 'R$ 1000/mês'
      }
    ];

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Erro ao buscar informações dos planos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
