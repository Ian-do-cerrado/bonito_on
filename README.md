# bonito_on

Site Bonitoon (Next.js) — repositório oficial conectado à Vercel.

**GitHub:** https://github.com/Ian-do-cerrado/bonito_on

## Colaborador (Davi — @davirlima)

1. Aceite o convite em https://github.com/notifications (conta **davirlima**).
   - Se o e-mail não chegar, use o link acima logado no GitHub.
2. Clone o repositório:
   ```bash
   git clone https://github.com/Ian-do-cerrado/bonito_on.git
   cd bonito_on
   npm install
   cp .env.example .env.local
   ```
3. Crie uma branch, altere o código e abra **Pull Request** para `main`.

## Deploy em produção (Ian)

Após **merge** do PR em `main`:

1. Execute **`DEPLOY_PRODUCAO.bat`**
2. O script baixa `origin/main`, roda type-check e publica na Vercel.

> Com a Vercel conectada ao GitHub, cada merge em `main` também pode disparar deploy automático. O `.bat` serve para publicar manualmente com validação local.

## Scripts

| Arquivo | Função |
|---------|--------|
| `SETUP_GITHUB_REPO.bat` | Conecta o remote e reenvia convite ao colaborador |
| `DEPLOY_PRODUCAO.bat` | Sincroniza `main` do GitHub e deploy Vercel |
