import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  console.log('🧪 Testando conexão com Supabase...');
  
  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro na conexão básica:', sessionError);
      return {
        success: false,
        error: sessionError.message,
        step: 'conexão básica'
      };
    }
    
    console.log('✅ Conexão básica OK');
    console.log('📊 Sessão atual:', session);
    
    // 2. Testar acesso à tabela users
    console.log('2️⃣ Testando acesso à tabela users...');
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (usersError) {
        console.error('❌ Erro ao acessar tabela users:', usersError);
        return {
          success: false,
          error: usersError.message,
          step: 'acesso à tabela users',
          details: {
            code: usersError.code,
            hint: usersError.hint,
            details: usersError.details
          }
        };
      }
      
      console.log('✅ Acesso à tabela users OK');
      console.log('📊 Resultado:', users);
      
    } catch (tableError: any) {
      console.error('❌ Erro inesperado ao acessar tabela:', tableError);
      return {
        success: false,
        error: tableError.message,
        step: 'acesso à tabela users',
        details: {
          type: tableError.constructor.name,
          message: tableError.message
        }
      };
    }
    
    // 3. Testar autenticação
    console.log('3️⃣ Testando sistema de autenticação...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ Usuário não autenticado (isso é normal)');
    } else {
      console.log('✅ Sistema de autenticação OK');
      console.log('👤 Usuário atual:', authData.user);
    }
    
    // 4. Verificar configurações
    console.log('4️⃣ Verificando configurações...');
    console.log('🌐 URL:', supabase.supabaseUrl);
    console.log('🔑 Key:', supabase.supabaseKey.substring(0, 20) + '...');
    console.log('📱 Storage:', supabase.auth.storage);
    
    return {
      success: true,
      message: 'Conexão com Supabase funcionando perfeitamente!',
      details: {
        url: supabase.supabaseUrl,
        hasSession: !!session,
        hasUser: !!authData.user,
        tableAccess: 'OK'
      }
    };
    
  } catch (error: any) {
    console.error('❌ Erro geral no teste:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
      step: 'teste geral',
      details: {
        type: error.constructor.name,
        stack: error.stack
      }
    };
  }
};

export const testDatabaseTables = async () => {
  console.log('🗄️ Testando acesso às tabelas do banco...');
  
  const tables = ['users', 'teams', 'sponsors', 'events', 'posts'];
  const results: any = {};
  
  for (const table of tables) {
    try {
      console.log(`📋 Testando tabela: ${table}`);
      
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.error(`❌ Erro na tabela ${table}:`, error);
        results[table] = {
          success: false,
          error: error.message,
          code: error.code
        };
      } else {
        console.log(`✅ Tabela ${table} OK`);
        results[table] = {
          success: true,
          data: data
        };
      }
      
    } catch (error: any) {
      console.error(`❌ Erro inesperado na tabela ${table}:`, error);
      results[table] = {
        success: false,
        error: error.message,
        type: 'unexpected_error'
      };
    }
  }
  
  return results;
};

export const testRLSPolicies = async () => {
  console.log('🔒 Testando políticas RLS...');
  
  try {
    // Tentar inserir um usuário de teste (deve falhar se RLS estiver ativo)
    const testUser = {
      id: 'test-' + Date.now(),
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      user_type: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select();
    
    if (error) {
      if (error.message.includes('permission denied') || error.message.includes('new row violates row-level security')) {
        console.log('✅ Políticas RLS estão ativas (inserção bloqueada)');
        return {
          success: true,
          message: 'RLS funcionando corretamente',
          blocked: true
        };
      } else {
        console.log('⚠️ Erro diferente do esperado:', error.message);
        return {
          success: false,
          error: error.message,
          type: 'unexpected_error'
        };
      }
    } else {
      console.log('⚠️ RLS pode não estar ativo (inserção permitida)');
      return {
        success: false,
        message: 'RLS pode não estar configurado',
        blocked: false
      };
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao testar RLS:', error);
    return {
      success: false,
      error: error.message,
      type: 'test_error'
    };
  }
};

