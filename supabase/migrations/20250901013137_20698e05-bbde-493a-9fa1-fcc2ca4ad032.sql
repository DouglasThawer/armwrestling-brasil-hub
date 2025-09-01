-- Script para criar as tabelas do sistema ManzapKong
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'team_leader', 'sponsor', 'user')),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de equipes
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    address TEXT NOT NULL,
    coach_name VARCHAR(100) NOT NULL,
    training_days TEXT[] DEFAULT '{}',
    training_hours VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    website TEXT,
    logo_url TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de patrocinadores
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    description TEXT,
    website TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('bronze', 'silver', 'gold', 'platinum')),
    logo_url TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('local', 'regional', 'national', 'international')),
    max_participants INTEGER DEFAULT 100,
    current_participants INTEGER DEFAULT 0,
    registration_deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'registration_open', 'registration_closed', 'completed')),
    banner_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts/blog
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do sistema (funcionalidades modulares)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão do sistema
INSERT INTO public.system_settings (setting_key, setting_value, description, category) VALUES
('teams_module', '{"enabled": true, "auto_approve": false}', 'Módulo de equipes', 'modules'),
('sponsors_module', '{"enabled": true, "auto_approve": false}', 'Módulo de patrocinadores', 'modules'),
('events_module', '{"enabled": true, "public_registration": true}', 'Módulo de eventos', 'modules'),
('blog_module', '{"enabled": true, "public_comments": false}', 'Módulo de blog', 'modules'),
('contact_module', '{"enabled": true, "auto_reply": false}', 'Módulo de contato', 'modules'),
('registration_open', '{"enabled": true, "require_approval": true}', 'Registro de usuários', 'general'),
('site_maintenance', '{"enabled": false, "message": "Site em manutenção"}', 'Modo manutenção', 'general');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON public.sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id::text = auth.uid()::text AND user_type = 'admin'
        )
    );

-- Políticas RLS para teams
CREATE POLICY "Anyone can view approved teams" ON public.teams
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Team owners can view their own teams" ON public.teams
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Team owners can update their own teams" ON public.teams
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all teams" ON public.teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id::text = auth.uid()::text AND user_type = 'admin'
        )
    );

-- Políticas RLS para sponsors
CREATE POLICY "Anyone can view approved sponsors" ON public.sponsors
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Sponsor owners can view their own sponsors" ON public.sponsors
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Sponsor owners can update their own sponsors" ON public.sponsors
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can create sponsors" ON public.sponsors
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all sponsors" ON public.sponsors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id::text = auth.uid()::text AND user_type = 'admin'
        )
    );

-- Políticas RLS para events
CREATE POLICY "Anyone can view published events" ON public.events
    FOR SELECT USING (status IN ('published', 'registration_open', 'registration_closed', 'completed'));

CREATE POLICY "Admins can manage all events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id::text = auth.uid()::text AND user_type = 'admin'
        )
    );

-- Políticas RLS para posts
CREATE POLICY "Anyone can view published posts" ON public.posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their own posts" ON public.posts
    FOR ALL USING (auth.uid()::text = author_id::text);

CREATE POLICY "Admins can manage all posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id::text = auth.uid()::text AND user_type = 'admin'
        )
    );

-- Políticas RLS para system_settings
CREATE POLICY "Admins can manage system settings" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id::text = auth.uid()::text AND user_type = 'admin'
        )
    );

CREATE POLICY "Anyone can view active system settings" ON public.system_settings
    FOR SELECT USING (is_active = true);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user')
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();