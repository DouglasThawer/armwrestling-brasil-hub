import { supabase } from '@/integrations/supabase/client';
import type { Sponsor } from '@/types/database';

export class SponsorService {
  // Criar novo patrocinador
  static async createSponsor(sponsorData: {
    name: string;
    description: string;
    logo_url?: string;
    website?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    sponsorship_level: Sponsor['sponsorship_level'];
  }) {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .insert({
          ...sponsorData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar patrocinador:', error);
      throw error;
    }
  }

  // Buscar patrocinador por ID
  static async getSponsorById(sponsorId: string) {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', sponsorId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar patrocinador:', error);
      throw error;
    }
  }

  // Listar patrocinadores
  static async listSponsors(limit = 50, offset = 0, status?: Sponsor['status']) {
    try {
      let query = supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar patrocinadores:', error);
      throw error;
    }
  }

  // Atualizar patrocinador
  static async updateSponsor(sponsorId: string, updates: Partial<Sponsor>) {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar patrocinador:', error);
      throw error;
    }
  }

  // Aprovar patrocinador
  static async approveSponsor(sponsorId: string) {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao aprovar patrocinador:', error);
      throw error;
    }
  }

  // Rejeitar patrocinador
  static async rejectSponsor(sponsorId: string, reason?: string) {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString(),
        })
        .eq('id', sponsorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao rejeitar patrocinador:', error);
      throw error;
    }
  }

  // Buscar patrocinadores por nível
  static async getSponsorsByLevel(level: Sponsor['sponsorship_level']) {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('sponsorship_level', level)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar patrocinadores por nível:', error);
      throw error;
    }
  }

  // Buscar patrocinadores por cidade
  static async getSponsorsByCity(city: string, state?: string) {
    try {
      let query = supabase
        .from('sponsors')
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
      console.error('Erro ao buscar patrocinadores por cidade:', error);
      throw error;
    }
  }

  // Deletar patrocinador
  static async deleteSponsor(sponsorId: string) {
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', sponsorId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar patrocinador:', error);
      throw error;
    }
  }

  // Estatísticas dos patrocinadores
  static async getSponsorStats() {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('sponsorship_level, status');

      if (error) throw error;

      const stats = {
        total: data.length,
        byLevel: {
          bronze: 0,
          silver: 0,
          gold: 0,
          platinum: 0,
        },
        byStatus: {
          pending: 0,
          active: 0,
          inactive: 0,
        },
      };

      data.forEach(sponsor => {
        stats.byLevel[sponsor.sponsorship_level]++;
        stats.byStatus[sponsor.status]++;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}
