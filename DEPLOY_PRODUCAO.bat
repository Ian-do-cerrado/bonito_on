@echo off
:: Garante que o terminal use UTF-8 para os acentos
chcp 65001 > nul
cd /d "%~dp0"
title Deploy Bonitoon - Producao
color 0A

set "BRANCH=main"

echo ========================================================
echo        DEPLOY BONITOON - VERSAO PRODUCAO
echo ========================================================
echo.
echo Este script baixa o codigo aprovado no GitHub e publica na Vercel.
echo Repo: https://github.com/Ian-do-cerrado/bonito_on (branch %BRANCH%)
echo.
set /p opt="Deseja continuar? (S/N): "

if /i "%opt%" neq "S" goto cancel

git rev-parse --is-inside-work-tree >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Repositorio Git nao encontrado nesta pasta.
    echo        Execute SETUP_GITHUB_REPO.bat primeiro.
    goto error
)

git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Remote "origin" nao configurado.
    echo        Execute SETUP_GITHUB_REPO.bat primeiro.
    goto error
)

echo.
echo [1/4] Sincronizando com GitHub (origin/%BRANCH%)...
echo.

git diff --quiet 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] Alteracoes locais serao descartadas para igualar ao GitHub.
    echo.
)

git fetch origin
if %errorlevel% neq 0 goto error

git checkout %BRANCH% 2>nul
if %errorlevel% neq 0 (
    git checkout -b %BRANCH% origin/%BRANCH%
    if %errorlevel% neq 0 goto error
)

git reset --hard origin/%BRANCH%
if %errorlevel% neq 0 goto error

echo.
echo Versao que sera publicada:
git log -1 --format=%%h %%s (%%an, %%ci)
echo.

echo [2/4] Verificando erros de codigo (Type-Check)...
echo.

call npm run type-check

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo    [ERRO] O Type-Check falhou! Corrija no GitHub
    echo    (branch %BRANCH%) antes de tentar o deploy novamente.
    echo ========================================================
    goto error
)

echo.
echo [3/4] Tudo OK! Iniciando deploy via Vercel...
echo.

call npx vercel --prod

if %errorlevel% neq 0 goto error

echo.
echo ========================================================
echo    [OK] DEPLOY FINALIZADO COM SUCESSO!
echo ========================================================
goto end

:cancel
echo.
echo [!] Operacao cancelada pelo usuario.
goto end

:error
echo.
echo ========================================================
echo    [ERRO] OCORREU UM PROBLEMA NO DEPLOY.
echo    Verifique: GitHub, conexao e login na Vercel (npx vercel login).
echo ========================================================

:end
echo.
pause
