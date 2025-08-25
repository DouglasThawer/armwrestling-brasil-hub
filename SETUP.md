# 🚀 SISTEMA ARMWRESTLING BRASIL - CONFIGURAÇÃO COMPLETA

## 📋 **PRÉ-REQUISITOS**

- ✅ Node.js 18+ instalado
- ✅ Conta no Supabase
- ✅ Projeto Supabase criado
- ✅ Acesso ao SQL Editor do Supabase

## 🗄️ **CONFIGURAÇÃO DO BANCO DE DADOS**

### **1. Executar Script SQL**
1. Acesse o **SQL Editor** no seu projeto Supabase
2. Copie e cole o conteúdo do arquivo `database/schema.sql`
3. Execute o script completo
4. Verifique se todas as tabelas foram criadas

### **2. Verificar Tabelas Criadas**
As seguintes tabelas devem estar disponíveis:
- `users` - Usuários do sistema
- `teams` - Equipes de armwrestling
- `team_members` - Membros das equipes
- `sponsors` - Patrocinadores
- `events` - Eventos
- `event_registrations` - Inscrições em eventos
- `posts` - Posts do blog

## 🔧 **CONFIGURAÇÃO DO PROJETO**

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Configurar Variáveis de Ambiente**
Verifique se o arquivo `src/integrations/supabase/client.ts` está configurado com:
- ✅ **SUPABASE_URL** correto
- ✅ **SUPABASE_PUBLISHABLE_KEY** correto

### **3. Executar o Projeto**
```bash
npm run dev
```

## 👑 **CRIAR USUÁRIO ADMINISTRATIVO**

### **1. Acessar a Página de Login**
- URL: `http://localhost:8080/login`

### **2. Criar Usuário Admin**
- Clique no botão **"👑 Criar Usuário Admin"**
- Aguarde a confirmação
- Use as credenciais: `admin@armwrestling.com` / `admin123`

### **3. Fazer Login**
- Preencha as credenciais
- Clique em **"Entrar"**
- Você será redirecionado para `/admin`

## 🏗️ **ESTRUTURA DO SISTEMA**

### **Serviços Implementados**
- ✅ **UserService** - Gerenciamento de usuários
- ✅ **TeamService** - Gerenciamento de equipes
- ✅ **SponsorService** - Gerenciamento de patrocinadores

### **Funcionalidades Disponíveis**
- ✅ **Autenticação** - Login/Logout com Supabase
- ✅ **Cadastro de Usuários** - Criação de perfis
- ✅ **Cadastro de Equipes** - Formulário multi-step
- ✅ **Cadastro de Patrocinadores** - Sistema completo
- ✅ **Sistema de Aprovação** - Status pending/active
- ✅ **Segurança RLS** - Políticas de acesso

## 🔐 **SISTEMA DE AUTENTICAÇÃO**

### **Tipos de Usuário**
- **admin** - Acesso total ao sistema
- **team_leader** - Líder de equipe
- **sponsor** - Patrocinador
- **user** - Usuário comum

### **Fluxo de Login**
1. Usuário preenche credenciais
2. Supabase valida autenticação
3. Dados são salvos no localStorage
4. Redirecionamento para painel apropriado

## 🎯 **TESTANDO O SISTEMA**

### **1. Teste de Conexão**
- Clique em **"🧪 Testar Conexão Supabase"**
- Verifique se a conexão está funcionando

### **2. Teste de Criação de Usuários**
- Crie usuário admin
- Crie usuário de teste
- Verifique se aparecem no console

### **3. Teste de Registro de Equipe**
- Acesse `/registro`
- Preencha o formulário completo
- Verifique se a equipe é criada

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Erro: "Tabela não existe"**
- Execute o script SQL no Supabase
- Verifique se as tabelas foram criadas

### **Erro: "Usuário já existe"**
- Use outro e-mail para teste
- Ou faça login com as credenciais existentes

### **Erro: "Conexão falhou"**
- Verifique as credenciais do Supabase
- Confirme se o projeto está ativo

### **Erro: "Permissão negada"**
- Verifique as políticas RLS
- Confirme se o usuário tem permissões adequadas

## 📱 **FUNCIONALIDADES MOBILE**

- ✅ **Responsivo** - Funciona em todos os dispositivos
- ✅ **Touch-friendly** - Botões e inputs otimizados
- ✅ **Navegação mobile** - Menu hambúrguer funcional

## 🔒 **SEGURANÇA IMPLEMENTADA**

- ✅ **Row Level Security (RLS)** - Controle de acesso por usuário
- ✅ **Validação de dados** - Verificação de entrada
- ✅ **Autenticação Supabase** - Sistema robusto de login
- ✅ **Políticas de acesso** - Controle granular de permissões

## 🚀 **PRÓXIMOS PASSOS**

### **Funcionalidades Futuras**
- [ ] Sistema de notificações
- [ ] Upload de imagens
- [ ] Sistema de pagamentos
- [ ] API REST completa
- [ ] Dashboard avançado

### **Melhorias Técnicas**
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Backup automático

## 📞 **SUPORTE**

### **Em caso de problemas:**
1. Verifique o console do navegador
2. Confirme as configurações do Supabase
3. Execute o script SQL novamente
4. Verifique se todas as dependências estão instaladas

### **Contato:**
- **Email:** suporte@armwrestlingbrasil.com
- **Documentação:** Este arquivo SETUP.md

---

## 🎉 **SISTEMA CONFIGURADO COM SUCESSO!**

Agora você tem um sistema completo de cadastro de usuários, equipes e patrocinadores funcionando perfeitamente! 🚀
