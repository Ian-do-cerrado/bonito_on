-- Adiciona colunas de preços opcionais à tabela 'tours'
ALTER TABLE public.tours
ADD COLUMN IF NOT EXISTS price_ms NUMERIC,
ADD COLUMN IF NOT EXISTS price_child NUMERIC,
ADD COLUMN IF NOT EXISTS price_high_season NUMERIC,
ADD COLUMN IF NOT EXISTS price_senior NUMERIC;

-- Adiciona colunas de preços opcionais à tabela 'tours_2o_semestre'
ALTER TABLE public.tours_2o_semestre
ADD COLUMN IF NOT EXISTS price_ms NUMERIC,
ADD COLUMN IF NOT EXISTS price_child NUMERIC,
ADD COLUMN IF NOT EXISTS price_high_season NUMERIC,
ADD COLUMN IF NOT EXISTS price_senior NUMERIC;