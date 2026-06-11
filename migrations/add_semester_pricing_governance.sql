-- Semester pricing governance and operational metadata.
-- Safe to run multiple times.

ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS price_2o_semester numeric(10,2),
  ADD COLUMN IF NOT EXISTS manual_price_2o_semester numeric(10,2),
  ADD COLUMN IF NOT EXISTS price_display_overrides jsonb;

COMMENT ON COLUMN public.tours.price_2o_semester IS
  'Cached second-semester display price (synced from BTMS when not manual).';

COMMENT ON COLUMN public.tours.manual_price_2o_semester IS
  'Manual override for second semester display price.';
COMMENT ON COLUMN public.tours.price_display_overrides IS
  'Display metadata overrides by semester (labels, validity, ages).';

CREATE TABLE IF NOT EXISTS public.price_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  semester text NOT NULL CHECK (semester IN ('s1', 's2', 'all')),
  status text NOT NULL CHECK (status IN ('running', 'valid', 'error')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  started_by text,
  rows_loaded integer NOT NULL DEFAULT 0,
  tours_updated integer NOT NULL DEFAULT 0,
  errors jsonb,
  meta jsonb
);

CREATE INDEX IF NOT EXISTS idx_price_sync_runs_started_at
  ON public.price_sync_runs (started_at DESC);

INSERT INTO public.admin_settings (key, value, updated_at)
VALUES (
  'semester_split',
  '{"second_semester_start":"2026-07-01"}'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;
