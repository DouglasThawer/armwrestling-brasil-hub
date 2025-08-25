export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'admin' | 'team_leader' | 'sponsor' | 'user';
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  category: 'amateur' | 'professional' | 'elite';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
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
  current_members: number;
  responsible_user_id: string;
  status: 'pending_approval' | 'active' | 'suspended' | 'inactive';
  logo_url?: string;
  banner_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'member' | 'captain' | 'coach';
  joined_at: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  sponsorship_level: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'pending' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  address: string;
  city: string;
  state: string;
  category: 'local' | 'regional' | 'national' | 'international';
  max_participants: number;
  current_participants: number;
  registration_deadline: string;
  status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'completed';
  banner_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  team_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registration_date: string;
  notes?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  featured_image_url?: string;
  tags: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'current_members'>;
        Update: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'joined_at'>;
        Update: Partial<Omit<TeamMember, 'id' | 'joined_at'>>;
      };
      sponsors: {
        Row: Sponsor;
        Insert: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_participants'>;
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
      };
      event_registrations: {
        Row: EventRegistration;
        Insert: Omit<EventRegistration, 'id' | 'registration_date'>;
        Update: Partial<Omit<EventRegistration, 'id' | 'registration_date'>>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
