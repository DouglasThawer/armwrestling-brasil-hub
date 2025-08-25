import { testConnection, checkTables, initializeDatabase } from '../src/database/config-sqlite.js';

async function testSQLiteConnection() {
  console.log('🧪 Testando conexão com SQLite...\n');
  
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
        console.log('⚠️  Nenhuma tabela encontrada. Inicializando banco...');
        await initializeDatabase();
        
        // Verificar novamente
        const newTables = await checkTables();
        console.log('✅ Tabelas criadas:', newTables.join(', '));
      }
      
    } else {
      console.log('❌ Falha na conexão com SQLite.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar teste
testSQLiteConnection();
