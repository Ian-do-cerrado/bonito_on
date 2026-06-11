-- Independent semester sources (S1/S2) and refresh routine.
-- This keeps both semesters symmetric while only changing the reference split date.

CREATE OR REPLACE VIEW public.atrativo_atividade_precos_s1 AS
SELECT
  a.nome AS atrativo,
  ativ.nome AS atividade,
  COALESCE(TRIM((ativ.raw::jsonb)->>'descricao'), '') AS descricao,
  t.nome AS nome_tabela_preco,
  t.temporada,
  t.vig_inicio,
  t.vig_fim,
  t.cdgbtms_atividade,
  t.cdgbtms_atrativo,
  t.publico_pax,
  t.publico_chd,
  t.publico_chd_free,
  t.publico_crt,
  t.atrativo_pax,
  t.atrativo_chd,
  t.atrativo_chd_free,
  t.atrativo_crt,
  t.publico_alm_pax,
  t.publico_alm_chd,
  t.publico_alm_chd_free,
  t.publico_alm_crt,
  t.atrativo_alm_pax,
  t.atrativo_alm_chd,
  t.atrativo_alm_chd_free,
  t.atrativo_alm_crt,
  t.publico_trf_pax,
  t.publico_trf_chd,
  t.guia_pax,
  t.guia_chd,
  t.guia_chd_free,
  t.guia_crt,
  t.monitor_pax,
  t.monitor_chd,
  t.monitor_crt,
  t.publico_garupa_pax,
  t.publico_garupa_chd,
  t.publico_garupa_chd_free,
  t.publico_garupa_crt,
  t.atrativo_garupa_pax,
  t.atrativo_garupa_chd,
  t.atrativo_garupa_chd_free,
  t.atrativo_garupa_crt
FROM public.btms_tabelas_preco t
LEFT JOIN public.btms_atrativos a
  ON a.cdgbtms = t.cdgbtms_atrativo
LEFT JOIN public.btms_atividades ativ
  ON ativ.cdgbtms = t.cdgbtms_atividade;

CREATE OR REPLACE VIEW public.atrativo_atividade_precos_s2 AS
SELECT *
FROM public.atrativo_atividade_precos_s1
WHERE vig_inicio >= DATE '2026-07-01';

CREATE TABLE IF NOT EXISTS public.btms_prices_1o_semestre AS
SELECT *
FROM public.atrativo_atividade_precos_s1
WHERE false;

CREATE TABLE IF NOT EXISTS public.btms_prices_2o_semestre AS
SELECT *
FROM public.atrativo_atividade_precos_s2
WHERE false;

CREATE OR REPLACE FUNCTION public.refresh_btms_semester_tables(split_date date DEFAULT DATE '2026-07-01')
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  TRUNCATE TABLE public.btms_prices_1o_semestre;
  INSERT INTO public.btms_prices_1o_semestre
  SELECT *
  FROM public.atrativo_atividade_precos_s1;

  TRUNCATE TABLE public.btms_prices_2o_semestre;
  INSERT INTO public.btms_prices_2o_semestre
  SELECT *
  FROM public.atrativo_atividade_precos_s1
  WHERE vig_inicio >= split_date;
END;
$$;
