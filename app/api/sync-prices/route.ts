import { NextResponse } from "next/server"
import { syncTourPrices } from "@/app/actions/sync-prices"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 })
    }
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .eq("is_active", true)
      .single()
    if (!adminUser) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 })
    }

    const result = await syncTourPrices()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}
