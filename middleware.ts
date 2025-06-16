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

  // Verificar se a rota é protegida
  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      // Se não há usuário autenticado, redirecionar para login
      if (userError || !user) {
        console.log("No user found, redirecting to login")
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        return NextResponse.redirect(url)
      }

      // Verificar se o usuário é admin válido
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", user.email)
        .eq("is_active", true)
        .single()

      if (adminError || !adminUser) {
        console.log("User is not admin, redirecting to login")
        // Fazer logout e redirecionar para login
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        return NextResponse.redirect(url)
      }

      console.log("User is authenticated admin, allowing access")
      return supabaseResponse
    } catch (error) {
      console.error("Error in middleware:", error)
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*"],
}
