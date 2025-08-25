import { supabase } from '@/integrations/supabase/client';
import type { Team, TeamMember } from '@/types/database';

export class TeamService {
  // Criar nova equipe
  static async createTeam(teamData: {
    name: string;
    description: string;
    category: Team['category'];
    level: Team['level'];
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    training_schedule: string;
    training_address: string;
    max_members: number;
    responsible_user_id: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          ...teamData,
          current_members: 1, // Começa com 1 (o responsável)
          status: 'pending_approval',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar o responsável como membro da equipe
      await this.addTeamMember({
        team_id: data.id,
        user_id: teamData.responsible_user_id,
        role: 'captain',
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      throw error;
    }
  }

  // Buscar equipe por ID
  static async getTeamById(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            *,
            users (
              id,
              first_name,
              last_name,
              email,
              user_type
            )
          )
        `)
        .eq('id', teamId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar equipe:', error);
      throw error;
    }
  }

  // Listar equipes
  static async listTeams(limit = 50, offset = 0, status?: Team['status']) {
    try {
      let query = supabase
        .from('teams')
        .select(`
          *,
          users!teams_responsible_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar equipes:', error);
      throw error;
    }
  }

  // Atualizar equipe
  static async updateTeam(teamId: string, updates: Partial<Team>) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      throw error;
    }
  }

  // Aprovar equipe
  static async approveTeam(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao aprovar equipe:', error);
      throw error;
    }
  }

  // Adicionar membro à equipe
  static async addTeamMember(memberData: {
    team_id: string;
    user_id: string;
    role: TeamMember['role'];
  }) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          ...memberData,
          joined_at: new Date().toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar contador de membros da equipe
      await this.updateTeamMemberCount(memberData.team_id);

      return data;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  }

  // Remover membro da equipe
  static async removeTeamMember(teamId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar contador de membros da equipe
      await this.updateTeamMemberCount(teamId);

      return true;
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
  }

  // Atualizar contador de membros da equipe
  private static async updateTeamMemberCount(teamId: string) {
    try {
      const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .eq('status', 'active');

      if (error) throw error;

      await supabase
        .from('teams')
        .update({
          current_members: count || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId);

    } catch (error) {
      console.error('Erro ao atualizar contador de membros:', error);
    }
  }

  // Buscar equipes por cidade
  static async getTeamsByCity(city: string, state?: string) {
    try {
      let query = supabase
        .from('teams')
        .select('*')
        .eq('city', city)
        .eq('status', 'active');

      if (state) {
        query = query.eq('state', state);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar equipes por cidade:', error);
      throw error;
    }
  }

  // Deletar equipe
  static async deleteTeam(teamId: string) {
    try {
      // Primeiro deletar todos os membros
      await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId);

      // Depois deletar a equipe
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar equipe:', error);
      throw error;
    }
  }
}
