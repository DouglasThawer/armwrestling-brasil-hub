# 🚀 Configuração Rápida - Arm Wrestling Brasil Hub

## ⚡ Passos Rápidos para Funcionar

### 1. Instalar PostgreSQL
- **Windows**: Baixe e instale do [site oficial](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

### 2. Criar Banco de Dados
```bash
psql -U postgres
CREATE DATABASE armwrestling_brasil;
\q
```

### 3. Configurar Senha
Edite o arquivo `backend/.env` e altere:
```env
DB_PASSWORD=sua_senha_aqui
```
Para sua senha real do PostgreSQL!

### 4. Configurar Banco
```bash
cd backend
node scripts/setup-database.js
```

### 5. Testar Conexão
```bash
node scripts/test-connection.js
```

### 6. Iniciar Servidor
```bash
npm run dev
```

## 🔑 Login de Teste
- **Email**: admin@armwrestling.com.br
- **Senha**: example_hash

## ❗ Se Der Erro
1. Verifique se PostgreSQL está rodando
2. Confirme se a senha no `.env` está correta
3. Verifique se o banco `armwrestling_brasil` existe
4. Execute `node scripts/test-connection.js` para diagnosticar

## 📚 Documentação Completa
Veja `backend/README-DATABASE.md` para instruções detalhadas.
