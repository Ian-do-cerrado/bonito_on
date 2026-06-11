# collab-site-bonitoon

Site Bonitoon (Next.js) — repositório para colaboração via Pull Requests.

## Primeira vez (dono do projeto)

1. Instale o [GitHub CLI](https://cli.github.com/) se ainda não tiver.
2. Faça login: `gh auth login`
3. Execute **`SETUP_GITHUB_REPO.bat`** (cria o repo, envia o código e convida o colaborador).
4. Copie `.env.example` para `.env.local` e preencha as variáveis (não vão para o Git).

## Colaborador (Davi)

1. Aceite o convite recebido no e-mail `davi.rlima04@gmail.com`.
2. Clone o repositório:
   ```bash
   git clone https://github.com/<dono>/collab-site-bonitoon.git
   cd collab-site-bonitoon
   npm install
   cp .env.example .env.local
   ```
3. Crie uma branch, faça alterações e abra um **Pull Request** para `main`.
4. Não é necessário conta na Vercel — só merge no GitHub.

## Deploy em produção (somente dono)

Após **merge** do PR em `main`:

1. Execute **`DEPLOY_PRODUCAO.bat`**
2. O script baixa `origin/main`, roda type-check e publica na Vercel.

## Scripts

| Arquivo | Função |
|---------|--------|
| `SETUP_GITHUB_REPO.bat` | Cria repo GitHub + convite (uma vez) |
| `DEPLOY_PRODUCAO.bat` | Sincroniza `main` do GitHub e deploy Vercel |
