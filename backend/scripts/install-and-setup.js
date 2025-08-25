import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Configurando o projeto Arm Wrestling Brasil Hub...\n');

// Função para executar comandos
function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${description} concluído!\n`);
  } catch (error) {
    console.error(`❌ Erro ao ${description.toLowerCase()}:`, error.message);
    return false;
  }
  return true;
}

// Função para verificar se o arquivo .env existe
function checkEnvFile() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  Arquivo .env não encontrado!');
    console.log('📝 Criando arquivo .env com configurações padrão...\n');
    
    const envContent = `NODE_ENV=development
PORT=3001
JWT_SECRET=sua_chave_jwt_super_secreta_aqui

# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=armwrestling_brasil
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado!\n');
    console.log('⚠️  IMPORTANTE: Edite o arquivo .env e configure sua senha do PostgreSQL!\n');
  } else {
    console.log('✅ Arquivo .env encontrado!\n');
  }
}

// Função principal
async function main() {
  console.log('🔍 Verificando pré-requisitos...\n');
  
  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js ${nodeVersion} encontrado`);
  } catch (error) {
    console.error('❌ Node.js não encontrado! Instale o Node.js primeiro.');
    process.exit(1);
  }
  
  // Verificar npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm ${npmVersion} encontrado\n`);
  } catch (error) {
    console.error('❌ npm não encontrado! Instale o npm primeiro.');
    process.exit(1);
  }
  
  // Verificar arquivo .env
  checkEnvFile();
  
  // Instalar dependências
  if (!runCommand('npm install', 'Instalando dependências')) {
    console.error('❌ Falha na instalação das dependências');
    process.exit(1);
  }
  
  console.log('🎯 Configuração básica concluída!\n');
  console.log('📋 Próximos passos:');
  console.log('1. Instale o PostgreSQL no seu sistema');
  console.log('2. Crie o banco de dados "armwrestling_brasil"');
  console.log('3. Configure sua senha no arquivo .env');
  console.log('4. Execute: node scripts/setup-database.js');
  console.log('5. Execute: node scripts/test-connection.js');
  console.log('6. Inicie o servidor: npm run dev\n');
  
  console.log('📚 Para mais informações, consulte o arquivo README-DATABASE.md');
}

// Executar configuração
main().catch(console.error);
