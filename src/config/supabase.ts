// Configuração do Supabase
export const SUPABASE_CONFIG = {
  // URL do projeto
  url: "https://qvpflozwwtjbjfwfmjco.supabase.co",
  
  // Chave pública (anon key)
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGZsb3p3d3RqYmpmd2ZtamNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDA0MzksImV4cCI6MjA3MTMxNjQzOX0.AHLuWMyt240UF3L9r0P4qvvXaNqbbFIbYL9oR4kja2w",
  
  // Configurações de conexão
  connection: {
    // URL de conexão direta (para debugging)
    directUrl: "postgresql://postgres:[YOUR-PASSWORD]@db.qvpflozwwtjbjfwfmjco.supabase.co:5432/postgres",
    
    // Host do banco
    host: "db.qvpflozwwtjbjfwfmjco.supabase.co",
    
    // Porta do banco
    port: 5432,
    
    // Nome do banco
    database: "postgres",
    
    // Usuário do banco
    user: "postgres"
  }
};

// Verificar se as configurações estão corretas
export const validateSupabaseConfig = () => {
  const issues: string[] = [];
  
  // Verificar URL
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.url.includes('supabase.co')) {
    issues.push('URL do Supabase inválida');
  }
  
  // Verificar chave anônima
  if (!SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.anonKey.length < 100) {
    issues.push('Chave anônima inválida');
  }
  
  // Verificar configurações de conexão
  if (SUPABASE_CONFIG.connection.directUrl.includes('[YOUR-PASSWORD]')) {
    issues.push('Senha do banco não configurada (use a senha real do seu projeto)');
  }
  
  // Verificar host
  if (!SUPABASE_CONFIG.connection.host || !SUPABASE_CONFIG.connection.host.includes('supabase.co')) {
    issues.push('Host do banco inválido');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config: SUPABASE_CONFIG
  };
};

// Informações sobre o projeto
export const PROJECT_INFO = {
  name: "Armwrestling Brasil Hub",
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
  supabaseProject: "qvpflozwwtjbjfwfmjco",
  region: "us-east-1", // Região padrão do Supabase
  features: [
    "Authentication",
    "Database",
    "Row Level Security (RLS)",
    "Real-time subscriptions",
    "Storage"
  ]
};

// Status de verificação
export const checkProjectStatus = async () => {
  try {
    // Aqui você pode adicionar verificações adicionais
    // como testar a conectividade com o banco
    
    return {
      status: "active",
      lastChecked: new Date().toISOString(),
      config: validateSupabaseConfig(),
      project: PROJECT_INFO
    };
  } catch (error) {
    return {
      status: "error",
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Erro desconhecido",
      config: validateSupabaseConfig(),
      project: PROJECT_INFO
    };
  }
};

