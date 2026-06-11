-- =====================================================
-- Configuração da tabela admin_users para o painel admin
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard
-- =====================================================

-- 1. Criar a tabela admin_users (se ainda não existir)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inserir o usuário admin (ajuste o email para o que você criou no Auth)
INSERT INTO public.admin_users (email, is_active)
VALUES ('ian@bon.com.br', true)
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- 3. Verificar se foi inserido
SELECT * FROM public.admin_users WHERE email = 'ian@bon.com.br';
