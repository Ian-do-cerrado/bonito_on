-- =====================================================
-- Preços do passeio "Pantanal Experiência"
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard
-- =====================================================
-- NOTA: Se atrativo_atividade_precos for uma VIEW (não tabela),
-- será necessário inserir nas tabelas base (btms_atrativos, btms_atividades, btms_tabelas_preco).
-- Verifique no Table Editor se a estrutura permite INSERT.
-- =====================================================

INSERT INTO public.atrativo_atividade_precos (
  atrativo,
  atividade,
  nome_tabela_preco,
  vig_inicio,
  vig_fim,
  publico_pax,
  publico_chd
) VALUES
-- Day Use – Vida de Comitiva com almoço - 100% Peão
('Pantanal Experiência', 'Day Use – Vida de Comitiva com almoço - 100% Peão', 'Alta temporada', '2025-01-01', '2026-12-31', 615, 465),
-- Meio Período – Vida de Comitiva sem almoço - 100% Peão
('Pantanal Experiência', 'Meio Período – Vida de Comitiva sem almoço - 100% Peão', 'Alta temporada', '2025-01-01', '2026-12-31', 395, 300),
-- Day Use – Cheiros e Sabores com almoço
('Pantanal Experiência', 'Day Use – Cheiros e Sabores com almoço', 'Alta temporada', '2025-01-01', '2026-12-31', 455, 395),
-- Meio Período – Cheiros e Sabores sem almoço
('Pantanal Experiência', 'Meio Período – Cheiros e Sabores sem almoço', 'Alta temporada', '2025-01-01', '2026-12-31', 240, 190),
-- Pacote Especial Comitiva Raiz – 02 Noites e 02 dias (adulto e criança 13+ mesmo valor)
('Pantanal Experiência', 'Pacote Especial Comitiva Raiz – 02 Noites e 02 dias', 'Alta temporada', '2025-01-01', '2026-12-31', 2615, 2615);

-- Valores extraídos do texto:

-- 1. Day Use – Vida de Comitiva com almoço - 100% Peão
--    Adulto: R$ 615 | Criança 7-11: R$ 465

-- 2. Meio Período – Vida de Comitiva sem almoço - 100% Peão
--    Adulto: R$ 395 | Criança 7-11: R$ 300

-- 3. Day Use – Cheiros e Sabores com almoço
--    Adulto: R$ 455 | Criança 7-11: R$ 395

-- 4. Meio Período – Cheiros e Sabores sem almoço
--    Adulto: R$ 240 | Criança 7-11: R$ 190

-- 5. Pacote Especial Comitiva Raiz – 02 Noites e 02 dias
--    Adultos e crianças 13+: R$ 2.615
