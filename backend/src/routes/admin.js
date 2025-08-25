import express from 'express';
import { query } from '../database/config.js';
import { 
  authenticateToken, 
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de admin requerem autenticação e permissão de admin
router.use(authenticateToken, requireAdmin);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Dashboard administrativo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard
 *       403:
 *         description: Acesso negado
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Estatísticas gerais
    const totalUsers = await query('SELECT COUNT(*) as total FROM users');
    const totalTeams = await query('SELECT COUNT(*) as total FROM teams');
    const totalAthletes = await query('SELECT COUNT(*) as total FROM athletes WHERE is_active = true');
    const totalEvents = await query('SELECT COUNT(*) as total FROM events');
    const totalPosts = await query('SELECT COUNT(*) as total FROM posts');
    const totalSponsors = await query('SELECT COUNT(*) as total FROM sponsors');

    // Usuários por tipo
    const usersByType = await query(`
      SELECT user_type, COUNT(*) as count
      FROM users
      GROUP BY user_type
      ORDER BY count DESC
    `);

    // Equipes por status
    const teamsByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM teams
      GROUP BY status
      ORDER BY count DESC
    `);

    // Eventos por status
    const eventsByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM events
      GROUP BY status
      ORDER BY count DESC
    `);

    // Posts por status
    const postsByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM posts
      GROUP BY status
      ORDER BY count DESC
    `);

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

    // Equipes por estado
    const teamsByState = await query(`
      SELECT state, COUNT(*) as count
      FROM teams
      WHERE state IS NOT NULL
      GROUP BY state
      ORDER BY count DESC
      LIMIT 10
    `);

    // Eventos por mês (próximos 6 meses)
    const monthlyEvents = await query(`
      SELECT 
        DATE_TRUNC('month', event_date) as month,
        COUNT(*) as count
      FROM events
      WHERE event_date >= NOW() - INTERVAL '1 month' AND event_date <= NOW() + INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', event_date)
      ORDER BY month
    `);

    // Pagamentos por status
    const paymentsByStatus = await query(`
      SELECT status, COUNT(*) as count, SUM(amount) as total_amount
      FROM payments
      GROUP BY status
      ORDER BY count DESC
    `);

    // Total de receita
    const totalRevenue = await query(`
      SELECT SUM(amount) as total
      FROM payments
      WHERE status = 'completed'
    `);

    res.json({
      success: true,
      data: {
        overview: {
          total_users: parseInt(totalUsers.rows[0].total),
          total_teams: parseInt(totalTeams.rows[0].total),
          total_athletes: parseInt(totalAthletes.rows[0].total),
          total_events: parseInt(totalEvents.rows[0].total),
          total_posts: parseInt(totalPosts.rows[0].total),
          total_sponsors: parseInt(totalSponsors.rows[0].total),
          total_revenue: parseFloat(totalRevenue.rows[0].total || 0)
        },
        users_by_type: usersByType.rows,
        teams_by_status: teamsByStatus.rows,
        events_by_status: eventsByStatus.rows,
        posts_by_status: postsByStatus.rows,
        monthly_users: monthlyUsers.rows,
        teams_by_state: teamsByState.rows,
        monthly_events: monthlyEvents.rows,
        payments_by_status: paymentsByStatus.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/admin/reports/users:
 *   get:
 *     summary: Relatório detalhado de usuários
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim
 *     responses:
 *       200:
 *         description: Relatório de usuários
 */
router.get('/reports/users', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let queryParams = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
      queryParams = [start_date, end_date];
    }

    // Usuários por tipo e período
    const usersByTypePeriod = await query(`
      SELECT 
        user_type,
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active,
        COUNT(CASE WHEN email_verified = true THEN 1 END) as verified
      FROM users
      ${dateFilter}
      GROUP BY user_type
      ORDER BY total DESC
    `, queryParams);

    // Usuários por mês
    const usersByMonth = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as total,
        COUNT(CASE WHEN user_type = 'team' THEN 1 END) as teams,
        COUNT(CASE WHEN user_type = 'visitor' THEN 1 END) as visitors
      FROM users
      ${dateFilter}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `, queryParams);

    // Usuários por estado (através das equipes)
    const usersByState = await query(`
      SELECT 
        t.state,
        COUNT(DISTINCT u.id) as user_count,
        COUNT(DISTINCT t.id) as team_count
      FROM users u
      JOIN teams t ON u.id = t.user_id
      WHERE u.user_type = 'team'
      ${dateFilter ? 'AND u.created_at BETWEEN $1 AND $2' : ''}
      GROUP BY t.state
      ORDER BY user_count DESC
      LIMIT 15
    `, queryParams);

    res.json({
      success: true,
      data: {
        by_type: usersByTypePeriod.rows,
        by_month: usersByMonth.rows,
        by_state: usersByState.rows
      }
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/admin/reports/events:
 *   get:
 *     summary: Relatório detalhado de eventos
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim
 *     responses:
 *       200:
 *         description: Relatório de eventos
 */
router.get('/reports/events', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let queryParams = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE e.event_date BETWEEN $1 AND $2';
      queryParams = [start_date, end_date];
    }

    // Eventos por status e período
    const eventsByStatus = await query(`
      SELECT 
        e.status,
        COUNT(*) as total,
        AVG(e.ticket_price) as avg_ticket_price,
        SUM(e.current_participants) as total_participants,
        SUM(e.max_participants) as total_capacity
      FROM events e
      ${dateFilter}
      GROUP BY e.status
      ORDER BY total DESC
    `, queryParams);

    // Eventos por mês
    const eventsByMonth = await query(`
      SELECT 
        DATE_TRUNC('month', e.event_date) as month,
        COUNT(*) as total,
        COUNT(CASE WHEN e.status = 'upcoming' THEN 1 END) as upcoming,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed,
        AVG(e.ticket_price) as avg_ticket_price
      FROM events e
      ${dateFilter}
      GROUP BY DATE_TRUNC('month', e.event_date)
      ORDER BY month
    `, queryParams);

    // Eventos por equipe organizadora
    const eventsByTeam = await query(`
      SELECT 
        t.name as team_name,
        t.city,
        t.state,
        COUNT(e.id) as total_events,
        AVG(e.ticket_price) as avg_ticket_price,
        SUM(e.current_participants) as total_participants
      FROM events e
      JOIN teams t ON e.team_id = t.id
      ${dateFilter ? 'WHERE e.event_date BETWEEN $1 AND $2' : ''}
      GROUP BY t.id, t.name, t.city, t.state
      ORDER BY total_events DESC
      LIMIT 15
    `, queryParams);

    // Inscrições por evento
    const registrationsByEvent = await query(`
      SELECT 
        e.title as event_title,
        e.event_date,
        e.ticket_price,
        COUNT(er.id) as total_registrations,
        COUNT(CASE WHEN er.payment_status = 'paid' THEN 1 END) as paid_registrations,
        COUNT(CASE WHEN er.payment_status = 'pending' THEN 1 END) as pending_registrations
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      ${dateFilter ? 'WHERE e.event_date BETWEEN $1 AND $2' : ''}
      GROUP BY e.id, e.title, e.event_date, e.ticket_price
      ORDER BY e.event_date DESC
      LIMIT 20
    `, queryParams);

    res.json({
      success: true,
      data: {
        by_status: eventsByStatus.rows,
        by_month: eventsByMonth.rows,
        by_team: eventsByTeam.rows,
        registrations: registrationsByEvent.rows
      }
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/admin/reports/financial:
 *   get:
 *     summary: Relatório financeiro
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim
 *     responses:
 *       200:
 *         description: Relatório financeiro
 */
router.get('/reports/financial', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let queryParams = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE p.created_at BETWEEN $1 AND $2';
      queryParams = [start_date, end_date];
    }

    // Receita por período
    const revenueByPeriod = await query(`
      SELECT 
        DATE_TRUNC('day', p.created_at) as day,
        COUNT(*) as total_payments,
        SUM(p.amount) as total_revenue,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as successful_payments,
        SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as successful_revenue
      FROM payments p
      ${dateFilter}
      GROUP BY DATE_TRUNC('day', p.created_at)
      ORDER BY day DESC
      LIMIT 30
    `, queryParams);

    // Receita por mês
    const revenueByMonth = await query(`
      SELECT 
        DATE_TRUNC('month', p.created_at) as month,
        COUNT(*) as total_payments,
        SUM(p.amount) as total_revenue,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as successful_payments,
        SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as successful_revenue
      FROM payments p
      ${dateFilter}
      GROUP BY DATE_TRUNC('month', p.created_at)
      ORDER BY month DESC
      LIMIT 12
    `, queryParams);

    // Receita por evento
    const revenueByEvent = await query(`
      SELECT 
        e.title as event_title,
        e.event_date,
        COUNT(p.id) as total_payments,
        SUM(p.amount) as total_revenue,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as successful_payments,
        SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as successful_revenue
      FROM payments p
      JOIN events e ON p.event_id = e.id
      ${dateFilter ? 'WHERE p.created_at BETWEEN $1 AND $2' : ''}
      GROUP BY e.id, e.title, e.event_date
      ORDER BY successful_revenue DESC
      LIMIT 20
    `, queryParams);

    // Status dos pagamentos
    const paymentsByStatus = await query(`
      SELECT 
        p.status,
        COUNT(*) as count,
        SUM(p.amount) as total_amount,
        AVG(p.amount) as avg_amount
      FROM payments p
      ${dateFilter}
      GROUP BY p.status
      ORDER BY count DESC
    `, queryParams);

    // Total geral
    const totalSummary = await query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(p.amount) as total_revenue,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as successful_payments,
        SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as successful_revenue,
        COUNT(CASE WHEN p.status = 'failed' THEN 1 END) as failed_payments,
        COUNT(CASE WHEN p.status = 'pending' THEN 1 END) as pending_payments
      FROM payments p
      ${dateFilter}
    `, queryParams);

    res.json({
      success: true,
      data: {
        summary: totalSummary.rows[0],
        by_period: revenueByPeriod.rows,
        by_month: revenueByMonth.rows,
        by_event: revenueByEvent.rows,
        by_status: paymentsByStatus.rows
      }
    });

  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/admin/analytics/engagement:
 *   get:
 *     summary: Análise de engajamento
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Análise de engajamento
 */
router.get('/analytics/engagement', async (req, res) => {
  try {
    // Taxa de conversão de usuários para equipes
    const teamConversionRate = await query(`
      SELECT 
        COUNT(CASE WHEN u.user_type = 'team' THEN 1 END) as team_users,
        COUNT(*) as total_users,
        ROUND(
          (COUNT(CASE WHEN u.user_type = 'team' THEN 1 END)::decimal / COUNT(*)) * 100, 2
        ) as conversion_rate
      FROM users u
      WHERE u.created_at >= NOW() - INTERVAL '30 days'
    `);

    // Taxa de aprovação de equipes
    const teamApprovalRate = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_teams,
        COUNT(*) as total_teams,
        ROUND(
          (COUNT(CASE WHEN status = 'approved' THEN 1 END)::decimal / COUNT(*)) * 100, 2
        ) as approval_rate
      FROM teams
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    // Participação em eventos
    const eventParticipation = await query(`
      SELECT 
        AVG(e.current_participants::decimal / NULLIF(e.max_participants, 0)) * 100 as avg_participation_rate,
        COUNT(CASE WHEN e.current_participants >= e.max_participants * 0.8 THEN 1 END) as high_participation_events,
        COUNT(*) as total_events
      FROM events e
      WHERE e.max_participants IS NOT NULL AND e.max_participants > 0
    `);

    // Atividade de usuários
    const userActivity = await query(`
      SELECT 
        COUNT(DISTINCT u.id) as active_users,
        COUNT(*) as total_users,
        ROUND(
          (COUNT(DISTINCT u.id)::decimal / COUNT(*)) * 100, 2
        ) as activity_rate
      FROM users u
      WHERE u.last_login >= NOW() - INTERVAL '7 days' OR u.updated_at >= NOW() - INTERVAL '7 days'
    `);

    // Crescimento mensal
    const monthlyGrowth = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_users,
        LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as prev_month_users,
        ROUND(
          ((COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)))::decimal / 
           NULLIF(LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)), 0)) * 100, 2
        ) as growth_rate
      FROM users
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    res.json({
      success: true,
      data: {
        team_conversion: teamConversionRate.rows[0],
        team_approval: teamApprovalRate.rows[0],
        event_participation: eventParticipation.rows[0],
        user_activity: userActivity.rows[0],
        monthly_growth: monthlyGrowth.rows
      }
    });

  } catch (error) {
    console.error('Erro ao gerar análise de engajamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
