"use server"

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Tour } from "@/types"

export type AdminSaveResult = {
  success: boolean
  error?: string
  /** Campos de 2º semestre não foram gravados — migração pendente no Supabase */
  governanceSkipped?: boolean
}

function formatDbError(error: PostgrestError): string {
  return error.message || error.code || "Erro desconhecido no banco"
}

function isMissingColumnError(error: PostgrestError): boolean {
  return (
    error.code === "PGRST204" ||
    /Could not find the '([^']+)' column/.test(error.message ?? "")
  )
}

function buildTourCoreRow(tour: Tour | Omit<Tour, "id">) {
  return {
    title: tour.title,
    description: tour.description,
    title_en: tour.title_en,
    description_en: tour.description_en,
    title_es: tour.title_es,
    description_es: tour.description_es,
    price: tour.price,
    duration: tour.duration,
    difficulty: tour.difficulty,
    category: tour.category,
    image: tour.image,
    gallery: tour.gallery,
    highlights: tour.highlights,
    included: tour.included,
    not_included: tour.notIncluded,
    requirements: tour.requirements,
    best_season: tour.bestSeason,
    max_group_size: tour.maxGroupSize,
    location: tour.location,
    slug: tour.slug,
    rating: tour.rating,
    reviews_count: tour.reviewsCount,
    preferred_price_atividade: tour.preferred_price_atividade,
    preferred_price_tabela: tour.preferred_price_tabela,
    preferred_baixa_tabela: tour.preferred_baixa_tabela ?? null,
    preferred_ms_tabela: tour.preferred_ms_tabela ?? null,
    preferred_bonitense_tabela: tour.preferred_bonitense_tabela ?? null,
    visible_prices: tour.visible_prices ?? null,
    btms_atrativo_override: tour.btms_atrativo_override ?? null,
    manual_price: tour.manual_price ?? null,
    price_2o_semester: tour.price_2o_semester ?? null,
    updated_at: new Date().toISOString(),
  }
}

function buildTourGovernanceRow(tour: Tour | Omit<Tour, "id">) {
  return {
    manual_price_2o_semester: tour.manual_price_2o_semester ?? null,
    price_display_overrides: tour.price_display_overrides ?? null,
  }
}

async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user?.email) {
    throw new Error("Sessão expirada. Faça login novamente.")
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", user.email)
    .eq("is_active", true)
    .single()

  if (adminError || !adminUser) {
    throw new Error("Usuário não autorizado para alterar passeios.")
  }
}

async function applyTourGovernanceFields(
  supabase: SupabaseClient,
  tourId: string,
  tour: Tour | Omit<Tour, "id">
): Promise<Pick<AdminSaveResult, "governanceSkipped">> {
  const { error } = await supabase
    .from("tours")
    .update(buildTourGovernanceRow(tour))
    .eq("id", tourId)

  if (!error) return {}

  if (isMissingColumnError(error)) {
    console.warn(
      "Colunas de governança de semestre ausentes em tours. Execute migrations/add_semester_pricing_governance.sql no Supabase.",
      error.message
    )
    return { governanceSkipped: true }
  }

  throw error
}

function revalidateTourPaths(slug?: string | null) {
  revalidatePath("/admin")
  revalidatePath("/admin/valor-futuro")
  revalidatePath("/")
  revalidatePath("/tarifario")
  revalidatePath("/tarifario-2o-semestre")
  if (slug) {
    revalidatePath(`/passeios/${slug}`)
  }
}

export async function createTour(tour: Omit<Tour, "id">): Promise<Tour | null> {
  const supabase = await createClient()
  try {
    await requireAdmin(supabase)

    const { data, error } = await supabase
      .from("tours")
      .insert(buildTourCoreRow(tour))
      .select()
      .single()

    if (error) {
      console.error("Error creating tour:", error)
      return null
    }

    try {
      await applyTourGovernanceFields(supabase, data.id, tour)
    } catch (govError) {
      console.error("Error applying tour governance fields:", govError)
      return null
    }

    revalidateTourPaths(data.slug)
    return data as Tour
  } catch (error) {
    console.error("Error in createTour:", error)
    return null
  }
}

export async function updateTour(tour: Tour): Promise<AdminSaveResult> {
  const supabase = await createClient()
  try {
    await requireAdmin(supabase)

    const { data, error } = await supabase
      .from("tours")
      .update(buildTourCoreRow(tour))
      .eq("id", tour.id)
      .select("id, slug")
      .maybeSingle()

    if (error) {
      console.error("Error updating tour:", error)
      return { success: false, error: formatDbError(error) }
    }

    if (!data) {
      return {
        success: false,
        error: "Passeio não encontrado ou alteração não permitida.",
      }
    }

    try {
      const { governanceSkipped } = await applyTourGovernanceFields(supabase, tour.id, tour)
      revalidateTourPaths(data.slug ?? tour.slug)
      return { success: true, governanceSkipped }
    } catch (govError) {
      const err = govError as PostgrestError
      console.error("Error updating tour governance fields:", govError)
      return { success: false, error: formatDbError(err) }
    }
  } catch (error) {
    console.error("Error in updateTour:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar passeio",
    }
  }
}

export async function deleteTour(tourId: string): Promise<boolean> {
  const supabase = await createClient()
  try {
    await requireAdmin(supabase)

    const { data: existing } = await supabase
      .from("tours")
      .select("slug")
      .eq("id", tourId)
      .maybeSingle()

    const { error } = await supabase.from("tours").delete().eq("id", tourId)

    if (error) {
      console.error("Error deleting tour:", error)
      return false
    }

    revalidateTourPaths(existing?.slug)
    return true
  } catch (error) {
    console.error("Error in deleteTour:", error)
    return false
  }
}
