-- =====================================================
-- Fix 1: Security Definer Views → Security Invoker
-- Garante que as views usem as permissões do usuário
-- que consulta, respeitando RLS normalmente.
-- =====================================================
ALTER VIEW public.v_btms_activity_public_prices SET (security_invoker = on);
ALTER VIEW public.atrativo_atividade_precos SET (security_invoker = on);

-- =====================================================
-- Fix 2: Habilitar RLS em todas as tabelas flagadas
-- =====================================================
ALTER TABLE public.tours_2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btms_price_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btms_atrativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btms_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btms_tabelas_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_prevenda ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Fix 3: Policies para tours_2
-- Anon lê apenas passeios visíveis (frontend público)
-- Admins têm acesso total (painel admin)
-- =====================================================
CREATE POLICY "tours_2_anon_select"
  ON public.tours_2
  FOR SELECT TO anon
  USING (is_visible = true);

CREATE POLICY "tours_2_admin_all"
  ON public.tours_2
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

-- =====================================================
-- Fix 4: Policies para tabelas BTMS
-- Sync é feito via service_role (bypassa RLS).
-- Admins autenticados têm acesso total para consulta/gestão.
-- =====================================================
CREATE POLICY "btms_price_tables_admin_all"
  ON public.btms_price_tables
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "btms_atrativos_admin_all"
  ON public.btms_atrativos
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "btms_atividades_admin_all"
  ON public.btms_atividades
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "btms_tabelas_preco_admin_all"
  ON public.btms_tabelas_preco
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

-- =====================================================
-- Fix 5: price_sync_runs
-- Escrita feita via service_role (job de sync).
-- Admins podem consultar para monitoramento.
-- =====================================================
CREATE POLICY "price_sync_runs_admin_select"
  ON public.price_sync_runs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

-- =====================================================
-- Fix 6: tour_images
-- Gerenciado pelo painel admin.
-- =====================================================
CREATE POLICY "tour_images_admin_all"
  ON public.tour_images
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

-- =====================================================
-- Fix 7: admin_settings
-- Somente admins autenticados.
-- =====================================================
CREATE POLICY "admin_settings_admin_all"
  ON public.admin_settings
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));

-- =====================================================
-- Fix 8: leads_prevenda (dados sensíveis/PII)
-- Inserção via service_role (bypassa RLS) — formulários
-- externos ou integração com CRM usam service_role key.
-- Admins autenticados têm acesso total para visualizar.
-- =====================================================
CREATE POLICY "leads_prevenda_admin_all"
  ON public.leads_prevenda
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid() AND is_active = true
  ));
