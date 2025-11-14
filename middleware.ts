import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
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

  // Verificar se a rota é protegida (todas as rotas /admin exceto /admin/login)
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
        .eq("id", user.id) // Usar o ID do usuário para a verificação
        .eq("is_active", true)
        .single()

      if (adminError || !adminUser) {
        console.log("User is not an authorized admin, redirecting to login")
        // Fazer logout para limpar a sessão inválida e redirecionar
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        return NextResponse.redirect(url)
      }

      // Se o usuário for um admin autenticado, permitir o acesso
      return supabaseResponse
    } catch (error) {
      console.error("Error in middleware:", error)
      // Em caso de erro, redirecionar para a página de login como fallback
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Para rotas não protegidas ou a página de login, apenas continuar
  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*"],
}
