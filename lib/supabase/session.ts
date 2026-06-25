import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/** Cliente com sessão do usuário (anon key + cookies) — para auth e checagem de admin. */
export async function createSessionClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Component — ignorar
          }
        },
      },
    }
  )
}
