import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Não aplicar middleware para a página de login
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
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

  // VARIÁVEL DE ESTADO DE ADMIN E MANUTENÇÃO
  let isAdmin = false
  let isMaintenanceMode = false

  try {
    // 1. Buscar status do modo manutenção no banco de dados (admin_settings)
    const { data: maintenanceSetting } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single()
    
    isMaintenanceMode = maintenanceSetting?.value === "true"

    // 2. Verificar se o usuário atual é um admin autenticado
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", user.email)
        .eq("is_active", true)
        .single()
      
      if (adminUser) {
        isAdmin = true
      }
    }
  } catch (err) {
    console.error("Erro ao verificar status no middleware:", err)
  }

  // Verificar se a rota é protegida (/admin)
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!isAdmin) {
      console.log("No admin access, redirecting to login")
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // LÓGICA DE MANUTENÇÃO: Ignorada se o usuário for Admin ou estiver na página de login do admin
  if (isMaintenanceMode && !isAdmin) {
    const isExcludedPath = 
      request.nextUrl.pathname.startsWith("/admin") || 
      request.nextUrl.pathname === "/manutencao"
    
    if (!isExcludedPath) {
      console.log("Site is in maintenance mode, redirecting to /manutencao")
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
