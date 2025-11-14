"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error:
        error.message === "Invalid login credentials"
          ? "Email ou senha incorretos"
          : "Erro ao fazer login. Tente novamente.",
    }
  }

  if (!data.user) {
    return {
      success: false,
      error: "Erro ao fazer login. Tente novamente.",
    }
  }

  // Verificar se é um admin válido
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", data.user.id) // Usar o ID do usuário para a verificação
    .eq("is_active", true)
    .single()

  if (adminError || !adminUser) {
    console.error("Admin check error:", adminError)
    await supabase.auth.signOut()
    return {
      success: false,
      error: "Usuário não autorizado para acessar o painel administrativo",
    }
  }

  // Atualizar último login
  await supabase
    .from("admin_users")
    .update({
      last_login: new Date().toISOString(),
    })
    .eq("id", data.user.id)

  console.log("Login successful, redirecting to admin")
  revalidatePath("/admin")

  // Retornar sucesso e fazer redirect separadamente
  return { success: true }
}

export async function redirectToAdmin() {
  redirect("/admin")
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: "Erro ao fazer logout" }
  }

  revalidatePath("/admin")
  redirect("/admin/login")
}

export async function getCurrentUser() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Verificar se é admin válido
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .eq("is_active", true)
      .single()

    if (!adminUser) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      lastLogin: adminUser.last_login,
    }
  } catch (error) {
    console.error("Erro ao obter usuário:", error)
    return null
  }
}
