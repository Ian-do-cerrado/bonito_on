-- Migração: adicionar controle de visibilidade de preços por passeio
-- Executar no SQL Editor do Supabase

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS visible_prices text[];

-- NULL = todos visíveis (padrão). Ex: '{adulto,crianca,ms}' = só adulto, criança e MS

-- Confirmar estrutura:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tours'
  AND column_name IN (
    'visible_prices',
    'preferred_baixa_tabela',
    'preferred_ms_tabela',
    'preferred_bonitense_tabela'
  )
ORDER BY column_name;
