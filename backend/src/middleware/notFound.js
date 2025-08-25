/**
 * Middleware para rotas não encontradas
 * Deve ser usado após todas as rotas
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.originalUrl} não encontrada`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};
