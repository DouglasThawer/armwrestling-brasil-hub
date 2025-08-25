# 🗄️ Configuração do Banco de Dados - Armwrestling Brasil

Este guia irá te ajudar a configurar completamente o banco de dados PostgreSQL para o projeto Armwrestling Brasil.

## 📋 Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **PostgreSQL** 12.0 ou superior
- **npm** ou **yarn**

## 🚀 Setup Automático (Recomendado)

### 1. Execute o script de setup automático:

```bash
cd backend
node setup-database.js
```

Este script irá:
- ✅ Verificar se o PostgreSQL está instalado
- ✅ Criar o arquivo .env automaticamente
- ✅ Criar o banco de dados
- ✅ Executar todas as migrações
- ✅ Inserir dados iniciais (seed)
- ✅ Configurar o usuário administrador

## 🔧 Setup Manual

### 1. Instalar PostgreSQL

#### Windows:
- Baixe em: https://www.postgresql.org/download/windows/
- Instale com senha padrão ou configure sua própria
- Anote a senha do usuário `postgres`

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE armwrestling_brasil;

# Verificar se foi criado
\l

# Sair
\q
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `env.example` para `.env`:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=armwrestling_brasil
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_123456
JWT_EXPIRES_IN=7d

# Outras configurações...
```

### 4. Executar Migrações

```bash
# Instalar dependências
npm install

# Executar migração
npm run db:migrate

# Executar seed (dados iniciais)
npm run db:seed
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais:

1. **users** - Usuários do sistema (admin, equipes, visitantes)
2. **teams** - Equipes de armwrestling
3. **athletes** - Atletas das equipes
4. **events** - Eventos e competições
5. **event_registrations** - Inscrições em eventos
6. **sponsors** - Patrocinadores
7. **posts** - Blog e notícias
8. **payments** - Sistema de pagamentos
9. **favorites** - Sistema de favoritos
10. **notifications** - Notificações do sistema
11. **site_settings** - Configurações do site
12. **activity_logs** - Logs de atividades

### Índices de Performance:
- Email dos usuários
- Status das equipes e eventos
- Localização (cidade/estado)
- Datas de eventos
- Status de pagamentos

## 🔐 Usuário Administrador

Após executar o seed, você terá acesso com:

- **Email**: `contatothawer@gmail.com`
- **Senha**: `Wardraw1!`
- **Tipo**: Administrador

## 🛠️ Comandos Úteis

### Verificar Conexão:
```bash
npm run db:test
```

### Resetar Banco (cuidado!):
```bash
npm run db:reset
```

### Ver Tabelas:
```bash
npm run db:check
```

### Backup:
```bash
pg_dump -U postgres armwrestling_brasil > backup.sql
```

### Restaurar:
```bash
psql -U postgres armwrestling_brasil < backup.sql
```

## 🔍 Solução de Problemas

### Erro de Conexão:
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo .env
- Teste a conexão: `psql -U postgres -d armwrestling_brasil`

### Erro de Permissão:
```bash
# Conectar como postgres
sudo -u postgres psql

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE armwrestling_brasil TO postgres;
```

### Erro de Migração:
- Verifique se o banco existe
- Confirme se as tabelas não foram criadas manualmente
- Execute: `npm run db:migrate` novamente

## 📱 Acesso ao Sistema

Após a configuração:

1. **Frontend**: http://localhost:8080
2. **Backend**: http://localhost:3001
3. **Painel Admin**: http://localhost:8080/admin
4. **API Docs**: http://localhost:3001/api-docs

## 🎯 Próximos Passos

1. ✅ Banco de dados configurado
2. ✅ Usuário administrador criado
3. 🔄 Iniciar backend: `npm run dev`
4. 🔄 Iniciar frontend: `npm run dev`
5. 🔄 Fazer login como administrador
6. 🔄 Explorar o painel administrativo

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console
2. Confirme as configurações do .env
3. Teste a conexão com o banco
4. Execute os comandos de setup novamente

---

**🎉 Parabéns! Seu banco de dados está configurado e pronto para uso!**
