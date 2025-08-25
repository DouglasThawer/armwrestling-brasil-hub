import { useState, useEffect } from 'react';
import type { User } from '@/types/database';

// Simular localStorage para autenticação
const AUTH_KEY = 'armwrestling_auth_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useAuth: Iniciando verificação de autenticação...');
    
    // Verificar se há usuário salvo no localStorage
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem(AUTH_KEY);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('useAuth: Usuário encontrado no localStorage:', userData);
          setUser(userData);
        } else {
          console.log('useAuth: Nenhum usuário encontrado no localStorage');
        }
      } catch (error) {
        console.error('useAuth: Erro ao verificar usuário salvo:', error);
        localStorage.removeItem(AUTH_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('useAuth: Tentando fazer login com:', email);
      setLoading(true);
      setError(null);

      // Simular verificação de credenciais
      // Em produção, isso seria uma chamada para a API
      if (email === 'admin@armwrestling.com.br' && password === 'admin123') {
        const userData: User = {
          id: '1',
          email: email,
          first_name: 'Administrador',
          last_name: 'Sistema',
          user_type: 'admin',
          phone: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          email_verified: true
        };

        console.log('useAuth: Login realizado com sucesso:', userData);
        
        // Salvar no localStorage
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        console.log('useAuth: Credenciais inválidas');
        return { success: false, error: 'Email ou senha incorretos' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido no login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    try {
      console.log('useAuth: Fazendo logout...');
      localStorage.removeItem(AUTH_KEY);
      setUser(null);
      setError(null);
      console.log('useAuth: Logout realizado com sucesso');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer logout');
    }
  };

  // Função para verificar se o usuário é admin
  const isAdmin = () => {
    const result = user?.user_type === 'admin';
    console.log('useAuth: isAdmin() chamado:', { userType: user?.user_type, result });
    return result;
  };
  
  // Função para verificar se o usuário é líder de equipe
  const isTeamLeader = () => user?.user_type === 'team_leader';

  console.log('useAuth: Estado atual:', { user, loading, error });

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAdmin,
    isTeamLeader,
    refresh: () => window.location.reload(),
  };
};
