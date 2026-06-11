@echo off
chcp 65001 > nul
cd /d "%~dp0"
title Setup GitHub - bonito_on
color 0B

set "GH_USER=Ian-do-cerrado"
set "REPO_NAME=bonito_on"
set "REPO_URL=https://github.com/%GH_USER%/%REPO_NAME%.git"
set "COLLAB_USER=davirlima"
set "BRANCH=main"

echo ========================================================
echo   REPOSITORIO GITHUB - %REPO_NAME%
echo ========================================================
echo.
echo Repo oficial (Vercel): %REPO_URL%
echo.
echo Este script:
echo   1. Conecta esta pasta ao repositorio remoto
echo   2. Convida @%COLLAB_USER% para colaborar (PRs e branches)
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
    echo Faca login: gh auth login
    goto error
)

if not exist .git (
    echo Inicializando Git...
    git init -b %BRANCH%
)

git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Configurando remote origin...
    git remote add origin %REPO_URL%
) else (
    git remote set-url origin %REPO_URL%
)

echo.
echo Convidando @%COLLAB_USER%...
gh api --method PUT -H "Accept: application/vnd.github+json" "/repos/%GH_USER%/%REPO_NAME%/collaborators/%COLLAB_USER%" -f permission="push"
if %errorlevel% neq 0 (
    echo [AVISO] Convite automatico falhou.
    echo Convide manualmente: https://github.com/%GH_USER%/%REPO_NAME%/settings/access
    goto done
)

echo.
echo Convite enviado para @%COLLAB_USER%.
echo Link direto: https://github.com/%GH_USER%/%REPO_NAME%/invitations
echo.
echo Se o e-mail nao chegar, o Davi pode aceitar em:
echo   https://github.com/notifications
echo   (logado como @%COLLAB_USER%)

:done
echo.
echo ========================================================
echo   Repositorio: %REPO_URL%
echo   Fluxo: PR no GitHub -^> merge em main -^> DEPLOY_PRODUCAO.bat
echo ========================================================
goto end

:cancel
echo Operacao cancelada.
goto end

:error
echo [ERRO] Setup incompleto.

:end
echo.
pause
