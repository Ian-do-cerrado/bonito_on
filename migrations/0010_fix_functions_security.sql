-- =====================================================
-- Fix 1: Remover policy "RLS Policy Always True"
-- A policy leads_prevenda_anon_insert usava WITH CHECK (true),
-- flagrado como permissivo demais. Inserção de leads deve
-- vir via service_role key (bypassa RLS), não anon.
-- =====================================================
DROP POLICY IF EXISTS "leads_prevenda_anon_insert" ON public.leads_prevenda;

-- =====================================================
-- Fix 2: Function Search Path Mutable
-- Funções sem search_path fixo permitem que um atacante
-- crie objetos em schemas carregados antes do público,
-- podendo sequestrar o comportamento da função.
-- Fix: fixar search_path = '' (usa nomes qualificados)
-- =====================================================
ALTER FUNCTION public.generate_blog_slug(title text) SET search_path = '';
ALTER FUNCTION public.generate_slug() SET search_path = '';
ALTER FUNCTION public.set_blog_slug() SET search_path = '';
