@echo off
chcp 65001 > nul
cd /d "%~dp0"
title Setup GitHub - collab-site-bonitoon
color 0B

set "REPO_NAME=collab-site-bonitoon"
set "COLLAB_EMAIL=davi.rlima04@gmail.com"
set "BRANCH=main"

echo ========================================================
echo   SETUP REPOSITORIO GITHUB - %REPO_NAME%
echo ========================================================
echo.
echo Este script (executar UMA VEZ):
echo   1. Cria o repo %REPO_NAME% na sua conta GitHub
echo   2. Envia o codigo atual
echo   3. Convida %COLLAB_EMAIL% para colaborar (PRs e branches)
echo.
echo Requisito: GitHub CLI logado (gh auth login)
echo.
set /p opt="Deseja continuar? (S/N): "
if /i "%opt%" neq "S" goto cancel

where gh >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] GitHub CLI (gh) nao encontrado. Instale: winget install GitHub.cli
    goto error
)

gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Faca login no GitHub primeiro:
    echo   gh auth login
    echo.
    echo Depois execute este script novamente.
    goto error
)

for /f "delims=" %%i in ('gh api user -q .login') do set "GH_USER=%%i"
echo Conta GitHub: %GH_USER%
echo.

if not exist .git (
    echo Inicializando Git...
    git init -b %BRANCH%
)

echo Preparando commit inicial...
git add -A
git diff --cached --quiet
if %errorlevel% neq 0 (
    git commit -m "Initial commit: site Bonitoon para colaboracao"
    if %errorlevel% neq 0 goto error
)

git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Criando repositorio %REPO_NAME%...
    gh repo create %REPO_NAME% --private --source=. --remote=origin --push --description "Site Bonitoon - colaboracao"
    if %errorlevel% neq 0 goto error
) else (
    echo Remote origin ja existe. Enviando commits...
    git push -u origin %BRANCH%
    if %errorlevel% neq 0 goto error
)

echo.
echo Convidando colaborador %COLLAB_EMAIL%...
gh api --method POST -H "Accept: application/vnd.github+json" "/repos/%GH_USER%/%REPO_NAME%/invitations" -f email="%COLLAB_EMAIL%" -f role="write" >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Nao foi possivel enviar convite automaticamente.
    echo         Convide manualmente em:
    echo         https://github.com/%GH_USER%/%REPO_NAME%/settings/access
) else (
    echo Convite enviado para %COLLAB_EMAIL%.
    echo O Davi precisa aceitar no e-mail ou em https://github.com/notifications
)

echo.
echo ========================================================
echo   [OK] REPOSITORIO PRONTO
echo   https://github.com/%GH_USER%/%REPO_NAME%
echo.
echo   Fluxo:
echo   - Davi: branch + Pull Request para %BRANCH%
echo   - Voce: revisa e faz merge no GitHub
echo   - Voce: DEPLOY_PRODUCAO.bat publica o %BRANCH% na Vercel
echo ========================================================
goto end

:cancel
echo Operacao cancelada.
goto end

:error
echo.
echo [ERRO] Setup incompleto. Veja as mensagens acima.

:end
echo.
pause
