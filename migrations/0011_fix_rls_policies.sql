-- =====================================================
-- Fix 1: Corrigir políticas RLS que usavam auth_user_id
-- O app (auth.ts) consulta admin_users pelo campo 'id',
-- que é o UUID do usuário em auth.users.
-- As políticas anteriores usavam 'auth_user_id' incorretamente,
-- bloqueando admins autenticados de acessar as tabelas.
-- =====================================================

-- tours_2
DROP POLICY IF EXISTS "tours_2_admin_all" ON public.tours_2;
CREATE POLICY "tours_2_admin_all"
  ON public.tours_2
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- btms_price_tables
DROP POLICY IF EXISTS "btms_price_tables_admin_all" ON public.btms_price_tables;
CREATE POLICY "btms_price_tables_admin_all"
  ON public.btms_price_tables
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- btms_atrativos
DROP POLICY IF EXISTS "btms_atrativos_admin_all" ON public.btms_atrativos;
CREATE POLICY "btms_atrativos_admin_all"
  ON public.btms_atrativos
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- btms_atividades
DROP POLICY IF EXISTS "btms_atividades_admin_all" ON public.btms_atividades;
CREATE POLICY "btms_atividades_admin_all"
  ON public.btms_atividades
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- btms_tabelas_preco
DROP POLICY IF EXISTS "btms_tabelas_preco_admin_all" ON public.btms_tabelas_preco;
CREATE POLICY "btms_tabelas_preco_admin_all"
  ON public.btms_tabelas_preco
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- price_sync_runs
DROP POLICY IF EXISTS "price_sync_runs_admin_select" ON public.price_sync_runs;
CREATE POLICY "price_sync_runs_admin_select"
  ON public.price_sync_runs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- tour_images
DROP POLICY IF EXISTS "tour_images_admin_all" ON public.tour_images;
CREATE POLICY "tour_images_admin_all"
  ON public.tour_images
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- admin_settings
DROP POLICY IF EXISTS "admin_settings_admin_all" ON public.admin_settings;
CREATE POLICY "admin_settings_admin_all"
  ON public.admin_settings
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- leads_prevenda
DROP POLICY IF EXISTS "leads_prevenda_admin_all" ON public.leads_prevenda;
CREATE POLICY "leads_prevenda_admin_all"
  ON public.leads_prevenda
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

-- =====================================================
-- Fix 2: Corrigir search_path das funções de slug
-- search_path = '' exige que todos os objetos internos
-- sejam schema-qualificados (ex: public.tours).
-- Como não temos controle do corpo das funções,
-- usamos search_path = public para manter compatibilidade.
-- =====================================================
ALTER FUNCTION public.generate_blog_slug(title text) SET search_path = public;
ALTER FUNCTION public.generate_slug() SET search_path = public;
ALTER FUNCTION public.set_blog_slug() SET search_path = public;
