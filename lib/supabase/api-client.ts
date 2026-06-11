import { createClient } from "@supabase/supabase-js"

/** Cliente Supabase para uso em API routes (server-side). Evita problemas do createBrowserClient no cliente. */
export function createApiClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
