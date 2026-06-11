-- Migração: adicionar campos de preferência de preço por categoria
-- Executar no SQL Editor do Supabase (bonitoon.com.br > Project > SQL Editor)

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS preferred_baixa_tabela  text,
  ADD COLUMN IF NOT EXISTS preferred_ms_tabela      text,
  ADD COLUMN IF NOT EXISTS preferred_bonitense_tabela text;

-- Confirmar:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tours'
  AND column_name IN (
    'preferred_price_atividade',
    'preferred_price_tabela',
    'preferred_baixa_tabela',
    'preferred_ms_tabela',
    'preferred_bonitense_tabela',
    'btms_atrativo_override'
  )
ORDER BY column_name;
