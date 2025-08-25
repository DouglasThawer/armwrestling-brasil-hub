import { query } from './config.js';

/**
 * Script de migração para criar todas as tabelas do banco de dados
 */
async function migrate() {
  try {
    console.log('🚀 Iniciando migração do banco de dados...');

    // 1. Criar tabela de usuários
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        user_type VARCHAR(20) NOT NULL DEFAULT 'visitor' CHECK (user_type IN ('admin', 'team', 'visitor')),
        phone VARCHAR(20),
        date_of_birth DATE,
        gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
        city VARCHAR(100),
        state VARCHAR(2),
        country VARCHAR(100) DEFAULT 'Brasil',
        bio TEXT,
        profile_image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela users criada');

    // 2. Criar tabela de equipes
    await query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        founded_date DATE,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        country VARCHAR(100) DEFAULT 'Brasil',
        address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        logo_url VARCHAR(500),
        banner_url VARCHAR(500),
        website VARCHAR(255),
        facebook VARCHAR(255),
        instagram VARCHAR(255),
        youtube VARCHAR(255),
        twitter VARCHAR(255),
        linkedin VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        rejection_reason TEXT,
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela teams criada');

    // 3. Criar tabela de atletas
    await query(`
      CREATE TABLE IF NOT EXISTS athletes (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        nickname VARCHAR(100),
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
        weight DECIMAL(5, 2), -- em kg
        weight_class VARCHAR(50),
        height DECIMAL(5, 2), -- em cm
        dominant_hand VARCHAR(10) CHECK (dominant_hand IN ('left', 'right', 'ambidextrous')),
        experience_years INTEGER DEFAULT 0,
        bio TEXT,
        profile_image_url VARCHAR(500),
        achievements TEXT[],
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela athletes criada');

    // 4. Criar tabela de eventos
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        event_date DATE NOT NULL,
        event_time TIME,
        end_date DATE,
        end_time TIME,
        location_name VARCHAR(200),
        address TEXT,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        country VARCHAR(100) DEFAULT 'Brasil',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        event_type VARCHAR(50) CHECK (event_type IN ('competition', 'training', 'exhibition', 'workshop', 'meeting')),
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
        max_participants INTEGER,
        current_participants INTEGER DEFAULT 0,
        ticket_price DECIMAL(10, 2),
        registration_deadline DATE,
        banner_url VARCHAR(500),
        gallery_urls TEXT[],
        rules TEXT,
        prizes TEXT,
        categories TEXT[],
        is_featured BOOLEAN DEFAULT false,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela events criada');

    // 5. Criar tabela de inscrições em eventos
    await query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'waitlist')),
        category VARCHAR(100),
        weight_class VARCHAR(50),
        notes TEXT,
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        payment_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela event_registrations criada');

    // 6. Criar tabela de patrocinadores
    await query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        logo_url VARCHAR(500),
        banner_url VARCHAR(500),
        website VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(2),
        country VARCHAR(100) DEFAULT 'Brasil',
        sponsorship_level VARCHAR(50) CHECK (sponsorship_level IN ('gold', 'silver', 'bronze', 'platinum')),
        sponsorship_amount DECIMAL(12, 2),
        start_date DATE,
        end_date DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela sponsors criada');

    // 7. Criar tabela de posts/blog
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        excerpt VARCHAR(500),
        content TEXT NOT NULL,
        featured_image_url VARCHAR(500),
        author_id INTEGER REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        published_at TIMESTAMP,
        categories TEXT[],
        tags TEXT[],
        meta_title VARCHAR(200),
        meta_description VARCHAR(500),
        view_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela posts criada');

    // 8. Criar tabela de pagamentos
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'BRL',
        payment_method VARCHAR(50),
        payment_provider VARCHAR(50) DEFAULT 'mercadopago',
        provider_payment_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela payments criada');

    // 9. Criar tabela de favoritos
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('team', 'athlete', 'event', 'post')),
        target_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, target_type, target_id)
      )
    `);
    console.log('✅ Tabela favorites criada');

    // 10. Criar tabela de notificações
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
        is_read BOOLEAN DEFAULT false,
        related_type VARCHAR(20),
        related_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela notifications criada');

    // 11. Criar tabela de configurações do site
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela site_settings criada');

    // 12. Criar tabela de logs de atividades
    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela activity_logs criada');

    // 13. Criar índices para performance
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)');
    await query('CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_teams_city_state ON teams(city, state)');
    await query('CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date)');
    await query('CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_events_city_state ON events(city, state)');
    await query('CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at)');
    await query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_favorites_user_target ON favorites(user_id, target_type, target_id)');

    console.log('✅ Índices criados');

    // 14. Inserir configurações padrão do site
    await query(`
      INSERT INTO site_settings (key, value, description) VALUES
      ('site_name', 'Armwrestling Brasil', 'Nome do site'),
      ('site_description', 'Plataforma oficial do Armwrestling no Brasil', 'Descrição do site'),
      ('contact_email', 'contato@armwrestlingbrasil.com', 'E-mail de contato'),
      ('contact_phone', '+55 11 99999-9999', 'Telefone de contato'),
      ('social_facebook', 'https://facebook.com/armwrestlingbrasil', 'Link do Facebook'),
      ('social_instagram', 'https://instagram.com/armwrestlingbrasil', 'Link do Instagram'),
      ('social_youtube', 'https://youtube.com/armwrestlingbrasil', 'Link do YouTube'),
      ('maintenance_mode', 'false', 'Modo de manutenção ativo')
      ON CONFLICT (key) DO NOTHING
    `);
    console.log('✅ Configurações padrão inseridas');

    console.log('🎉 Migração concluída com sucesso!');
    console.log('📊 Banco de dados configurado com todas as tabelas necessárias');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  }
}

// Executar migração se o arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(() => {
      console.log('✅ Migração executada com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na migração:', error);
      process.exit(1);
    });
}

export default migrate;
