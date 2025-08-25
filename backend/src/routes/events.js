import express from 'express';
import { body, validationResult, query as queryValidator } from 'express-validator';
import { query } from '../database/config.js';
import { 
  authenticateToken, 
  requireTeamOrAdmin, 
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Listar eventos
 *     tags: [Eventos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
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
 *         name: team_id
 *         schema:
 *           type: integer
 *         description: Filtrar por equipe organizadora
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
 *         description: Lista de eventos
 */
router.get('/', [
  queryValidator('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']),
  queryValidator('city').optional().trim(),
  queryValidator('state').optional().trim(),
  queryValidator('team_id').optional().isInt(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { status, city, state, team_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construir query base
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`e.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (city) {
      whereConditions.push(`e.city ILIKE $${paramIndex++}`);
      queryParams.push(`%${city}%`);
    }

    if (state) {
      whereConditions.push(`e.state ILIKE $${paramIndex++}`);
      queryParams.push(`%${state}%`);
    }

    if (team_id) {
      whereConditions.push(`e.team_id = $${paramIndex++}`);
      queryParams.push(team_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM events e
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Query principal
    const mainQuery = `
      SELECT 
        e.id, e.title, e.description, e.address, e.city, e.state, e.zip_code,
        e.latitude, e.longitude, e.event_date, e.registration_deadline,
        e.phone, e.email, e.ticket_link, e.ticket_price, e.max_participants,
        e.current_participants, e.status, e.created_at, e.updated_at,
        t.id as team_id, t.name as team_name, t.logo_url as team_logo,
        u.first_name, u.last_name
      FROM events e
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN users u ON e.created_by = u.id
      ${whereClause}
      ORDER BY e.event_date ASC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);
    const result = await query(mainQuery, queryParams);

    res.json({
      success: true,
      data: {
        events: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Criar novo evento
 *     tags: [Eventos]
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
 *               - description
 *               - address
 *               - city
 *               - state
 *               - event_date
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 format: date-time
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               ticket_link:
 *                 type: string
 *               ticket_price:
 *                 type: number
 *               max_participants:
 *                 type: integer
 *               team_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', [
  authenticateToken,
  requireTeamOrAdmin,
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('state').notEmpty().trim(),
  body('zip_code').optional().trim(),
  body('event_date').isISO8601(),
  body('registration_deadline').optional().isISO8601(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('ticket_link').optional().isURL(),
  body('ticket_price').optional().isFloat({ min: 0 }),
  body('max_participants').optional().isInt({ min: 1 }),
  body('team_id').optional().isInt()
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
      title, description, address, city, state, zip_code, event_date,
      registration_deadline, phone, email, ticket_link, ticket_price,
      max_participants, team_id
    } = req.body;

    // Verificar se data do evento é futura
    if (new Date(event_date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'A data do evento deve ser futura'
      });
    }

    // Verificar se deadline de inscrição é anterior à data do evento
    if (registration_deadline && new Date(registration_deadline) >= new Date(event_date)) {
      return res.status(400).json({
        success: false,
        message: 'O prazo de inscrição deve ser anterior à data do evento'
      });
    }

    // Se team_id não foi fornecido, usar equipe do usuário
    let finalTeamId = team_id;
    if (!finalTeamId && req.user.user_type === 'team') {
      const teamResult = await query('SELECT id FROM teams WHERE user_id = $1', [req.user.id]);
      if (teamResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Você deve ter uma equipe aprovada para criar eventos'
        });
      }
      finalTeamId = teamResult.rows[0].id;
    }

    // Criar evento
    const result = await query(`
      INSERT INTO events (
        title, description, address, city, state, zip_code, event_date,
        registration_deadline, phone, email, ticket_link, ticket_price,
        max_participants, team_id, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      title, description, address, city, state, zip_code, event_date,
      registration_deadline, phone, email, ticket_link, ticket_price,
      max_participants, finalTeamId, req.user.id
    ]);

    const event = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      data: event
    });

  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obter evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do evento
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        e.*, t.id as team_id, t.name as team_name, t.logo_url as team_logo,
        u.first_name, u.last_name
      FROM events e
      LEFT JOIN teams t ON e.team_id = t.id
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    const event = result.rows[0];

    // Buscar inscrições do evento
    const registrationsResult = await query(`
      SELECT 
        er.id, er.registration_date, er.status, er.payment_status, er.notes,
        a.id as athlete_id, a.name as athlete_name, a.photo_url as athlete_photo,
        t.id as team_id, t.name as team_name
      FROM event_registrations er
      JOIN athletes a ON er.athlete_id = a.id
      LEFT JOIN teams t ON er.team_id = t.id
      WHERE er.event_id = $1
      ORDER BY er.registration_date
    `, [id]);

    event.registrations = registrationsResult.rows;

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Inscrever atleta em evento
 *     tags: [Eventos]
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
 *             required:
 *               - athlete_id
 *             properties:
 *               athlete_id:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inscrição realizada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/:id/register', [
  authenticateToken,
  requireTeamOrAdmin,
  body('athlete_id').isInt(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { athlete_id, notes } = req.body;

    // Verificar se evento existe e está aberto para inscrições
    const eventResult = await query(`
      SELECT id, title, status, registration_deadline, max_participants, current_participants
      FROM events WHERE id = $1
    `, [eventId]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    const event = eventResult.rows[0];

    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Evento não está aberto para inscrições'
      });
    }

    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return res.status(400).json({
        success: false,
        message: 'Prazo de inscrição encerrado'
      });
    }

    if (event.max_participants && event.current_participants >= event.max_participants) {
      return res.status(400).json({
        success: false,
        message: 'Evento lotado'
      });
    }

    // Verificar se atleta existe e se usuário tem acesso
    const athleteResult = await query(`
      SELECT a.id, a.name, a.team_id, t.user_id
      FROM athletes a
      JOIN teams t ON a.team_id = t.id
      WHERE a.id = $1 AND a.is_active = true
    `, [athlete_id]);

    if (athleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    const athlete = athleteResult.rows[0];

    // Verificar se usuário é dono do atleta ou admin
    if (req.user.user_type !== 'admin' && athlete.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode inscrever seus próprios atletas'
      });
    }

    // Verificar se atleta já está inscrito
    const existingRegistration = await query(`
      SELECT id FROM event_registrations 
      WHERE event_id = $1 AND athlete_id = $2
    `, [eventId, athlete_id]);

    if (existingRegistration.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Atleta já está inscrito neste evento'
      });
    }

    // Realizar inscrição
    const registrationResult = await query(`
      INSERT INTO event_registrations (
        event_id, athlete_id, team_id, notes
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [eventId, athlete_id, athlete.team_id, notes]);

    // Atualizar contador de participantes
    await query(`
      UPDATE events 
      SET current_participants = current_participants + 1
      WHERE id = $1
    `, [eventId]);

    res.json({
      success: true,
      message: 'Inscrição realizada com sucesso',
      data: registrationResult.rows[0]
    });

  } catch (error) {
    console.error('Erro ao inscrever atleta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/events/{id}/results:
 *   post:
 *     summary: Adicionar resultado de evento (apenas admin)
 *     tags: [Eventos]
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
 *             required:
 *               - athlete_id
 *               - position
 *               - category
 *             properties:
 *               athlete_id:
 *                 type: integer
 *               team_id:
 *                 type: integer
 *               position:
 *                 type: integer
 *               category:
 *                 type: string
 *               weight_class:
 *                 type: string
 *               result_notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resultado adicionado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post('/:id/results', [
  authenticateToken,
  requireAdmin,
  body('athlete_id').isInt(),
  body('team_id').optional().isInt(),
  body('position').isInt({ min: 1 }),
  body('category').notEmpty().trim(),
  body('weight_class').optional().trim(),
  body('result_notes').optional().trim()
], async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { athlete_id, team_id, position, category, weight_class, result_notes } = req.body;

    // Verificar se evento existe
    const eventResult = await query('SELECT id, title FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    // Verificar se atleta existe
    const athleteResult = await query('SELECT id, name FROM athletes WHERE id = $1', [athlete_id]);
    if (athleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    // Verificar se resultado já existe para este atleta neste evento
    const existingResult = await query(`
      SELECT id FROM event_results 
      WHERE event_id = $1 AND athlete_id = $2
    `, [eventId, athlete_id]);

    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Resultado já existe para este atleta neste evento'
      });
    }

    // Adicionar resultado
    const result = await query(`
      INSERT INTO event_results (
        event_id, athlete_id, team_id, position, category, weight_class, result_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [eventId, athlete_id, team_id, position, category, weight_class, result_notes]);

    res.json({
      success: true,
      message: 'Resultado adicionado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao adicionar resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/events/{id}/results:
 *   get:
 *     summary: Obter resultados de um evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultados do evento
 */
router.get('/:id/results', async (req, res) => {
  try {
    const { id: eventId } = req.params;

    // Verificar se evento existe
    const eventResult = await query('SELECT id, title FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    // Buscar resultados
    const result = await query(`
      SELECT 
        er.id, er.position, er.category, er.weight_class, er.result_notes, er.created_at,
        a.id as athlete_id, a.name as athlete_name, a.photo_url as athlete_photo,
        t.id as team_id, t.name as team_name
      FROM event_results er
      JOIN athletes a ON er.athlete_id = a.id
      LEFT JOIN teams t ON er.team_id = t.id
      WHERE er.event_id = $1
      ORDER BY er.position, er.category
    `, [eventId]);

    res.json({
      success: true,
      data: {
        event: eventResult.rows[0],
        results: result.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar resultados do evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
