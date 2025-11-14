-- 1. Adicionar uma nova coluna para armazenar o ID de autenticação do usuário
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- 2. Preencher a nova coluna com os IDs correspondentes da tabela auth.users
-- Esta operação une as tabelas com base no email para encontrar o ID de autenticação correto
UPDATE public.admin_users AS admins
SET auth_user_id = users.id
FROM auth.users AS users
WHERE admins.email = users.email
  AND admins.auth_user_id IS NULL; -- Apenas atualiza se a coluna ainda não estiver preenchida

-- 3. Adicionar uma restrição de chave estrangeira para manter a integridade dos dados
-- Isso garante que cada admin_user corresponda a um usuário de autenticação válido
-- e define que, se um usuário for excluído da autenticação, a entrada correspondente em admin_users também será removida (ON DELETE CASCADE)
ALTER TABLE public.admin_users
ADD CONSTRAINT fk_auth_user_id
FOREIGN KEY (auth_user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4. (Opcional, mas recomendado) Remover a coluna 'id' antiga se ela não for mais necessária
-- Se a sua tabela 'admin_users' tem uma coluna 'id' que não é a chave primária ou não é mais usada,
-- você pode removê-la para evitar confusão. Descomente a linha abaixo se aplicável.
-- ALTER TABLE public.admin_users DROP COLUMN IF EXISTS id;

-- 5. (Opcional, mas recomendado) Definir a nova coluna como chave primária
-- Se a coluna 'id' antiga foi removida, defina 'auth_user_id' como a nova chave primária.
-- ALTER TABLE public.admin_users ADD PRIMARY KEY (auth_user_id);

-- Mensagem de conclusão
SELECT 'Migração para sincronizar IDs de administradores concluída com sucesso.';