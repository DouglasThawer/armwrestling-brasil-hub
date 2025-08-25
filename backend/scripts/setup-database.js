import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config();

// Configuração do pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'armwrestling_brasil',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'sua_senha_aqui',
});

async function setupDatabase() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    
    // Testar conexão
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Criar tabelas se não existirem
    await createTables(client);
    
    // Inserir dados de exemplo
    await insertSampleData(client);
    
    client.release();
    console.log('🎉 Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);
    console.log('\n📋 Verifique se:');
    console.log('1. PostgreSQL está rodando');
    console.log('2. As credenciais no arquivo .env estão corretas');
    console.log('3. O banco de dados "armwrestling_brasil" existe');
    console.log('4. O usuário tem permissões adequadas');
  } finally {
    await pool.end();
  }
}

async function createTables(client) {
  console.log('📋 Criando tabelas...');
  
  // Tabela de usuários
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Tabela de equipes
  await client.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(100) NOT NULL,
      country VARCHAR(100) DEFAULT 'Brasil',
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Tabela de eventos
  await client.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(100) NOT NULL,
      country VARCHAR(100) DEFAULT 'Brasil',
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Tabelas criadas com sucesso!');
}

async function insertSampleData(client) {
  console.log('📝 Inserindo dados de exemplo...');
  
  // Usuário de exemplo
  await client.query(`
    INSERT INTO users (email, password_hash, name, role) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
  `, ['admin@armwrestling.com.br', '$2b$10$example_hash', 'Administrador', 'admin']);
  
  // Equipes de exemplo
  const teams = [
    {
      name: 'Equipe São Paulo',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5505,
      longitude: -46.6333
    },
    {
      name: 'Equipe Rio de Janeiro',
      city: 'Rio de Janeiro',
      state: 'RJ',
      latitude: -22.9068,
      longitude: -43.1729
    },
    {
      name: 'Equipe Belo Horizonte',
      city: 'Belo Horizonte',
      state: 'MG',
      latitude: -19.9167,
      longitude: -43.9345
    }
  ];
  
  for (const team of teams) {
    await client.query(`
      INSERT INTO teams (name, city, state, latitude, longitude) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
    `, [team.name, team.city, team.state, team.latitude, team.longitude]);
  }
  
  // Eventos de exemplo
  const events = [
    {
      name: 'Campeonato Brasileiro 2024',
      description: 'Campeonato Nacional de Arm Wrestling',
      start_date: '2024-06-15',
      end_date: '2024-06-16',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5505,
      longitude: -46.6333
    },
    {
      name: 'Copa Rio 2024',
      description: 'Torneio Regional do Rio de Janeiro',
      start_date: '2024-07-20',
      end_date: '2024-07-20',
      city: 'Rio de Janeiro',
      state: 'RJ',
      latitude: -22.9068,
      longitude: -43.1729
    }
  ];
  
  for (const event of events) {
    await client.query(`
      INSERT INTO events (name, description, start_date, end_date, city, state, latitude, longitude) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [event.name, event.description, event.start_date, event.end_date, event.city, event.state, event.latitude, event.longitude]);
  }
  
  console.log('✅ Dados de exemplo inseridos com sucesso!');
}

// Executar configuração
setupDatabase();
