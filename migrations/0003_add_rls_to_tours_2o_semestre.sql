-- Habilita a Row Level Security para a tabela tours_2o_semestre
ALTER TABLE public.tours_2o_semestre ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas, se existirem, para evitar conflitos
DROP POLICY IF EXISTS "Allow authenticated users to select tours" ON public.tours_2o_semestre;
DROP POLICY IF EXISTS "Allow authenticated users to insert tours" ON public.tours_2o_semestre;
DROP POLICY IF EXISTS "Allow authenticated users to update tours" ON public.tours_2o_semestre;
DROP POLICY IF EXISTS "Allow authenticated users to delete tours" ON public.tours_2o_semestre;

-- Cria a política para SELECT
CREATE POLICY "Allow authenticated users to select tours"
ON public.tours_2o_semestre
FOR SELECT
TO authenticated
USING (true);

-- Cria a política para INSERT
CREATE POLICY "Allow authenticated users to insert tours"
ON public.tours_2o_semestre
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Cria a política para UPDATE
CREATE POLICY "Allow authenticated users to update tours"
ON public.tours_2o_semestre
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Cria a política para DELETE
CREATE POLICY "Allow authenticated users to delete tours"
ON public.tours_2o_semestre
FOR DELETE
TO authenticated
USING (true);