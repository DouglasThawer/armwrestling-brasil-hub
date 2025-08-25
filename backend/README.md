# 🏆 Armwrestling Brasil - Backend

Backend completo para o projeto Armwrestling Brasil, desenvolvido com Node.js, Express e PostgreSQL.

## 🚀 Funcionalidades

### 🔐 Autenticação e Autorização
- **JWT (JSON Web Tokens)** para autenticação segura
- **Sistema de roles**: Admin, Equipe, Visitante
- **Middleware de autorização** baseado em permissões
- **Recuperação de senha** com tokens seguros

### 👥 Gestão de Usuários
- **Cadastro e login** de usuários
- **Perfis de usuário** com informações detalhadas
- **Verificação de e-mail** para novos usuários
- **Gestão administrativa** de contas

### 🏅 Gestão de Equipes
- **Cadastro de equipes** com aprovação administrativa
- **Perfis completos** com redes sociais e localização
- **Sistema de aprovação** com notificações por e-mail
- **Gestão de membros** e atletas

### 🏃‍♂️ Gestão de Atletas
- **Cadastro de atletas** vinculados a equipes
- **Perfis detalhados** com histórico e conquistas
- **Sistema de categorias** por peso e idade
- **Resultados de competições**

### 📅 Gestão de Eventos
- **Criação e edição** de eventos
- **Sistema de inscrições** com controle de capacidade
- **Gestão de resultados** e classificações
- **Notificações automáticas** para participantes

### 💰 Sistema de Pagamentos
- **Integração com Mercado Pago** para pagamentos
- **Webhooks** para atualização automática de status
- **Histórico de transações** completo
- **Relatórios financeiros** para administradores

### 📝 Blog e Notícias
- **Sistema de posts** com categorias e tags
- **Editor rico** para criação de conteúdo
- **Sistema de publicação** com rascunhos
- **Gestão de mídia** integrada

### 🎯 Sistema de Favoritos
- **Favoritar equipes** e atletas
- **Lista personalizada** de preferências
- **Notificações** sobre favoritos

### 📧 Sistema de E-mails
- **Templates HTML** profissionais
- **Notificações automáticas** para eventos importantes
- **E-mails de boas-vindas** para novos usuários
- **Configurável** para diferentes provedores SMTP

### 📁 Upload de Arquivos
- **Firebase Storage** para armazenamento
- **Suporte a imagens, vídeos e documentos**
- **Validação de tipos** e tamanhos
- **URLs públicas** e assinadas

### 📊 Dashboard Administrativo
- **Estatísticas em tempo real** da plataforma
- **Relatórios detalhados** de usuários, eventos e finanças
- **Métricas de engajamento** e crescimento
- **Análises de performance** do sistema

## 🛠️ Tecnologias Utilizadas

### Core
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional

### Autenticação e Segurança
- **JWT** - Tokens de autenticação
- **bcryptjs** - Hash de senhas
- **Helmet** - Headers de segurança
- **CORS** - Cross-Origin Resource Sharing

### Validação e Sanitização
- **express-validator** - Validação de dados
- **Joi** - Validação de schemas

### Performance e Monitoramento
- **Morgan** - Logging de requisições
- **Compression** - Compressão GZIP
- **Rate Limiting** - Proteção contra spam
- **Slow Down** - Prevenção de ataques

### Integrações Externas
- **Firebase Admin SDK** - Upload de arquivos
- **Mercado Pago** - Processamento de pagamentos
- **Nodemailer** - Envio de e-mails
- **Google APIs** - Integração com mapas

### Documentação
- **Swagger/OpenAPI** - Documentação da API
- **JSDoc** - Documentação do código

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── database/           # Configuração e migrações do banco
│   ├── middleware/         # Middlewares personalizados
│   ├── routes/            # Rotas da API
│   ├── services/          # Serviços de negócio
│   └── server.js          # Arquivo principal do servidor
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências e scripts
└── README.md             # Esta documentação
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** 18.0.0 ou superior
- **PostgreSQL** 12.0 ou superior
- **npm** ou **yarn** para gerenciamento de pacotes

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd armwrestling-brasil-hub/backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```env
# Configurações do Servidor
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=armwrestling_brasil
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Firebase (para upload de arquivos)
FIREBASE_PROJECT_ID=seu_projeto_firebase
FIREBASE_PRIVATE_KEY=chave_privada_firebase
FIREBASE_CLIENT_EMAIL=email_cliente_firebase

# Google Maps API
GOOGLE_MAPS_API_KEY=sua_chave_api_google_maps

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_token_mercadopago

# E-mail (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### 4. Configure o banco de dados
```bash
# Criar banco de dados
createdb armwrestling_brasil

