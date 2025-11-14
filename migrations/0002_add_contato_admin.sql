-- Script para adicionar um novo administrador: contato@bonitoon.com.br

-- Passo 1: Verificar se o usuário existe na autenticação do Supabase.
-- Se o usuário não existir, você precisa criá-lo primeiro no painel do Supabase
-- em "Authentication" -> "Users" -> "Invite user".
-- Este script assume que o usuário JÁ EXISTE na autenticação.

-- Passo 2: Inserir o novo administrador na tabela 'admin_users'
-- O script obtém o ID do usuário da tabela 'auth.users' e o insere
-- na tabela 'admin_users', garantindo a sincronização correta.

DO $$
DECLARE
    user_id_to_add UUID;
    user_email_to_add VARCHAR = 'contato@bonitoon.com.br';
BEGIN
    -- Obter o ID do usuário da tabela de autenticação
    SELECT id INTO user_id_to_add FROM auth.users WHERE email = user_email_to_add;

    -- Verificar se o usuário foi encontrado
    IF user_id_to_add IS NULL THEN
        RAISE EXCEPTION 'Usuário com email % não encontrado na autenticação do Supabase. Por favor, crie o usuário primeiro.', user_email_to_add;
    END IF;

    -- Inserir na tabela de administradores, evitando duplicatas
    INSERT INTO public.admin_users (email, auth_user_id, is_active)
    VALUES (user_email_to_add, user_id_to_add, true)
    ON CONFLICT (email) DO NOTHING; -- Não faz nada se o email já existir

    RAISE NOTICE 'Administrador % adicionado ou já existente.', user_email_to_add;
END $$;

-- Mensagem de conclusão
SELECT 'Script para adicionar administrador concluído.';