"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

function asSettingString(value: unknown): string | null {
  if (typeof value === "string") return value
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>
    if (typeof obj.value === "string") return obj.value
  }
  return null
}

function parseSemesterSplitDate(value: unknown): string | null {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>
    if (typeof obj.second_semester_start === "string") return obj.second_semester_start
    if (typeof obj.secondSemesterStart === "string") return obj.secondSemesterStart
  }
  const str = asSettingString(value)
  if (str && /^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  return null
}

export async function getMaintenanceMode(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single()

    if (error || !data) return false
    return data.value === "true"
  } catch (err) {
    console.error("Erro ao buscar modo manutenção:", err)
    return false
  }
}

export async function setMaintenanceMode(enabled: boolean): Promise<boolean> {
  try {
    const supabase = await createClient()
    const value = enabled ? "true" : "false"
    const now = new Date().toISOString()

    const { error } = await supabase
      .from("admin_settings")
      .upsert({ 
        key: "maintenance_mode", 
        value, 
        updated_at: now 
      }, { onConflict: "key" })

    if (error) throw error
    
    revalidatePath("/")
    revalidatePath("/admin")
    return true
  } catch (err) {
    console.error("Erro ao salvar modo manutenção:", err)
    return false
  }
}

export async function getInitialValueType(): Promise<'main_activity' | 'min_price'> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "initial_value_type")
      .single()

    if (error || !data) return 'main_activity'
    return data.value as 'main_activity' | 'min_price'
  } catch (err) {
    console.error("Erro ao buscar tipo de valor inicial:", err)
    return 'main_activity'
  }
}

export async function getLastPricesSyncAt(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "last_prices_sync_at")
      .single()

    if (error || !data) return null
    return data.value
  } catch (err) {
    console.error("Erro ao buscar data de sincronização:", err)
    return null
  }
}

export async function getSemesterSplitDate(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "semester_split")
      .single()

    if (error || !data) return "2027-01-01"
    return parseSemesterSplitDate(data.value) ?? "2027-01-01"
  } catch (err) {
    console.error("Erro ao buscar data de corte do semestre:", err)
    return "2027-01-01"
  }
}

export async function setInitialValueType(type: 'main_activity' | 'min_price'): Promise<boolean> {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from("admin_settings")
      .upsert({ 
        key: "initial_value_type", 
        value: type, 
        updated_at: now 
      }, { onConflict: "key" })

    if (error) throw error
    
    revalidatePath("/")
    revalidatePath("/admin")
    return true
  } catch (err) {
    console.error("Erro ao salvar tipo de valor inicial:", err)
    return false
  }
}
