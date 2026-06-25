-- =====================================================
-- Políticas de Storage para o bucket tour-images
-- Execute no SQL Editor do Supabase se uploads falharem com RLS
-- =====================================================
-- O painel admin usa service role no servidor; estas políticas
-- permitem também upload autenticado como fallback.

-- Leitura pública
DROP POLICY IF EXISTS "Public read tour-images" ON storage.objects;
CREATE POLICY "Public read tour-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tour-images');

-- Upload / update / delete para usuários autenticados (admin logado)
DROP POLICY IF EXISTS "Authenticated insert tour-images" ON storage.objects;
CREATE POLICY "Authenticated insert tour-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tour-images');

DROP POLICY IF EXISTS "Authenticated update tour-images" ON storage.objects;
CREATE POLICY "Authenticated update tour-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tour-images');

DROP POLICY IF EXISTS "Authenticated delete tour-images" ON storage.objects;
CREATE POLICY "Authenticated delete tour-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tour-images');
