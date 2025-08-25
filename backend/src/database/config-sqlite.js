import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o banco SQLite
const dbPath = path.join(__dirname, '..', '..', 'armwrestling_brasil.db');

// Variável global para a conexão
let db = null;

// Função para obter conexão com o banco
export const getDatabase = async () => {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Habilitar foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    
    console.log('🔌 Conexão com SQLite estabelecida:', dbPath);
  }
  return db;
};

// Função para executar queries
export const query = async (sql, params = []) => {
  const database = await getDatabase();
  const start = Date.now();
  
  try {
    const result = await database.all(sql, params);
    const duration = Date.now() - start;

    // Log de queries em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Query executada em ${duration}ms:`, sql.substring(0, 100) + '...');
    }

    return { rows: result, rowCount: result.length };
  } catch (error) {
    console.error('❌ Erro na query:', error);
    console.error('📝 Query:', sql);
    console.error('🔢 Parâmetros:', params);
    throw error;
  }
};

// Função para executar uma única query (INSERT, UPDATE, DELETE)
export const run = async (sql, params = []) => {
  const database = await getDatabase();
  const start = Date.now();
  
  try {
    const result = await database.run(sql, params);
    const duration = Date.now() - start;

    // Log de queries em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Query executada em ${duration}ms:`, sql.substring(0, 100) + '...');
    }

    return result;
  } catch (error) {
    console.error('❌ Erro na query:', error);
    console.error('📝 Query:', sql);
    console.error('🔢 Parâmetros:', params);
    throw error;
  }
};

// Função para obter um cliente do banco
export const getClient = async () => {
  return await getDatabase();
};

// Função para fechar a conexão
export const closeDatabase = async () => {
  if (db) {
    await db.close();
    db = null;
    console.log('🔌 Conexão com SQLite fechada');
  }
};

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const result = await query('SELECT datetime("now") as now');
    console.log('✅ Conexão com SQLite estabelecida:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com SQLite:', error);
    return false;
  }
};

// Função para verificar se as tabelas existem
export const checkTables = async () => {
  try {
    const result = await query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);

    const tables = result.rows.map(row => row.name);
    console.log('📋 Tabelas encontradas:', tables);
    return tables;
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
    return [];
  }
};

// Função para inicializar o banco (criar tabelas)
export const initializeDatabase = async () => {
  try {
    console.log('🔧 Inicializando banco de dados SQLite...');
    
    // Criar tabelas
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await run(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        country TEXT DEFAULT 'Brasil',
        latitude REAL,
        longitude REAL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        country TEXT DEFAULT 'Brasil',
        latitude REAL,
        longitude REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabelas criadas com sucesso!');
    
    // Inserir dados de exemplo
    await insertSampleData();
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    return false;
  }
};

// Função para inserir dados de exemplo
async function insertSampleData() {
  try {
    console.log('📝 Inserindo dados de exemplo...');
    
    // Usuário de exemplo
    await run(`
      INSERT OR IGNORE INTO users (email, password_hash, name, role) 
      VALUES (?, ?, ?, ?)
    `, ['admin@armwrestling.com.br', '$2b$10$example_hash', 'Administrador', 'admin']);
    
    // Equipes de exemplo
    const teams = [
      ['Equipe São Paulo', 'São Paulo', 'SP', -23.5505, -46.6333],
      ['Equipe Rio de Janeiro', 'Rio de Janeiro', 'RJ', -22.9068, -43.1729],
      ['Equipe Belo Horizonte', 'Belo Horizonte', 'MG', -19.9167, -43.9345]
    ];
    
    for (const team of teams) {
      await run(`
        INSERT OR IGNORE INTO teams (name, city, state, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?)
      `, team);
    }
    
    // Eventos de exemplo
    const events = [
      ['Campeonato Brasileiro 2024', 'Campeonato Nacional de Arm Wrestling', '2024-06-15', '2024-06-16', 'São Paulo', 'SP', -23.5505, -46.6333],
      ['Copa Rio 2024', 'Torneio Regional do Rio de Janeiro', '2024-07-20', '2024-07-20', 'Rio de Janeiro', 'RJ', -22.9068, -43.1729]
    ];
    
    for (const event of events) {
      await run(`
        INSERT OR IGNORE INTO events (name, description, start_date, end_date, city, state, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, event);
    }
    
    console.log('✅ Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
  }
}

export default { getDatabase, query, run, getClient, closeDatabase, testConnection, checkTables, initializeDatabase };
