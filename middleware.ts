import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Cache em memória do modo manutenção, compartilhado entre requisições que
// caem na mesma instância de edge. Evita consultar o Supabase a cada request
// (raiz do consumo excessivo de Fluid Active CPU: antes disso, TODA página do
// site batia no banco 1-2x por visita só para checar manutenção/admin).
const MAINTENANCE_CACHE_TTL_MS = 30_000
let maintenanceCache: { value: boolean; expiresAt: number } | null = null

function makeSupabaseClient(request: NextRequest, supabaseResponse: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )
}

async function checkIsAdmin(supabase: ReturnType<typeof makeSupabaseClient>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .eq("is_active", true)
      .single()

    return !!adminUser
  } catch (err) {
    console.error("Erro ao verificar admin no middleware:", err)
    return false
  }
}

async function getMaintenanceMode(supabase: ReturnType<typeof makeSupabaseClient>): Promise<boolean> {
  if (maintenanceCache && maintenanceCache.expiresAt > Date.now()) {
    return maintenanceCache.value
  }

  let value = false
  try {
    const { data } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single()
    value = data?.value === "true"
  } catch (err) {
    console.error("Erro ao verificar modo manutenção no middleware:", err)
  }

  maintenanceCache = { value, expiresAt: Date.now() + MAINTENANCE_CACHE_TTL_MS }
  return value
}

export async function middleware(request: NextRequest) {
  // Não aplicar middleware para a página de login
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  const supabaseResponse = NextResponse.next({
    request,
  })

  // Rotas /admin sempre precisam checar autenticação — sem cache, pois
  // controla acesso a dados sensíveis.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const supabase = makeSupabaseClient(request, supabaseResponse)
    const isAdmin = await checkIsAdmin(supabase)
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Rotas públicas: no caso comum (manutenção desligada), isso não faz
  // nenhuma chamada ao Supabase — só lê o cache em memória.
  const supabase = makeSupabaseClient(request, supabaseResponse)
  const isMaintenanceMode = await getMaintenanceMode(supabase)

  if (isMaintenanceMode && request.nextUrl.pathname !== "/manutencao") {
    // Só verifica se é admin (chamada extra ao Supabase) quando o site
    // está de fato em manutenção — caso raro.
    const isAdmin = await checkIsAdmin(supabase)
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/manutencao"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}
