import pkg from 'pg';
import { testConnection as testSQLiteConnection, checkTables as checkSQLiteTables, query as sqliteQuery, run as sqliteRun, getClient as getSQLiteClient, closeDatabase as closeSQLitePool } from './config-sqlite.js';

const { Pool } = pkg;

// Configuração do pool de conexões PostgreSQL
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

// Verificar se deve usar SQLite (quando PostgreSQL não estiver configurado)
const useSQLite = !process.env.DB_HOST || process.env.DB_HOST === 'localhost' && !process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'sua_senha_aqui';

// Eventos do pool
pool.on('connect', (client) => {
  console.log('🔌 Nova conexão com o banco de dados estabelecida');
});

pool.on('error', (err, client) => {
  console.error('❌ Erro inesperado no cliente do banco de dados:', err);
});

// Função para executar queries
export const query = async (text, params) => {
  if (useSQLite) {
    return await sqliteQuery(text, params);
  }
  
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
export const getClient = async () => {
  if (useSQLite) {
    return await getSQLiteClient();
  }
  return pool.connect();
};

// Função para fechar o pool (usar apenas no shutdown da aplicação)
export const closePool = async () => {
  if (useSQLite) {
    await closeSQLitePool();
  } else {
    await pool.end();
    console.log('🔌 Pool de conexões PostgreSQL fechado');
  }
};

// Função para testar a conexão
export const testConnection = async () => {
  if (useSQLite) {
    return await testSQLiteConnection();
  }
  
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexão com banco de dados PostgreSQL estabelecida:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com banco de dados PostgreSQL:', error);
    return false;
  }
};

// Função para verificar se as tabelas existem
export const checkTables = async () => {
  if (useSQLite) {
    return await checkSQLiteTables();
  }
  
  try {
    const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = result.rows.map(row => row.table_name);
    console.log('📋 Tabelas PostgreSQL encontradas:', tables);
    return tables;
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas PostgreSQL:', error);
    return [];
  }
};

// Função para inicializar o banco de dados
export const initializeDatabase = async () => {
  if (useSQLite) {
    const { initializeDatabase: initSQLite } = await import('./config-sqlite.js');
    return await initSQLite();
  }
  
  // Para PostgreSQL, as tabelas devem ser criadas manualmente
  console.log('ℹ️  Para PostgreSQL, execute o script setup-database.js para criar as tabelas');
  return true;
};

export default pool;
