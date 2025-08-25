import { query } from './config.js';
import bcrypt from 'bcryptjs';

/**
 * Script de seed para inserir dados iniciais no banco de dados
 */
async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // 1. Criar usuário administrador
    const adminPassword = 'Wardraw1!';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
    
    await query(`
      INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        user_type, 
        is_active, 
        email_verified,
        city,
        state,
        country
      ) VALUES (
        'contatothawer@gmail.com',
        $1,
        'Thawer',
        'Administrador',
        'admin',
        true,
        true,
        'São Paulo',
        'SP',
        'Brasil'
      ) ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        user_type = EXCLUDED.user_type,
        is_active = EXCLUDED.is_active,
        email_verified = EXCLUDED.email_verified
      RETURNING id
    `, [adminPasswordHash]);

    console.log('✅ Usuário administrador criado/atualizado');
    console.log('📧 Email: contatothawer@gmail.com');
    console.log('🔑 Senha: Wardraw1!');

    // 2. Inserir patrocinadores de exemplo
    await query(`
      INSERT INTO sponsors (name, slug, description, sponsorship_level, city, state, is_active) VALUES
      ('PowerGrip Pro', 'powergrip-pro', 'Equipamentos profissionais para treinamento de força', 'platinum', 'São Paulo', 'SP', true),
      ('Elite Nutrition', 'elite-nutrition', 'Suplementos nutricionais para atletas de alto rendimento', 'gold', 'Rio de Janeiro', 'RJ', true),
      ('StrongArm Gear', 'strongarm-gear', 'Vestuário esportivo especializado em armwrestling', 'silver', 'Belo Horizonte', 'MG', true),
      ('Peak Performance', 'peak-performance', 'Centro de treinamento e reabilitação esportiva', 'bronze', 'Curitiba', 'PR', true)
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ Patrocinadores de exemplo inseridos');

    // 3. Inserir posts de exemplo
    await query(`
      INSERT INTO posts (title, slug, excerpt, content, status, published_at, categories, tags, is_featured) VALUES
      (
        'Bem-vindos ao Armwrestling Brasil',
        'bem-vindos-armwrestling-brasil',
        'Uma nova era para o esporte no Brasil começa agora',
        '<h2>Uma Nova Era para o Armwrestling no Brasil</h2><p>É com grande satisfação que anunciamos o lançamento da plataforma oficial do Armwrestling Brasil. Esta iniciativa representa um marco histórico para o esporte em nosso país.</p><h3>Nossa Missão</h3><p>Promover, desenvolver e organizar o armwrestling em todo o território brasileiro, criando oportunidades para atletas, equipes e entusiastas do esporte.</p><h3>O que Esperar</h3><ul><li>Competições oficiais</li><li>Rankings nacionais</li><li>Treinamentos e workshops</li><li>Comunidade ativa</li></ul>',
        'published',
        CURRENT_TIMESTAMP,
        ARRAY['Geral', 'Anúncios'],
        ARRAY['armwrestling', 'brasil', 'esporte', 'competição'],
        true
      ),
      (
        'Regras Oficiais do Armwrestling',
        'regras-oficiais-armwrestling',
        'Conheça as regras oficiais que regem as competições',
        '<h2>Regras Oficiais do Armwrestling</h2><p>Para garantir competições justas e seguras, é fundamental que todos os participantes conheçam as regras oficiais do esporte.</p><h3>Regras Básicas</h3><ol><li>Os cotovelos devem permanecer na almofada</li><li>As mãos devem estar conectadas durante toda a luta</li><li>O ombro não pode cruzar a linha central</li><li>Não é permitido levantar a almofada</li></ol><h3>Faltas Comuns</h3><p>Algumas faltas que podem resultar em desqualificação...</p>',
        'published',
        CURRENT_TIMESTAMP,
        ARRAY['Regras', 'Competição'],
        ARRAY['regras', 'competição', 'oficial', 'falta'],
        false
      ),
      (
        'História do Armwrestling no Brasil',
        'historia-armwrestling-brasil',
        'Descubra como o esporte se desenvolveu em nosso país',
        '<h2>A História do Armwrestling no Brasil</h2><p>O armwrestling chegou ao Brasil na década de 1980, trazido por imigrantes europeus e norte-americanos que já praticavam o esporte em seus países de origem.</p><h3>Primeiros Anos</h3><p>Inicialmente, o esporte era praticado de forma amadora em bares e academias...</p><h3>Desenvolvimento</h3><p>Com o passar dos anos, o esporte ganhou mais estrutura...</p>',
        'published',
        CURRENT_TIMESTAMP,
        ARRAY['História', 'Cultura'],
        ARRAY['história', 'brasil', 'desenvolvimento', 'cultura'],
        false
      )
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ Posts de exemplo inseridos');

    // 4. Inserir configurações adicionais do site
    await query(`
      INSERT INTO site_settings (key, value, description) VALUES
      ('welcome_message', 'Bem-vindo à plataforma oficial do Armwrestling Brasil', 'Mensagem de boas-vindas'),
      ('about_text', 'Somos a entidade oficial responsável por promover e organizar o armwrestling em todo o Brasil', 'Texto sobre a organização'),
      ('footer_text', '© 2024 Armwrestling Brasil. Todos os direitos reservados.', 'Texto do rodapé'),
      ('newsletter_enabled', 'true', 'Newsletter ativada'),
      ('maintenance_message', 'Site em manutenção. Volte em breve!', 'Mensagem de manutenção')
      ON CONFLICT (key) DO NOTHING
    `);
    console.log('✅ Configurações adicionais inseridas');

    // 5. Criar trigger para atualizar updated_at automaticamente
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Aplicar trigger em todas as tabelas que têm updated_at
    const tablesWithUpdatedAt = [
      'users', 'teams', 'athletes', 'events', 'sponsors', 
      'posts', 'event_registrations', 'payments', 'site_settings'
    ];
    
    for (const table of tablesWithUpdatedAt) {
      await query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
    }
    console.log('✅ Triggers de updated_at criados');

    console.log('🎉 Seed concluído com sucesso!');
    console.log('📊 Dados iniciais inseridos no banco de dados');
    console.log('');
    console.log('🔐 CREDENCIAIS DE ACESSO:');
    console.log('📧 Email: contatothawer@gmail.com');
    console.log('🔑 Senha: Wardraw1!');
    console.log('👤 Tipo: Administrador');
    console.log('');
    console.log('💡 Agora você pode:');
    console.log('   1. Fazer login no sistema');
    console.log('   2. Acessar o painel administrativo');
    console.log('   3. Gerenciar usuários, equipes e eventos');
    console.log('   4. Publicar posts e notícias');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

// Executar seed se o arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('✅ Seed executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha no seed:', error);
      process.exit(1);
    });
}

export default seed;
