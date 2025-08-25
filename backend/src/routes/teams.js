import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../database/config.js';
import {
  authenticateToken,
  requireTeamOrAdmin,
  requireTeamOwnershipOrAdmin,
  requireAdmin
} from '../middleware/auth.js';
import emailService from '../services/emailService.js';

const router = express.Router();

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Listar equipes
 *     tags: [Equipes]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filtrar por status
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por cidade
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filtrar por estado
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
 *         description: Lista de equipes
 */
router.get('/', [
  queryValidator('status').optional().isIn(['pending', 'approved', 'rejected']),
  queryValidator('city').optional().trim(),
  queryValidator('state').optional().trim(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { status, city, state, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construir query base
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`t.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (city) {
      whereConditions.push(`t.city ILIKE $${paramIndex++}`);
      queryParams.push(`%${city}%`);
    }

    if (state) {
      whereConditions.push(`t.state ILIKE $${paramIndex++}`);
      queryParams.push(`%${state}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM teams t
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Query principal
    const mainQuery = `
      SELECT 
        t.id, t.name, t.description, t.coach_name, t.address, t.city, t.state,
        t.zip_code, t.latitude, t.longitude, t.phone, t.email, t.website,
        t.instagram, t.facebook, t.youtube, t.logo_url, t.banner_url,
        t.status, t.approval_date, t.created_at, t.updated_at,
        u.first_name, u.last_name, u.email as user_email,
        COUNT(a.id) as athlete_count
      FROM teams t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN athletes a ON t.id = a.team_id AND a.is_active = true
      ${whereClause}
      GROUP BY t.id, u.first_name, u.last_name, u.email
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);
    const result = await query(mainQuery, queryParams);

    res.json({
      success: true,
      data: {
        teams: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar equipes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Criar nova equipe
 *     tags: [Equipes]
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
 *               - coach_name
 *               - address
 *               - city
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               coach_name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               youtube:
 *                 type: string
 *     responses:
 *       201:
 *         description: Equipe criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', [
  authenticateToken,
  requireTeamOrAdmin,
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('coach_name').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('state').notEmpty().trim(),
  body('zip_code').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('website').optional().isURL(),
  body('instagram').optional().trim(),
  body('facebook').optional().trim(),
  body('youtube').optional().trim()
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

    const {
      name, description, coach_name, address, city, state, zip_code,
      phone, email, website, instagram, facebook, youtube
    } = req.body;

    // Verificar se usuário já tem uma equipe
    if (req.user.user_type === 'team') {
      const existingTeam = await query('SELECT id FROM teams WHERE user_id = $1', [req.user.id]);
      if (existingTeam.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Você já possui uma equipe cadastrada'
        });
      }
    }

    // Criar equipe
    const result = await query(`
      INSERT INTO teams (
        name, description, coach_name, address, city, state, zip_code,
        phone, email, website, instagram, facebook, youtube, user_id,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      name, description, coach_name, address, city, state, zip_code,
      phone, email, website, instagram, facebook, youtube, req.user.id,
      req.user.user_type === 'admin' ? 'approved' : 'pending'
    ]);

    const team = result.rows[0];

    res.status(201).json({
      success: true,
      message: req.user.user_type === 'admin' 
        ? 'Equipe criada e aprovada com sucesso' 
        : 'Equipe criada com sucesso. Aguardando aprovação.',
      data: team
    });

  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Obter equipe por ID
 *     tags: [Equipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da equipe
 *       404:
 *         description: Equipe não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        t.*, u.first_name, u.last_name, u.email as user_email,
        COUNT(a.id) as athlete_count,
        ARRAY_AGG(DISTINCT a.id) FILTER (WHERE a.id IS NOT NULL) as athlete_ids
      FROM teams t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN athletes a ON t.id = a.team_id AND a.is_active = true
      WHERE t.id = $1
      GROUP BY t.id, u.first_name, u.last_name, u.email
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada'
      });
    }

    const team = result.rows[0];

    // Buscar atletas da equipe
    if (team.athlete_ids && team.athlete_ids.length > 0) {
      const athletesResult = await query(`
        SELECT id, name, age, weight, height, strong_arm, achievements, photo_url
        FROM athletes 
        WHERE id = ANY($1) AND is_active = true
        ORDER BY name
      `, [team.athlete_ids]);
      team.athletes = athletesResult.rows;
    } else {
      team.athletes = [];
    }

    res.json({
      success: true,
      data: team
    });

  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Atualizar equipe
 *     tags: [Equipes]
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
 *               coach_name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               youtube:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipe atualizada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Equipe não encontrada
 */
router.put('/:id', [
  authenticateToken,
  requireTeamOwnershipOrAdmin,
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('coach_name').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('zip_code').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('website').optional().isURL(),
  body('instagram').optional().trim(),
  body('facebook').optional().trim(),
  body('youtube').optional().trim()
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
      UPDATE teams 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Equipe atualizada com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar equipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/teams/{id}/approve:
 *   post:
 *     summary: Aprovar equipe (apenas admin)
 *     tags: [Equipes]
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
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status da equipe atualizado
 *       403:
 *         description: Acesso negado
 */
router.post('/:id/approve', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['approved', 'rejected']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Verificar se equipe existe
    const teamResult = await query('SELECT id, name, user_id FROM teams WHERE id = $1', [id]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada'
      });
    }

    // Atualizar status
    const result = await query(`
      UPDATE teams 
      SET status = $1, approval_date = CURRENT_TIMESTAMP, approved_by = $2
      WHERE id = $3
      RETURNING *
    `, [status, req.user.id, id]);

    // Enviar notificação para o usuário da equipe
    await query(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES ($1, $2, $3, $4)
    `, [
      teamResult.rows[0].user_id,
      `Equipe ${status === 'approved' ? 'Aprovada' : 'Rejeitada'}`,
      `Sua equipe "${teamResult.rows[0].name}" foi ${status === 'approved' ? 'aprovada' : 'rejeitada'}${notes ? `: ${notes}` : ''}`,
      'team_approval'
    ]);

    // Enviar e-mail de notificação (em background)
    try {
      const userResult = await query('SELECT email, first_name FROM users WHERE id = $1', [teamResult.rows[0].user_id]);
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await emailService.sendTeamStatusEmail(
          user.email,
          teamResult.rows[0].name,
          status,
          notes
        );
      }
    } catch (emailError) {
      console.error('Erro ao enviar e-mail de status da equipe:', emailError);
      // Não falhar a aprovação se o e-mail falhar
    }

    res.json({
      success: true,
      message: `Equipe ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao aprovar equipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Deletar equipe
 *     tags: [Equipes]
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
 *         description: Equipe deletada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', [
  authenticateToken,
  requireTeamOwnershipOrAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se equipe tem atletas
    const athletesResult = await query('SELECT COUNT(*) as count FROM athletes WHERE team_id = $1', [id]);
    if (parseInt(athletesResult.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar uma equipe que possui atletas cadastrados'
      });
    }

    // Deletar equipe
    const result = await query('DELETE FROM teams WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Equipe deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar equipe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
