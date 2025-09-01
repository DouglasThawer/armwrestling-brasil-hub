import type { Database } from '@/integrations/supabase/types';

// Re-export Supabase types
export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type Team = Tables['teams']['Row'];
export type Sponsor = Tables['sponsors']['Row'];
export type Event = Tables['events']['Row'];
export type Post = Tables['posts']['Row'];
export type SystemSetting = Tables['system_settings']['Row'];

// Extended User type that includes profile data
export interface User extends Profile {
  email: string;
}

// Form types for inserts
export type ProfileInsert = Tables['profiles']['Insert'];
export type TeamInsert = Tables['teams']['Insert'];
export type SponsorInsert = Tables['sponsors']['Insert'];
export type EventInsert = Tables['events']['Insert'];
export type PostInsert = Tables['posts']['Insert'];

// Update types
export type ProfileUpdate = Tables['profiles']['Update'];
export type TeamUpdate = Tables['teams']['Update'];
export type SponsorUpdate = Tables['sponsors']['Update'];
export type EventUpdate = Tables['events']['Update'];
export type PostUpdate = Tables['posts']['Update'];

export type UserType = 'admin' | 'team_leader' | 'sponsor' | 'user';
export type EventCategory = 'local' | 'regional' | 'national' | 'international';
export type SponsorLevel = 'bronze' | 'silver' | 'gold' | 'platinum';
export type PostStatus = 'draft' | 'published' | 'archived';
export type EventStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'completed';
