import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthUser extends Profile {
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useAuth: Iniciando verificação de autenticação...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session:', session);
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } else if (profile) {
        const authUser: AuthUser = {
          ...profile,
          email: session?.user?.email || profile.email
        };
        setUser(authUser);
        console.log('Profile loaded:', authUser);
      }
    } catch (err: any) {
      console.error('Error in fetchUserProfile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('useAuth: Tentando fazer login com:', email);
      setLoading(true);
      setError(null);

      // Clean up any existing auth state
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful:', data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido no login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      setError(null);

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro no cadastro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Fazendo logout...');
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer logout');
    }
  };

  const isAdmin = () => {
    const result = user?.user_type === 'admin';
    console.log('useAuth: isAdmin() called:', { userType: user?.user_type, result });
    return result;
  };
  
  const isTeamLeader = () => user?.user_type === 'team_leader';
  const isSponsor = () => user?.user_type === 'sponsor';

  console.log('useAuth: Current state:', { user, session, loading, error });

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isTeamLeader,
    isSponsor,
    refresh: () => window.location.reload(),
  };
};
