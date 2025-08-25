/**
 * Middleware de tratamento de erros
 * Captura todos os erros e retorna respostas padronizadas
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: err.errors
    });
  }

  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Erro de unicidade do banco
  if (err.code === '23505') {
    const field = err.constraint?.split('_')[1] || 'campo';
    return res.status(409).json({
      success: false,
      message: `${field} já existe no sistema`
    });
  }

  // Erro de chave estrangeira
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Operação não permitida. Recurso referenciado não existe.'
    });
  }

  // Erro de sintaxe SQL
  if (err.code === '42601') {
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }

  // Erro de upload de arquivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Arquivo muito grande. Tamanho máximo permitido: 5MB'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Campo de arquivo inesperado'
    });
  }

  // Erro de rate limiting
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente mais tarde.'
    });
  }

  // Erro de autenticação
  if (err.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado'
    });
  }

  // Erro de autorização
  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado'
    });
  }

  // Erro de não encontrado
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: 'Recurso não encontrado'
    });
  }

  // Erro de conflito
  if (err.status === 409) {
    return res.status(409).json({
      success: false,
      message: err.message || 'Conflito de dados'
    });
  }

  // Erro de validação de dados
  if (err.status === 422) {
    return res.status(422).json({
      success: false,
      message: 'Dados inválidos',
      errors: err.errors || []
    });
  }

  // Erro interno do servidor (padrão)
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
