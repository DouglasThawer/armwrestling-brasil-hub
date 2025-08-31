#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Sincronizando Migrações do Supabase');
console.log('=====================================\n');

// Configurações do projeto
const SUPABASE_PROJECT_ID = 'qvpflozwwtjbjfwfmjco';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Função para ler arquivos de migração
function readMigrationFiles() {
  const migrationsDir = join(__dirname, 'supabase', 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ordenar por nome para manter a ordem cronológica
  
  console.log(`📁 Encontradas ${files.length} migrações:`);
  files.forEach(file => console.log(`   - ${file}`));
  
  return files.map(file => ({
    name: file,
    path: join(migrationsDir, file),
    content: readFileSync(join(migrationsDir, file), 'utf8')
  }));
}

// Função para gerar instruções de deploy
function generateDeployInstructions(migrations) {
  console.log('\n📋 INSTRUÇÕES PARA SINCRONIZAR NO SUPABASE:\n');
  console.log('1. Acesse o painel do Supabase:');
  console.log(`   ${SUPABASE_URL}/dashboard`);
  console.log('\n2. Vá para SQL Editor (Database > SQL Editor)');
  console.log('\n3. Execute as seguintes migrações em ordem:\n');
  
  migrations.forEach((migration, index) => {
    console.log(`--- MIGRAÇÃO ${index + 1}: ${migration.name} ---`);
    console.log(migration.content);
    console.log('\n');
  });
  
  console.log('4. Após executar todas as migrações, verifique:');
  console.log('   - Database > Tables (todas as tabelas foram criadas)');
  console.log('   - Database > Functions (todas as funções foram criadas)');
  console.log('   - Database > Policies (todas as políticas RLS foram aplicadas)');
}

// Função para verificar status das migrações
function checkMigrationStatus() {
  console.log('\n🔍 VERIFICAÇÃO DE STATUS:');
  console.log('========================');
  console.log(`Projeto ID: ${SUPABASE_PROJECT_ID}`);
  console.log(`URL: ${SUPABASE_URL}`);
  console.log('\nPara verificar o status das migrações:');
  console.log('1. Acesse o painel do Supabase');
  console.log('2. Vá para Database > Migrations');
  console.log('3. Compare com as migrações locais listadas acima');
}

// Função principal
function main() {
  try {
    const migrations = readMigrationFiles();
    
    if (migrations.length === 0) {
      console.log('❌ Nenhuma migração encontrada!');
      return;
    }
    
    generateDeployInstructions(migrations);
    checkMigrationStatus();
    
    console.log('\n✅ Sincronização preparada!');
    console.log('Execute as migrações no painel do Supabase seguindo as instruções acima.');
    
  } catch (error) {
    console.error('❌ Erro ao preparar sincronização:', error.message);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, readMigrationFiles, generateDeployInstructions };