# Executar migrações
npm run db:migrate

# Popular com dados de exemplo (opcional)
npm run db:seed
```

### 5. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Documentação da API

A documentação completa da API está disponível em:

- **Desenvolvimento**: `http://localhost:3001/api-docs`
- **Produção**: `https://api.armwrestlingbrasil.com/api-docs`

### Endpoints Principais

#### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário logado
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/change-password` - Alterar senha

#### Equipes
- `GET /api/teams` - Listar equipes
- `POST /api/teams` - Criar equipe
- `GET /api/teams/:id` - Obter equipe por ID
- `PUT /api/teams/:id` - Atualizar equipe
- `POST /api/teams/:id/approve` - Aprovar/rejeitar equipe (admin)
- `DELETE /api/teams/:id` - Deletar equipe

#### Atletas
- `GET /api/athletes` - Listar atletas
- `POST /api/athletes` - Criar atleta
- `GET /api/athletes/:id` - Obter atleta por ID
- `PUT /api/athletes/:id` - Atualizar atleta
- `DELETE /api/athletes/:id` - Deletar atleta

#### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/events/:id` - Obter evento por ID
- `PUT /api/events/:id` - Atualizar evento
- `POST /api/events/:id/register` - Inscrever atleta
- `POST /api/events/:id/results` - Adicionar resultados

#### Upload de Arquivos
- `POST /api/upload/image` - Upload de imagem
- `POST /api/upload/video` - Upload de vídeo
- `POST /api/upload/file` - Upload de arquivo genérico
- `POST /api/upload/multiple` - Upload múltiplo
- `GET /api/upload/files/:folder` - Listar arquivos
- `DELETE /api/upload/delete/:fileName` - Deletar arquivo

#### Administração
- `GET /api/admin/dashboard` - Dashboard administrativo
- `GET /api/admin/reports/users` - Relatório de usuários
- `GET /api/admin/reports/events` - Relatório de eventos
- `GET /api/admin/reports/financial` - Relatório financeiro
- `GET /api/admin/analytics/engagement` - Análise de engajamento

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes específicos
npm test -- --grep "auth"
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor com nodemon

# Produção
npm start            # Inicia servidor de produção
npm run build        # Build para produção

# Banco de dados
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados de exemplo
npm run db:reset     # Reseta banco (migrate + seed)

# Testes
npm test             # Executa testes
npm run test:watch   # Executa testes em modo watch
```

## 🔒 Segurança

### Headers de Segurança
- **Helmet** para headers HTTP seguros
- **CORS** configurado para origens permitidas
- **Rate Limiting** para prevenir ataques de força bruta

### Validação de Dados
- **express-validator** para validação de entrada
- **Sanitização** automática de dados
- **Validação de tipos** e formatos

### Autenticação
- **JWT** com expiração configurável
- **Hash de senhas** com bcrypt
- **Middleware de autorização** baseado em roles

## 🚀 Deploy

### Render
1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### AWS
1. Configure o Elastic Beanstalk
2. Configure o RDS para PostgreSQL
3. Configure o S3 para uploads (opcional)

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Monitoramento

### Logs
- **Morgan** para logs de requisições HTTP
- **Console logs** para erros e informações importantes
- **Estrutura de logs** padronizada

### Métricas
- **Health check** endpoint em `/health`
- **Métricas de performance** do banco de dados
- **Estatísticas de uso** da API

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: contato@armwrestlingbrasil.com
- **Documentação**: [docs.armwrestlingbrasil.com](https://docs.armwrestlingbrasil.com)
- **Issues**: [GitHub Issues](https://github.com/armwrestling-brasil/backend/issues)

## 🎯 Roadmap

### Versão 1.1
- [ ] Integração com Stripe como alternativa ao Mercado Pago
- [ ] Sistema de notificações push
- [ ] API para aplicativo mobile

### Versão 1.2
- [ ] Sistema de rankings e classificações
- [ ] Integração com redes sociais
- [ ] Sistema de gamificação

### Versão 2.0
- [ ] Microserviços
- [ ] Cache distribuído (Redis)
- [ ] Sistema de eventos em tempo real

---

**Desenvolvido com ❤️ pela Equipe Armwrestling Brasil**
