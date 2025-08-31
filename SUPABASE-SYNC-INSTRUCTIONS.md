# 🔄 Instruções para Sincronizar Migrações do Supabase

## 📋 Visão Geral
Este documento contém as instruções para sincronizar as migrações locais com o banco de dados do Supabase.

## 🎯 Projeto
- **ID do Projeto:** `qvpflozwwtjbjfwfmjco`
- **URL:** `https://qvpflozwwtjbjfwfmjco.supabase.co`
- **Dashboard:** `https://qvpflozwwtjbjfwfmjco.supabase.co/dashboard`

## 🚀 Passos para Sincronização

### 1. Acessar o Painel do Supabase
1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto: `qvpflozwwtjbjfwfmjco`

### 2. Executar Migrações no SQL Editor
1. No painel, vá para **Database** > **SQL Editor**
2. Execute as migrações na seguinte ordem:

#### MIGRAÇÃO 1: 20250825010322_45177562-a4e9-4e24-b52e-250d9497d448.sql
```sql
-- Criar enum para tipos de usuários
CREATE TYPE public.user_type AS ENUM ('admin', 'team', 'sponsor', 'user');

-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_type user_type NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  phone TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.user_type = 'admin'
    AND p.is_approved = true
  )
);

-- Criar tabela de equipes
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  coach_name TEXT,
  training_days TEXT[],
  training_hours TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  instagram TEXT,
  facebook TEXT,
  website TEXT,
  logo_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS para teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para teams
CREATE POLICY "Teams can view their own data" 
ON public.teams 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Teams can update their own data" 
ON public.teams 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Approved teams are visible to everyone" 
ON public.teams 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Admins can view all teams" 
ON public.teams 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.user_type = 'admin'
    AND p.is_approved = true
  )
);

-- Criar tabela de patrocinadores
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  sponsorship_level TEXT NOT NULL CHECK (sponsorship_level IN ('bronze', 'silver', 'gold', 'platinum')),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS para sponsors
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para sponsors
CREATE POLICY "Sponsors can view their own data" 
ON public.sponsors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Sponsors can update their own data" 
ON public.sponsors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Approved sponsors are visible to everyone" 
ON public.sponsors 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Admins can view all sponsors" 
ON public.sponsors 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.user_type = 'admin'
    AND p.is_approved = true
  )
);

-- Criar tabela de eventos
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('local', 'regional', 'national', 'international')),
  max_participants INTEGER DEFAULT 100,
  current_participants INTEGER DEFAULT 0,
  registration_deadline DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'registration_open', 'registration_closed', 'completed')),
  banner_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para events
CREATE POLICY "Events are visible to everyone when approved" 
ON public.events 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all events" 
ON public.events 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.user_type = 'admin'
    AND p.is_approved = true
  )
);

-- Criar tabela de posts/blog
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para posts
CREATE POLICY "Published posts are visible to everyone" 
ON public.posts 
FOR SELECT 
USING (status = 'published' AND is_approved = true);

CREATE POLICY "Users can view their own posts" 
ON public.posts 
FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Users can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" 
ON public.posts 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.user_type = 'admin'
    AND p.is_approved = true
  )
);

-- Criar tabela de favoritos
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('team', 'sponsor', 'event', 'post')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

-- Habilitar RLS para favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para favorites
CREATE POLICY "Users can manage their own favorites" 
ON public.favorites 
FOR ALL
USING (auth.uid() = user_id);

-- Criar tabela de pagamentos
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'bank_transfer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" 
ON public.payments 
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.user_type = 'admin'
    AND p.is_approved = true
  )
);

-- Criar tabela de uploads
CREATE TABLE public.uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para uploads
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para uploads
CREATE POLICY "Users can view their own uploads" 
ON public.uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create uploads" 
ON public.uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public uploads are visible to everyone" 
ON public.uploads 
FOR SELECT 
USING (is_public = true);

-- Criar índices para melhor performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_is_approved ON public.profiles(is_approved);

CREATE INDEX idx_teams_user_id ON public.teams(user_id);
CREATE INDEX idx_teams_city ON public.teams(city);
CREATE INDEX idx_teams_state ON public.teams(state);
CREATE INDEX idx_teams_is_approved ON public.teams(is_approved);

CREATE INDEX idx_sponsors_user_id ON public.sponsors(user_id);
CREATE INDEX idx_sponsors_city ON public.sponsors(city);
CREATE INDEX idx_sponsors_state ON public.sponsors(state);
CREATE INDEX idx_sponsors_is_approved ON public.sponsors(is_approved);

CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_state ON public.events(state);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_is_approved ON public.events(is_approved);

CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at);
CREATE INDEX idx_posts_is_approved ON public.posts(is_approved);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_target ON public.favorites(target_type, target_id);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);

CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX idx_uploads_bucket ON public.uploads(bucket_name);
```

#### MIGRAÇÃO 2: 20250825010506_9662a74e-3bf2-4b56-a352-ec7af1383900.sql
```sql
-- Fix function search_path for security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'user')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

### 3. Verificar Execução
Após executar cada migração, verifique:

1. **Database > Tables**: Todas as tabelas foram criadas
2. **Database > Functions**: Todas as funções foram criadas  
3. **Database > Policies**: Todas as políticas RLS foram aplicadas
4. **Database > Indexes**: Todos os índices foram criados

### 4. Configurar Triggers
Execute o seguinte SQL para configurar os triggers:

```sql
-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## ✅ Verificação Final

### Teste de Conectividade
1. Vá para **Database > API**
2. Copie a URL e chave anônima
3. Teste a conexão com o frontend

### Teste de Autenticação
1. Vá para **Authentication > Users**
2. Crie um usuário de teste
3. Verifique se o perfil foi criado automaticamente

### Teste de RLS
1. Faça login com diferentes tipos de usuário
2. Verifique se as políticas estão funcionando corretamente

## 🚨 Solução de Problemas

### Erro: "relation already exists"
- Algumas tabelas podem já existir
- Execute `DROP TABLE IF EXISTS nome_tabela;` antes de criar

### Erro: "type already exists"
- Execute `DROP TYPE IF EXISTS user_type;` antes de criar

### Erro: "function already exists"
- Execute `DROP FUNCTION IF EXISTS nome_funcao;` antes de criar

## 📞 Suporte
Se encontrar problemas:
1. Verifique os logs no painel do Supabase
2. Consulte a documentação oficial
3. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** 31/08/2025
**Versão:** 1.0.0
