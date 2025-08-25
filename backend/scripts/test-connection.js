import { testConnection, checkTables } from '../src/database/config.js';

async function testDatabaseConnection() {
  console.log('🧪 Testando conexão com o banco de dados...\n');
  
  try {
    // Testar conexão básica
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexão estabelecida com sucesso!\n');
      
      // Verificar tabelas
      console.log('📋 Verificando tabelas...');
      const tables = await checkTables();
      
      if (tables.length > 0) {
        console.log('✅ Tabelas encontradas:', tables.join(', '));
      } else {
        console.log('⚠️  Nenhuma tabela encontrada. Execute o script de configuração primeiro.');
      }
      
    } else {
      console.log('❌ Falha na conexão com o banco de dados.');
      console.log('\n📋 Verifique se:');
      console.log('1. PostgreSQL está rodando');
      console.log('2. As credenciais no arquivo .env estão corretas');
      console.log('3. O banco de dados existe');
      console.log('4. O usuário tem permissões adequadas');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar teste
testDatabaseConnection();
