import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../database/config.js';
import { authenticateToken } from '../middleware/auth.js';
import mercadopago from 'mercadopago';

const router = express.Router();

// Configurar Mercado Pago (opcional para desenvolvimento)
let mercadopagoConfigured = false;
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  try {
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    mercadopagoConfigured = true;
    console.log('✅ Mercado Pago configurado com sucesso');
  } catch (error) {
    console.error('⚠️ Erro ao configurar Mercado Pago:', error);
  }
} else {
  console.log('ℹ️ Mercado Pago não configurado. Configure MERCADOPAGO_ACCESS_TOKEN para habilitar.');
}

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Listar pagamentos do usuário
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        p.id, p.amount, p.currency, p.payment_method, p.payment_provider,
        p.provider_payment_id, p.status, p.metadata, p.created_at, p.updated_at,
        e.id as event_id, e.title as event_title, e.event_date
      FROM payments p
      LEFT JOIN events e ON p.event_id = e.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Criar pagamento para inscrição em evento
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - amount
 *             properties:
 *               event_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/create', [
  authenticateToken,
  body('event_id').isInt(),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().trim()
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

    const { event_id, amount, description } = req.body;

    // Verificar se evento existe
    const eventResult = await query('SELECT id, title, ticket_price FROM events WHERE id = $1', [event_id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    const event = eventResult.rows[0];

    // Verificar se preço está correto
    if (event.ticket_price && event.ticket_price !== amount) {
      return res.status(400).json({
        success: false,
        message: 'Valor do pagamento não corresponde ao preço do ingresso'
      });
    }

    // Verificar se usuário já tem pagamento pendente para este evento
    const existingPayment = await query(`
      SELECT id FROM payments 
      WHERE user_id = $1 AND event_id = $2 AND status IN ('pending', 'processing')
    `, [req.user.id, event_id]);

    if (existingPayment.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Você já possui um pagamento pendente para este evento'
      });
    }

    // Criar pagamento no banco
    const paymentResult = await query(`
      INSERT INTO payments (
        user_id, event_id, amount, currency, payment_provider, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [req.user.id, event_id, amount, 'BRL', 'mercadopago', 'pending']);

    const payment = paymentResult.rows[0];

    // Criar preferência no Mercado Pago
    const preference = {
      items: [
        {
          title: `Inscrição - ${event.title}`,
          quantity: 1,
          unit_price: amount,
          description: description || `Inscrição para o evento ${event.title}`
        }
      ],
      external_reference: payment.id.toString(),
      back_urls: {
        success: `${process.env.API_URL || 'http://localhost:3001'}/api/payments/success`,
        failure: `${process.env.API_URL || 'http://localhost:3001'}/api/payments/failure`,
        pending: `${process.env.API_URL || 'http://localhost:3001'}/api/payments/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.API_URL || 'http://localhost:3001'}/api/payments/webhook`
    };

    // Verificar se Mercado Pago está configurado
    if (!mercadopagoConfigured) {
      // Deletar pagamento se Mercado Pago não estiver configurado
      await query('DELETE FROM payments WHERE id = $1', [payment.id]);
      
      return res.status(503).json({
        success: false,
        message: 'Serviço de pagamento temporariamente indisponível. Configure o Mercado Pago para habilitar.'
      });
    }

    try {
      const mpResponse = await mercadopago.preferences.create(preference);
      
      // Atualizar pagamento com ID do Mercado Pago
      await query(`
        UPDATE payments 
        SET provider_payment_id = $1, metadata = $2
        WHERE id = $3
      `, [mpResponse.body.id, { preference_id: mpResponse.body.id }]);

      res.json({
        success: true,
        message: 'Pagamento criado com sucesso',
        data: {
          payment_id: payment.id,
          preference_id: mpResponse.body.id,
          init_point: mpResponse.body.init_point,
          sandbox_init_point: mpResponse.body.sandbox_init_point
        }
      });

    } catch (mpError) {
      console.error('Erro ao criar preferência no Mercado Pago:', mpError);
      
      // Deletar pagamento se falhar
      await query('DELETE FROM payments WHERE id = $1', [payment.id]);
      
      res.status(500).json({
        success: false,
        message: 'Erro ao processar pagamento. Tente novamente.'
      });
    }

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Obter detalhes do pagamento
 *     tags: [Pagamentos]
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
 *         description: Detalhes do pagamento
 *       404:
 *         description: Pagamento não encontrado
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.*, e.title as event_title, e.event_date
      FROM payments p
      LEFT JOIN events e ON p.event_id = e.id
      WHERE p.id = $1 AND p.user_id = $2
    `, [id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Webhook do Mercado Pago
 *     tags: [Pagamentos]
 *     responses:
 *       200:
 *         description: Webhook processado
 */
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      // Verificar se Mercado Pago está configurado
      if (!mercadopagoConfigured) {
        console.error('Webhook recebido mas Mercado Pago não está configurado');
        return res.status(503).json({ error: 'Serviço de pagamento indisponível' });
      }

      const paymentId = data.id;

      // Buscar informações do pagamento no Mercado Pago
      const paymentInfo = await mercadopago.payment.findById(paymentId);
      const payment = paymentInfo.body;

      // Buscar pagamento no banco pelo external_reference
      const dbPayment = await query(`
        SELECT p.*, e.title as event_title
        FROM payments p
        LEFT JOIN events e ON p.event_id = e.id
        WHERE p.provider_payment_id = $1
      `, [payment.external_reference]);

      if (dbPayment.rows.length === 0) {
        console.error('Pagamento não encontrado no banco:', payment.external_reference);
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      const dbPaymentData = dbPayment.rows[0];

      // Atualizar status do pagamento
      let newStatus = 'pending';
      switch (payment.status) {
        case 'approved':
          newStatus = 'completed';
          break;
        case 'rejected':
          newStatus = 'failed';
          break;
        case 'cancelled':
          newStatus = 'cancelled';
          break;
        case 'in_process':
          newStatus = 'processing';
          break;
      }

      await query(`
        UPDATE payments 
        SET status = $1, metadata = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [newStatus, { ...dbPaymentData.metadata, mp_payment: payment }, dbPaymentData.id]);

      // Se pagamento foi aprovado, atualizar inscrição no evento
      if (newStatus === 'completed') {
        await query(`
          UPDATE event_registrations 
          SET payment_status = 'paid', payment_id = $1
          WHERE event_id = $2 AND athlete_id IN (
            SELECT a.id FROM athletes a 
            JOIN teams t ON a.team_id = t.id 
            WHERE t.user_id = $3
          )
        `, [dbPaymentData.id, dbPaymentData.event_id, dbPaymentData.user_id]);
      }

      console.log(`Pagamento ${dbPaymentData.id} atualizado para status: ${newStatus}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/payments/success:
 *   get:
 *     summary: Página de sucesso do pagamento
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         schema:
 *           type: string
 *         description: ID do pagamento
 *       - in: query
 *         name: preference_id
 *         schema:
 *           type: string
 *         description: ID da preferência
 *     responses:
 *       200:
 *         description: Página de sucesso
 */
router.get('/success', async (req, res) => {
  try {
    const { payment_id, preference_id } = req.query;

    if (!payment_id || !preference_id) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos'
      });
    }

    // Buscar pagamento
    const paymentResult = await query(`
      SELECT p.*, e.title as event_title
      FROM payments p
      LEFT JOIN events e ON p.event_id = e.id
      WHERE p.provider_payment_id = $1
    `, [preference_id]);

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado'
      });
    }

    const payment = paymentResult.rows[0];

    res.json({
      success: true,
      message: 'Pagamento realizado com sucesso!',
      data: {
        payment_id: payment.id,
        event_title: payment.event_title,
        amount: payment.amount,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Erro na página de sucesso:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/payments/failure:
 *   get:
 *     summary: Página de falha do pagamento
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         schema:
 *           type: string
 *         description: ID do pagamento
 *       - in: query
 *         name: preference_id
 *         schema:
 *           type: string
 *         description: ID da preferência
 *     responses:
 *       200:
 *         description: Página de falha
 */
router.get('/failure', async (req, res) => {
  try {
    const { payment_id, preference_id } = req.query;

    if (!payment_id || !preference_id) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos'
      });
    }

    res.json({
      success: false,
      message: 'Pagamento falhou. Tente novamente ou entre em contato com o suporte.',
      data: {
        preference_id,
        payment_id
      }
    });

  } catch (error) {
    console.error('Erro na página de falha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/payments/pending:
 *   get:
 *     summary: Página de pagamento pendente
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         schema:
 *           type: string
 *         description: ID do pagamento
 *       - in: query
 *         name: preference_id
 *         schema:
 *           type: string
 *         description: ID da preferência
 *     responses:
 *       200:
 *         description: Página de pendente
 */
router.get('/pending', async (req, res) => {
  try {
    const { payment_id, preference_id } = req.query;

    if (!payment_id || !preference_id) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos'
      });
    }

    res.json({
      success: true,
      message: 'Pagamento está sendo processado. Você receberá uma notificação quando for confirmado.',
      data: {
        preference_id,
        payment_id
      }
    });

  } catch (error) {
    console.error('Erro na página de pendente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
