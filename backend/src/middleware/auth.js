import jwt from 'jsonwebtoken';
import { query } from '../database/config.js';

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário ao req
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const userResult = await query(
      'SELECT id, email, user_type, first_name, last_name, is_active, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Adicionar usuário ao req
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se o usuário é admin
 */
export const requireAdmin = (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
  next();
};

/**
 * Middleware para verificar se o usuário é equipe ou admin
 */
export const requireTeamOrAdmin = (req, res, next) => {
  if (!['admin', 'team'].includes(req.user.user_type)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas equipes e administradores podem acessar este recurso.'
    });
  }
  next();
};

/**
 * Middleware para verificar se o usuário é dono do recurso ou admin
 */
export const requireOwnershipOrAdmin = (resourceTable, resourceIdField = 'id') => {
  return async (req, res, next) => {
    try {
      if (req.user.user_type === 'admin') {
        return next();
      }

      const resourceId = req.params[resourceIdField];
      
      // Verificar se o usuário é dono do recurso
      const result = await query(
        `SELECT user_id FROM ${resourceTable} WHERE id = $1`,
        [resourceId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
      }

      if (result.rows[0].user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Você não é dono deste recurso.'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

/**
 * Middleware para verificar se o usuário é dono da equipe ou admin
 */
export const requireTeamOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (req.user.user_type === 'admin') {
      return next();
    }

    const teamId = req.params.id || req.params.teamId;
    
    // Verificar se o usuário é dono da equipe
    const result = await query(
      'SELECT user_id FROM teams WHERE id = $1',
      [teamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipe não encontrada'
      });
    }

    if (result.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não é dono desta equipe.'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de propriedade da equipe:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se o usuário é dono do atleta ou admin
 */
export const requireAthleteOwnershipOrAdmin = async (req, res, next) => {
  try {
    if (req.user.user_type === 'admin') {
      return next();
    }

    const athleteId = req.params.id || req.params.athleteId;
    
    // Verificar se o usuário é dono do atleta (através da equipe)
    const result = await query(`
      SELECT t.user_id 
      FROM athletes a 
      JOIN teams t ON a.team_id = t.id 
      WHERE a.id = $1
    `, [athleteId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Atleta não encontrado'
      });
    }

    if (result.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não é dono deste atleta.'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de propriedade do atleta:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};
