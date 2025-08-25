import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../database/config.js';
import { 
  authenticateToken, 
  requireTeamOrAdmin, 
  requireAthleteOwnershipOrAdmin,
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/athletes:
 *   get:
 *     summary: Listar atletas
 *     tags: [Atletas]
 *     parameters:
 *       - in: query
 *         name: team_id
 *         schema:
 *           type: integer
 *         description: Filtrar por equipe
 *       - in: query
 *         name: strong_arm
 *         schema:
 *           type: string
 *           enum: [left, right, both]
 *         description: Filtrar por braço forte
 *       - in: query
 *         name: min_age
 *         schema:
 *           type: integer
 *         description: Idade mínima
 *       - in: query
 *         name: max_age
 *         schema:
 *           type: integer
 *         description: Idade máxima
 *       - in: query
 *         name: min_weight
 *         schema:
 *           type: number
 *         description: Peso mínimo
 *       - in: query
 *         name: max_weight
 *         schema:
 *           type: number
 *         description: Peso máximo
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
 *         description: Lista de atletas
 */
router.get('/', [
  queryValidator('team_id').optional().isInt(),
  queryValidator('strong_arm').optional().isIn(['left', 'right', 'both']),
  queryValidator('min_age').optional().isInt({ min: 0 }),
  queryValidator('max_age').optional().isInt({ min: 0 }),
  queryValidator('min_weight').optional().isFloat({ min: 0 }),
  queryValidator('max_weight').optional().isFloat({ min: 0 }),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { 
      team_id, strong_arm, min_age, max_age, min_weight, max_weight, 
      page = 1, limit = 10 
    } = req.query;
    const offset = (page - 1) * limit;

    // Construir query base
    let whereConditions = ['a.is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    if (team_id) {
      whereConditions.push(`a.team_id = $${paramIndex++}`);
      queryParams.push(team_id);
    }

    if (strong_arm) {
      whereConditions.push(`a.strong_arm = $${paramIndex++}`);
      queryParams.push(strong_arm);
    }

    if (min_age) {
      whereConditions.push(`a.age >= $${paramIndex++}`);
      queryParams.push(min_age);
    }

    if (max_age) {
      whereConditions.push(`a.age <= $${paramIndex++}`);
      queryParams.push(max_age);
    }

    if (min_weight) {
      whereConditions.push(`a.weight >= $${paramIndex++}`);
      queryParams.push(min_weight);
    }

    if (max_weight) {
      whereConditions.push(`a.weight <= $${paramIndex++}`);
      queryParams.push(max_weight);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM athletes a
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Query principal
    const mainQuery = `
      SELECT 
        a.id, a.name, a.age, a.weight, a.height, a.biography, 
        a.strong_arm, a.achievements, a.photo_url, a.created_at, a.updated_at,
        t.id as team_id, t.name as team_name, t.logo_url as team_logo,
        u.first_name, u.last_name
      FROM athletes a
      LEFT JOIN teams t ON a.team_id = t.id
      LEFT JOIN users u ON a.user_id = u.id
      ${whereClause}
      ORDER BY a.name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);
    const result = await query(mainQuery, queryParams);

    res.json({
      success: true,
      data: {
        athletes: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar atletas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/athletes:
 *   post:
 *     summary: Criar novo atleta
 *     tags: [Atletas]
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
 *               - age
 *               - weight
 *               - height
 *               - strong_arm
 *               - team_id
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *                 minimum: 0
 *               weight:
 *                 type: number
 *                 minimum: 0
 *               height:
 *                 type: number
 *                 minimum: 0
 *               biography:
 *                 type: string
 *               strong_arm:
 *                 type: string
 *                 enum: [left, right, both]
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *               team_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Atleta criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
router.post('/', [
  authenticateToken,
  requireTeamOrAdmin,
  body('name').notEmpty().trim(),
  body('age').isInt({ min: 0 }),
  body('weight').isFloat({ min: 0 }),
  body('height').isFloat({ min: 0 }),
  body('strong_arm').isIn(['left', 'right', 'both']),
  body('team_id').isInt(),
  body('biography').optional().trim(),
  body('achievements').optional().isArray()
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

    const { name, age, weight, height, biography, strong_arm, achievements, team_id } = req.body;

    // Verificar se equipe existe e se usuário tem acesso
    const teamResult = await query(`
      SELECT t.id, t.status, t.user_id 
      FROM teams t 
      WHERE t.id = $1
    `, [team_id]);

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada'
      });
    }

    const team = teamResult.rows[0];

    // Verificar se equipe está aprovada
    if (team.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Só é possível cadastrar atletas em equipes aprovadas'
      });
    }

    // Verificar se usuário é dono da equipe ou admin
    if (req.user.user_type !== 'admin' && team.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode cadastrar atletas em suas próprias equipes'
      });
    }

    // Criar atleta
    const result = await query(`
      INSERT INTO athletes (
        name, age, weight, height, biography, strong_arm, achievements, 
        team_id, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, age, weight, height, biography, strong_arm, achievements, team_id, req.user.id]);

    const athlete = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Atleta criado com sucesso',
      data: athlete
    });

  } catch (error) {
    console.error('Erro ao criar atleta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/athletes/{id}:
 *   get:
 *     summary: Obter atleta por ID
 *     tags: [Atletas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do atleta
 *       404:
 *         description: Atleta não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        a.*, t.id as team_id, t.name as team_name, t.logo_url as team_logo,
        u.first_name, u.last_name
      FROM athletes a
      LEFT JOIN teams t ON a.team_id = t.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = $1 AND a.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    const athlete = result.rows[0];

    // Buscar resultados em eventos
    const resultsResult = await query(`
      SELECT 
        er.id, er.position, er.category, er.weight_class, er.result_notes,
        e.title as event_title, e.event_date
      FROM event_results er
      JOIN events e ON er.event_id = e.id
      WHERE er.athlete_id = $1
      ORDER BY e.event_date DESC
    `, [id]);

    athlete.results = resultsResult.rows;

    res.json({
      success: true,
      data: athlete
    });

  } catch (error) {
    console.error('Erro ao buscar atleta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/athletes/{id}:
 *   put:
 *     summary: Atualizar atleta
 *     tags: [Atletas]
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
 *               age:
 *                 type: integer
 *               weight:
 *                 type: number
 *               height:
 *                 type: number
 *               biography:
 *                 type: string
 *               strong_arm:
 *                 type: string
 *               achievements:
 *                 type: array
 *               photo_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atleta atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Atleta não encontrado
 */
router.put('/:id', [
  authenticateToken,
  requireAthleteOwnershipOrAdmin,
  body('name').optional().trim(),
  body('age').optional().isInt({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  body('biography').optional().trim(),
  body('strong_arm').optional().isIn(['left', 'right', 'both']),
  body('achievements').optional().isArray(),
  body('photo_url').optional().isURL()
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
      UPDATE athletes 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Atleta atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar atleta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/athletes/{id}:
 *   delete:
 *     summary: Deletar atleta
 *     tags: [Atletas]
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
 *         description: Atleta deletado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', [
  authenticateToken,
  requireAthleteOwnershipOrAdmin
], async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se atleta tem resultados em eventos
    const resultsResult = await query('SELECT COUNT(*) as count FROM event_results WHERE athlete_id = $1', [id]);
    if (parseInt(resultsResult.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar um atleta que possui resultados em eventos'
      });
    }

    // Soft delete - marcar como inativo
    const result = await query(`
      UPDATE athletes 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Atleta deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar atleta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/athletes/{id}/results:
 *   get:
 *     summary: Obter resultados de um atleta
 *     tags: [Atletas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultados do atleta
 */
router.get('/:id/results', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se atleta existe
    const athleteResult = await query('SELECT id, name FROM athletes WHERE id = $1 AND is_active = true', [id]);
    if (athleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    // Buscar resultados
    const result = await query(`
      SELECT 
        er.id, er.position, er.category, er.weight_class, er.result_notes, er.created_at,
        e.id as event_id, e.title as event_title, e.event_date, e.city, e.state,
        t.id as team_id, t.name as team_name
      FROM event_results er
      JOIN events e ON er.event_id = e.id
      LEFT JOIN teams t ON er.team_id = t.id
      WHERE er.athlete_id = $1
      ORDER BY e.event_date DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        athlete: athleteResult.rows[0],
        results: result.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar resultados do atleta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
