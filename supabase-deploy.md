# Deploy no Supabase com Domínio Personalizado

## Configuração do Domínio Personalizado

### 1. No Painel do Supabase:
- Acesse [supabase.com](https://supabase.com)
- Vá para o projeto: `qvpflozwwtjbjfwfmjco`
- Settings > General > Custom Domain
- Adicione: `manzapkong.com.br`

### 2. Configuração DNS:
Configure os seguintes registros no seu provedor de domínio:

```
Tipo: CNAME
Nome: @
Valor: qvpflozwwtjbjfwfmjco.supabase.co
TTL: 3600

Tipo: CNAME
Nome: www
Valor: qvpflozwwtjbjfwfmjco.supabase.co
TTL: 3600
```

### 3. Build e Deploy:

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# O Supabase irá automaticamente servir os arquivos da pasta dist/
```

### 4. Verificação:
- Aguarde a propagação do DNS (24-48 horas)
- Acesse: https://manzapkong.com.br
- Verifique se o SSL está funcionando

### 5. Configurações de Ambiente:
Crie um arquivo `.env.production`:

```env
VITE_SUPABASE_URL=https://qvpflozwwtjbjfwfmjco.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGZsb3p3d3RqYmpmd2ZtamNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDA0MzksImV4cCI6MjA3MTMxNjQzOX0.AHLuWMyt240UF3L9r0P4qvvXaNqbbFIbYL9oR4kja2w
VITE_DOMAIN=manzapkong.com.br
```

## Estrutura do Projeto no Supabase:
- **Frontend:** Servido automaticamente pelo Supabase
- **Backend:** APIs do Supabase (Auth, Database, Storage)
- **Banco:** PostgreSQL gerenciado pelo Supabase
- **Storage:** Arquivos estáticos e uploads
- **SSL:** Automático com Let's Encrypt
