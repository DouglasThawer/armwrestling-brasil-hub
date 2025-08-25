import pkg from 'pg';
const { Pool } = pkg;

// Configuração do pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'armwrestling_brasil',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sua_senha_aqui',
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000, // tempo máximo que uma conexão pode ficar ociosa
  connectionTimeoutMillis: 2000, // tempo máximo para estabelecer uma conexão
});

// Eventos do pool
pool.on('connect', (client) => {
  console.log('🔌 Nova conexão com o banco de dados estabelecida');
});

pool.on('error', (err, client) => {
  console.error('❌ Erro inesperado no cliente do banco de dados:', err);
});

// Função para executar queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log de queries em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Query executada em ${duration}ms:`, text.substring(0, 100) + '...');
    }
    
    return res;
  } catch (error) {
    console.error('❌ Erro na query:', error);
    console.error('📝 Query:', text);
    console.error('🔢 Parâmetros:', params);
    throw error;
  }
};

// Função para obter um cliente do pool
export const getClient = () => {
  return pool.connect();
};

// Função para fechar o pool (usar apenas no shutdown da aplicação)
export const closePool = async () => {
  await pool.end();
  console.log('🔌 Pool de conexões fechado');
};

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexão com banco de dados estabelecida:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com banco de dados:', error);
    return false;
  }
};

// Função para verificar se as tabelas existem
export const checkTables = async () => {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    console.log('📋 Tabelas encontradas:', tables);
    return tables;
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
    return [];
  }
};

export default pool;
