# 🪟 Configuração para Windows - Arm Wrestling Brasil Hub

## 🚀 Passos para Windows

### 1. Instalar PostgreSQL
1. Baixe o instalador do [PostgreSQL para Windows](https://www.postgresql.org/download/windows/)
2. Execute o instalador como administrador
3. **IMPORTANTE**: Anote a senha que você definir para o usuário `postgres`
4. Mantenha a porta padrão (5432)
5. Instale todas as ferramentas (pgAdmin, etc.)

### 2. Verificar Instalação
Após a instalação, o PostgreSQL deve estar rodando como serviço. Verifique:
- Abra o **Gerenciador de Serviços** (services.msc)
- Procure por "postgresql-x64-XX" (onde XX é a versão)
- Deve estar como "Em execução"

### 3. Criar Banco de Dados
1. Abra o **pgAdmin** (instalado com o PostgreSQL)
2. Conecte ao servidor local
3. Clique com botão direito em "Databases"
4. Selecione "Create" > "Database"
5. Nome: `armwrestling_brasil`
6. Clique em "Save"

### 4. Configurar Senha no .env
Edite o arquivo `backend/.env` e altere:
```env
DB_PASSWORD=sua_senha_aqui
```
Para a senha que você definiu durante a instalação!

### 5. Testar Conexão
```bash
cd backend
node scripts/test-connection.js
```

### 6. Configurar Banco
```bash
node scripts/setup-database.js
```

### 7. Iniciar Servidor
```bash
npm run dev
```

## 🔧 Solução de Problemas

### PostgreSQL não está rodando
1. Abra o **Gerenciador de Serviços**
2. Procure por "postgresql"
3. Clique com botão direito > "Iniciar"

### Erro de autenticação
1. Verifique se a senha no `.env` está correta
2. Tente redefinir a senha do usuário postgres:
   - Abra pgAdmin
   - Clique com botão direito no usuário postgres
   - Selecione "Properties" > "Definition"
   - Altere a senha

### Porta 5432 ocupada
1. Verifique se outro PostgreSQL está rodando
2. Pare o serviço antigo ou mude a porta no `.env`

## 📱 Alternativa: Usar SQLite
Se tiver problemas com PostgreSQL, posso configurar para usar SQLite (mais simples).

## 🆘 Ainda com Problemas?
1. Verifique os logs do PostgreSQL
2. Confirme se o usuário postgres tem permissões de superusuário
3. Tente criar um novo usuário com permissões adequadas
