# 🚀 Deploy Rápido para Hostinger

## ⚡ Comandos Rápidos

```bash
# Deploy completo automatizado
npm run deploy

# Ou apenas o build para Hostinger
npm run build:hostinger
```

## 📋 Passos para Deploy

### 1. Preparar o Projeto
```bash
# Instalar dependências (se necessário)
npm install

# Fazer build otimizado para Hostinger
npm run build:hostinger
```

### 2. Upload para Hostinger
- Acesse o painel do Hostinger
- Vá para "Gerenciador de Arquivos"
- Navegue para `public_html`
- Delete arquivos existentes (se houver)
- **Upload de TODOS os arquivos da pasta `dist/`**
- **IMPORTANTE**: Coloque na raiz, não em subpasta

### 3. Configurar Domínio
- Vá para "Domínios" no painel
- Configure o domínio para apontar para `public_html`
- Ative o SSL gratuito

## 🔧 Configurações Importantes

### Arquivo .htaccess
O arquivo `.htaccess` já está configurado para:
- ✅ SPA (Single Page Application)
- ✅ Redirecionamento de rotas
- ✅ Cache otimizado
- ✅ Compressão GZIP
- ✅ Headers de segurança

### Build Otimizado
O build para Hostinger inclui:
- ✅ Chunks otimizados
- ✅ Minificação ESBuild
- ✅ Compatibilidade ES2015
- ✅ Assets organizados por tipo
- ✅ Console removido em produção

## 🚨 Problemas Comuns

### Erro 404 em rotas internas
**Solução**: Verificar se `.htaccess` está na raiz de `public_html`

### Página em branco
**Solução**: Verificar console do navegador para erros JavaScript

### Performance lenta
**Solução**: Verificar se GZIP está ativo no painel do Hostinger

## 📱 Teste Final

Após o upload, teste:
- [ ] Página inicial carrega
- [ ] Navegação funciona
- [ ] Formulários funcionam
- [ ] Responsividade mobile
- [ ] Sem erros no console

## 🌐 URL Final

Seu site estará disponível em:
`https://seu-dominio.com`

---

**💡 Dica**: Use `npm run deploy` para automatizar todo o processo!
