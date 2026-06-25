import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase com service role — bypassa RLS.
 * Usar apenas em server actions/API após validar permissão do admin.
 * Não vincular cookies de sessão (evita que o JWT do usuário substitua o service role).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Supabase service role não configurado (URL ou SUPABASE_SERVICE_ROLE_KEY).")
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
