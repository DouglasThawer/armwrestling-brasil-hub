#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏗️  Setup do Banco de Dados - Armwrestling Brasil');
console.log('==================================================\n');

// Verificar se PostgreSQL está instalado
function checkPostgreSQL() {
  try {
    execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ PostgreSQL encontrado');
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL não encontrado');
    return false;
  }
}

// Verificar se o banco existe
function checkDatabase(dbName) {
  try {
    execSync(`psql -lqt | cut -d \| -f 1 | grep -qw ${dbName}`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Criar banco de dados
function createDatabase(dbName) {
  try {
    console.log(`📊 Criando banco de dados '${dbName}'...`);
    execSync(`createdb ${dbName}`, { stdio: 'inherit' });
    console.log(`✅ Banco de dados '${dbName}' criado com sucesso`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao criar banco de dados: ${error.message}`);
    return false;
  }
}

// Configurar arquivo .env
function setupEnvFile() {
  const envPath = join(__dirname, '.env');
  const envExamplePath = join(__dirname, 'env.example');
  
  if (existsSync(envPath)) {
    console.log('📝 Arquivo .env já existe');
    return true;
  }

  if (!existsSync(envExamplePath)) {
    console.error('❌ Arquivo env.example não encontrado');
    return false;
  }

  try {
    const envContent = readFileSync(envExamplePath, 'utf8');
    writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado a partir do env.example');
    return true;
  } catch (error) {
    console.error(`❌ Erro ao criar arquivo .env: ${error.message}`);
    return false;
  }
}

// Executar migração
async function runMigration() {
  try {
    console.log('🚀 Executando migração do banco...');
    execSync('npm run db:migrate', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Migração executada com sucesso');
    return true;
  } catch (error) {
    console.error(`❌ Erro na migração: ${error.message}`);
    return false;
  }
}

// Executar seed
async function runSeed() {
  try {
    console.log('🌱 Executando seed do banco...');
    execSync('npm run db:seed', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Seed executado com sucesso');
    return true;
  } catch (error) {
    console.error(`❌ Erro no seed: ${error.message}`);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🔍 Verificando requisitos...\n');

  // 1. Verificar PostgreSQL
  if (!checkPostgreSQL()) {
    console.log('\n📥 Para instalar o PostgreSQL:');
    console.log('   Windows: https://www.postgresql.org/download/windows/');
    console.log('   macOS: brew install postgresql');
    console.log('   Ubuntu: sudo apt-get install postgresql postgresql-contrib');
    console.log('\n❌ Setup interrompido. Instale o PostgreSQL primeiro.');
    process.exit(1);
  }

  // 2. Configurar arquivo .env
  console.log('\n📝 Configurando variáveis de ambiente...');
  if (!setupEnvFile()) {
    console.log('❌ Falha na configuração do .env');
    process.exit(1);
  }

  // 3. Verificar/criar banco de dados
  const dbName = 'armwrestling_brasil';
  console.log(`\n🗄️  Verificando banco de dados '${dbName}'...`);
  
  if (!checkDatabase(dbName)) {
    console.log(`\n📊 Banco de dados '${dbName}' não encontrado`);
    const create = confirm('Deseja criar o banco de dados agora? (s/n): ');
    if (create) {
      if (!createDatabase(dbName)) {
        console.log('❌ Falha na criação do banco');
        process.exit(1);
      }
    } else {
      console.log('❌ Setup interrompido. Crie o banco de dados manualmente.');
      process.exit(1);
    }
  } else {
    console.log(`✅ Banco de dados '${dbName}' já existe`);
  }

  // 4. Executar migração
  console.log('\n🚀 Executando migração...');
  if (!(await runMigration())) {
    console.log('❌ Falha na migração');
    process.exit(1);
  }

  // 5. Executar seed
  console.log('\n🌱 Executando seed...');
  if (!(await runSeed())) {
    console.log('❌ Falha no seed');
    process.exit(1);
  }

  // 6. Resumo final
  console.log('\n🎉 Setup concluído com sucesso!');
  console.log('==================================================');
  console.log('📊 Banco de dados: armwrestling_brasil');
  console.log('🔐 Admin: contatothawer@gmail.com / Wardraw1!');
  console.log('🌐 Frontend: http://localhost:8080');
  console.log('🔧 Backend: http://localhost:3001');
  console.log('📚 API Docs: http://localhost:3001/api-docs');
  console.log('👑 Painel Admin: http://localhost:8080/admin');
  console.log('\n💡 Próximos passos:');
  console.log('   1. Configure as variáveis no arquivo .env');
  console.log('   2. Inicie o backend: npm run dev');
  console.log('   3. Inicie o frontend: npm run dev');
  console.log('   4. Acesse o painel administrativo');
}

// Função para confirmar ações
function confirm(message) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'y');
    });
  });
}

// Executar setup
main().catch((error) => {
  console.error('\n❌ Erro durante o setup:', error);
  process.exit(1);
});
