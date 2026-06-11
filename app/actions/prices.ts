"use server"

import { createClient } from "@/lib/supabase/server"
import { getPricesByTourSlug, getAllPricesFromView, getAllDisplayRowsForAtrativo } from "@/services/supabase-prices"
import type { TourPriceRowDisplay } from "@/lib/supabase/price-columns"

export async function fetchTourPrices(
  slug: string,
  title: string,
  btmsAtativoOverride?: string,
  preferredAtividade?: string,
  preferredTabela?: string
) {
  const supabase = await createClient()
  try {
    const prices = await getPricesByTourSlug(
      slug, title, supabase,
      undefined,
      btmsAtativoOverride,
      preferredAtividade,
      preferredTabela
    )
    return { success: true, prices }
  } catch (error) {
    console.error("Error fetching tour prices:", error)
    return { success: false, error: "Failed to fetch prices" }
  }
}

/**
 * Retorna lista de atrativos únicos disponíveis na view atrativo_atividade_precos.
 * Usado no painel admin para o dropdown de vínculo manual.
 */
export async function fetchAvailableAtrativos(): Promise<{ success: boolean; atrativos?: string[]; error?: string }> {
  const supabase = await createClient()
  try {
    const rows = await getAllPricesFromView(supabase, false)
    const unique = Array.from(
      new Set(
        rows
          .map((r) => (r.atrativo ?? "").trim())
          .filter((a) => a.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b, "pt-BR"))
    return { success: true, atrativos: unique }
  } catch (error) {
    console.error("Error fetching atrativos:", error)
    return { success: false, error: "Failed to fetch atrativos" }
  }
}

/**
 * Retorna TODAS as linhas de preço da view para o atrativo informado,
 * sem filtros de correspondência de tour. Usado pelo painel admin
 * para selecionar qualquer valor do BTMS em cada célula.
 */
export async function fetchAllRowsForAtrativo(
  atrativo: string,
  preferNextSemester?: boolean
): Promise<{ success: boolean; rows?: TourPriceRowDisplay[]; error?: string }> {
  if (!atrativo || !atrativo.trim()) {
    return { success: false, error: "Atrativo não informado" }
  }
  const supabase = await createClient()
  try {
    const rows = await getAllDisplayRowsForAtrativo(atrativo.trim(), supabase, preferNextSemester)
    return { success: true, rows }
  } catch (error) {
    console.error("Error fetching rows for atrativo:", error)
    return { success: false, error: "Failed to fetch rows" }
  }
}
