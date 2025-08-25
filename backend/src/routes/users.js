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
 * /api/users:
 *   get:
 *     summary: Listar usuários (apenas admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_type
 *         schema:
 *           type: string
 *           enum: [admin, team, visitor]
 *         description: Filtrar por tipo de usuário
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
 *         description: Lista de usuários
 *       403:
 *         description: Acesso negado
 */
router.get('/', [
  authenticateToken,
  requireAdmin,
  queryValidator('user_type').optional().isIn(['admin', 'team', 'visitor']),
  queryValidator('is_active').optional().isBoolean(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { user_type, is_active, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construir query base
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (user_type) {
      whereConditions.push(`user_type = $${paramIndex++}`);
      queryParams.push(user_type);
    }

    if (is_active !== undefined) {
      whereConditions.push(`is_active = $${paramIndex++}`);
      queryParams.push(is_active);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Query principal
    const mainQuery = `
      SELECT 
        id, email, user_type, first_name, last_name, phone, is_active, 
        email_verified, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);
    const result = await query(mainQuery, queryParams);

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obter usuário por ID (apenas admin)
 *     tags: [Usuários]
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
 *         description: Dados do usuário
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        id, email, user_type, first_name, last_name, phone, is_active, 
        email_verified, created_at, updated_at
      FROM users WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário (apenas admin)
 *     tags: [Usuários]
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
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               email_verified:
 *                 type: boolean
 *               user_type:
 *                 type: string
 *                 enum: [admin, team, visitor]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('first_name').optional().trim(),
  body('last_name').optional().trim(),
  body('phone').optional().trim(),
  body('is_active').optional().isBoolean(),
  body('email_verified').optional().isBoolean(),
  body('user_type').optional().isIn(['admin', 'team', 'visitor'])
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

    // Adicionar ID aos parâmetros
    queryParams.push(id);

    const result = await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING id, email, user_type, first_name, last_name, phone, is_active, email_verified, updated_at
    `, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/users/{id}/deactivate:
 *   post:
 *     summary: Desativar usuário (apenas admin)
 *     tags: [Usuários]
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
 *         description: Usuário desativado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post('/:id/deactivate', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se não está tentando desativar a si mesmo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível desativar sua própria conta'
      });
    }

    const result = await query(`
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, is_active
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/users/{id}/activate:
 *   post:
 *     summary: Ativar usuário (apenas admin)
 *     tags: [Usuários]
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
 *         description: Usuário ativado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post('/:id/activate', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE users 
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, is_active
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário ativado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao ativar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Obter estatísticas de usuários (apenas admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos usuários
 *       403:
 *         description: Acesso negado
 */
router.get('/stats/overview', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    // Estatísticas gerais
    const totalUsers = await query('SELECT COUNT(*) as total FROM users');
    const activeUsers = await query('SELECT COUNT(*) as total FROM users WHERE is_active = true');
    const adminUsers = await query('SELECT COUNT(*) as total FROM users WHERE user_type = \'admin\'');
    const teamUsers = await query('SELECT COUNT(*) as total FROM users WHERE user_type = \'team\'');
    const visitorUsers = await query('SELECT COUNT(*) as total FROM users WHERE user_type = \'visitor\'');
    const verifiedUsers = await query('SELECT COUNT(*) as total FROM users WHERE email_verified = true');

    // Usuários por mês (últimos 12 meses)
    const monthlyUsers = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    // Usuários por estado (se tiverem equipes)
    const usersByState = await query(`
      SELECT 
        t.state,
        COUNT(DISTINCT u.id) as user_count
      FROM users u
      JOIN teams t ON u.id = t.user_id
      WHERE u.user_type = 'team'
      GROUP BY t.state
      ORDER BY user_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        overview: {
          total: parseInt(totalUsers.rows[0].total),
          active: parseInt(activeUsers.rows[0].total),
          admins: parseInt(adminUsers.rows[0].total),
          teams: parseInt(teamUsers.rows[0].total),
          visitors: parseInt(visitorUsers.rows[0].total),
          verified: parseInt(verifiedUsers.rows[0].total)
        },
        monthly: monthlyUsers.rows,
        byState: usersByState.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
