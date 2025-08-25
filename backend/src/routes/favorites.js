import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../database/config.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Listar favoritos do usuário
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        f.id, f.created_at,
        t.id as team_id, t.name as team_name, t.logo_url as team_logo, t.city as team_city, t.state as team_state,
        a.id as athlete_id, a.name as athlete_name, a.photo_url as athlete_photo, a.strong_arm as athlete_strong_arm
      FROM favorites f
      LEFT JOIN teams t ON f.team_id = t.id
      LEFT JOIN athletes a ON f.athlete_id = a.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `, [req.user.id]);

    // Separar favoritos por tipo
    const teamFavorites = result.rows.filter(fav => fav.team_id);
    const athleteFavorites = result.rows.filter(fav => fav.athlete_id);

    res.json({
      success: true,
      data: {
        teams: teamFavorites,
        athletes: athleteFavorites,
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/favorites/teams:
 *   post:
 *     summary: Adicionar equipe aos favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_id
 *             properties:
 *               team_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Equipe adicionada aos favoritos
 *       400:
 *         description: Dados inválidos
 */
router.post('/teams', [
  authenticateToken,
  body('team_id').isInt()
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

    const { team_id } = req.body;

    // Verificar se equipe existe
    const teamResult = await query('SELECT id, name FROM teams WHERE id = $1 AND status = \'approved\'', [team_id]);
    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada ou não aprovada'
      });
    }

    // Verificar se já está nos favoritos
    const existingFavorite = await query('SELECT id FROM favorites WHERE user_id = $1 AND team_id = $2', [req.user.id, team_id]);
    if (existingFavorite.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Equipe já está nos seus favoritos'
      });
    }

    // Adicionar aos favoritos
    const result = await query(`
      INSERT INTO favorites (user_id, team_id)
      VALUES ($1, $2)
      RETURNING *
    `, [req.user.id, team_id]);

    res.json({
      success: true,
      message: 'Equipe adicionada aos favoritos',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao adicionar equipe aos favoritos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/favorites/athletes:
 *   post:
 *     summary: Adicionar atleta aos favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Atleta adicionado aos favoritos
 *       400:
 *         description: Dados inválidos
 */
router.post('/athletes', [
  authenticateToken,
  body('athlete_id').isInt()
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

    const { athlete_id } = req.body;

    // Verificar se atleta existe
    const athleteResult = await query('SELECT id, name FROM athletes WHERE id = $1 AND is_active = true', [athlete_id]);
    if (athleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    // Verificar se já está nos favoritos
    const existingFavorite = await query('SELECT id FROM favorites WHERE user_id = $1 AND athlete_id = $2', [req.user.id, athlete_id]);
    if (existingFavorite.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Atleta já está nos seus favoritos'
      });
    }

    // Adicionar aos favoritos
    const result = await query(`
      INSERT INTO favorites (user_id, athlete_id)
      VALUES ($1, $2)
      RETURNING *
    `, [req.user.id, athlete_id]);

    res.json({
      success: true,
      message: 'Atleta adicionado aos favoritos',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao adicionar atleta aos favoritos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Remover favorito
 *     tags: [Favoritos]
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
 *         description: Favorito removido com sucesso
 *       404:
 *         description: Favorito não encontrado
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se favorito existe e pertence ao usuário
    const favoriteResult = await query('SELECT id FROM favorites WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (favoriteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorito não encontrado'
      });
    }

    // Remover favorito
    await query('DELETE FROM favorites WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Favorito removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/favorites/check:
 *   post:
 *     summary: Verificar se item está nos favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - id
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [team, athlete]
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Status do favorito
 */
router.post('/check', [
  authenticateToken,
  body('type').isIn(['team', 'athlete']),
  body('id').isInt()
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

    const { type, id } = req.body;

    let queryField;
    if (type === 'team') {
      queryField = 'team_id';
    } else {
      queryField = 'athlete_id';
    }

    // Verificar se está nos favoritos
    const result = await query(`SELECT id FROM favorites WHERE user_id = $1 AND ${queryField} = $2`, [req.user.id, id]);

    res.json({
      success: true,
      data: {
        isFavorite: result.rows.length > 0,
        favoriteId: result.rows.length > 0 ? result.rows[0].id : null
      }
    });

  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
