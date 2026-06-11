-- Script para inicializar as configurações do administrador
-- Execute este script no SQL Editor do seu projeto Supabase

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insere o registro para a última sincronização de preços se não existir
INSERT INTO admin_settings (key, value) 
VALUES ('last_prices_sync_at', 'null'::jsonb) 
ON CONFLICT (key) DO NOTHING;
