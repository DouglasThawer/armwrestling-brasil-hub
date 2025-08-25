# Configuração do Banco de Dados PostgreSQL

## Pré-requisitos

1. **PostgreSQL instalado** no seu sistema
2. **Node.js** e **npm** instalados
3. **Dependências** do projeto instaladas (`npm install`)

## Passos para Configuração

### 1. Instalar PostgreSQL

#### Windows:
- Baixe o instalador do [PostgreSQL](https://www.postgresql.org/download/windows/)
- Execute o instalador e siga as instruções
- **IMPORTANTE**: Anote a senha que você definir para o usuário `postgres`

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar o Banco de Dados

```bash
# Conectar ao PostgreSQL como usuário postgres
psql -U postgres

# Criar o banco de dados
CREATE DATABASE armwrestling_brasil;

# Verificar se foi criado
\l

# Sair do psql
\q
```

### 3. Configurar as Variáveis de Ambiente

Edite o arquivo `.env` na pasta `backend/` e configure:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=sua_chave_jwt_super_secreta_aqui

# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=armwrestling_brasil
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

**⚠️ IMPORTANTE**: Substitua `sua_senha_aqui` pela senha real do seu usuário PostgreSQL!

### 4. Executar o Script de Configuração

```bash
cd backend
node scripts/setup-database.js
```

Este script irá:
- Conectar ao banco de dados
- Criar as tabelas necessárias
- Inserir dados de exemplo

### 5. Verificar a Conexão

```bash
cd backend
npm run dev
```

Se tudo estiver configurado corretamente, você verá:
- ✅ Conexão com banco de dados estabelecida
- 📋 Tabelas encontradas: [users, teams, events]

## Estrutura do Banco de Dados

### Tabela `users`
- `id`: Identificador único
- `email`: Email do usuário (único)
- `password_hash`: Hash da senha
- `name`: Nome completo
- `role`: Função do usuário (user/admin)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

### Tabela `teams`
- `id`: Identificador único
- `name`: Nome da equipe
- `city`: Cidade
- `state`: Estado
- `country`: País
- `latitude`: Latitude para o mapa
- `longitude`: Longitude para o mapa
- `description`: Descrição da equipe

### Tabela `events`
- `id`: Identificador único
- `name`: Nome do evento
- `description`: Descrição do evento
- `start_date`: Data de início
- `end_date`: Data de fim
- `city`: Cidade do evento
- `state`: Estado do evento
- `country`: País do evento
- `latitude`: Latitude para o mapa
- `longitude`: Longitude para o mapa

## Solução de Problemas

### Erro: "connection refused"
- Verifique se o PostgreSQL está rodando
- Verifique se a porta 5432 está correta

### Erro: "authentication failed"
- Verifique se o usuário e senha estão corretos no `.env`
- Verifique se o usuário tem permissões no banco

### Erro: "database does not exist"
- Execute o comando para criar o banco de dados
- Verifique se o nome do banco está correto no `.env`

### Erro: "permission denied"
- Verifique se o usuário tem permissões para criar tabelas
- Tente conectar como superusuário primeiro

## Dados de Exemplo

Após executar o script de configuração, você terá:

- **Usuário**: admin@armwrestling.com.br (senha: example_hash)
- **Equipes**: São Paulo, Rio de Janeiro, Belo Horizonte
- **Eventos**: Campeonato Brasileiro 2024, Copa Rio 2024

## Próximos Passos

1. Teste o login com o usuário admin
2. Adicione mais usuários, equipes e eventos
3. Personalize as configurações conforme necessário

## Suporte

Se encontrar problemas:
1. Verifique os logs do backend
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste a conexão com o banco usando `psql`
4. Verifique se o PostgreSQL está rodando na porta correta
