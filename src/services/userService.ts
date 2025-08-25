import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/database';

export class UserService {
  // Criar novo usuário
  static async createUser(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    user_type: User['user_type'];
    phone?: string;
  }) {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_type: userData.user_type,
            phone: userData.phone,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Criar perfil do usuário na tabela users
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_type: userData.user_type,
            phone: userData.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Se falhar ao criar perfil, deletar o usuário auth
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }

        return { user: profileData, session: authData.session };
      }

      throw new Error('Usuário não foi criado');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  static async getUserById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Buscar usuário por email
  static async getUserByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async updateUser(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Listar usuários (apenas para admins)
  static async listUsers(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  // Deletar usuário
  static async deleteUser(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}
