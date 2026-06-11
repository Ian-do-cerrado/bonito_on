"use server"

import { createClient } from "@/lib/supabase/server"
import { getAllPricesFromView, getPricesForTours } from "@/services/supabase-prices"
import { createSlug } from "@/lib/utils"
import { cleanDescriptionPrices } from "@/lib/description-cleaner"
import { getInitialValueType, getSemesterSplitDate } from "./settings"

export interface SyncPricesResult {
  success: boolean
  updated: number
  total: number
  descriptionsCleaned: number
  errors?: string[]
}

export async function syncTourPrices(): Promise<SyncPricesResult> {
  const errors: string[] = []
  let updated = 0
  let descriptionsCleaned = 0
  let runId: string | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return { success: false, updated: 0, total: 0, descriptionsCleaned: 0, errors: ["Usuário não autenticado"] }
    }
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .eq("is_active", true)
      .single()
    if (!adminUser) {
      return { success: false, updated: 0, total: 0, descriptionsCleaned: 0, errors: ["Usuário sem permissão de administrador"] }
    }

    const { data: run } = await supabase
      .from("price_sync_runs")
      .insert({
        semester: "all",
        status: "running",
        started_by: user.email,
      })
      .select("id")
      .single()
    runId = run?.id ?? null

    const splitDate = await getSemesterSplitDate()
    const { error: refreshError } = await supabase.rpc("refresh_btms_semester_tables", { split_date: splitDate })
    if (refreshError) {
      errors.push(`Não foi possível atualizar tabelas semestrais: ${refreshError.message}`)
    }

    const [{ data: tours, error }, priceLogic] = await Promise.all([
      supabase.from("tours").select("id, title, slug, description, price, price_2o_semester, preferred_price_atividade, preferred_price_tabela, preferred_baixa_tabela, preferred_ms_tabela, preferred_bonitense_tabela, btms_atrativo_override, manual_price, manual_price_2o_semester, visible_prices"),
      getInitialValueType()
    ])

    if (error || !tours) {
      return {
        success: false,
        updated: 0,
        total: 0,
        descriptionsCleaned: 0,
        errors: [`Erro ao buscar tours: ${error?.message || "Sem dados"}`],
      }
    }

    // Importar utilitário de preço (importação dinâmica para evitar loops de dependência se houver)
    const { getDisplayPrice } = await import("@/lib/tour-price-utils")

    const total = tours.length
    
    // Obter todos os preços de uma vez usando a lógica completa do site
    const tourInputs = tours.map(t => ({ 
      slug: t.slug || createSlug(t.title), 
      title: t.title,
      btmsAtativoOverride: t.btms_atrativo_override ?? undefined,
      preferredAtividade: t.preferred_price_atividade ?? undefined,
      preferredTabela: t.preferred_price_tabela ?? undefined,
      preferredBaixaTabela: t.preferred_baixa_tabela ?? undefined,
      preferredMsTabela: t.preferred_ms_tabela ?? undefined,
      preferredBonitenseTabela: t.preferred_bonitense_tabela ?? undefined,
      visiblePrices: t.visible_prices ?? undefined,
    }))
    
    const [priceMap, priceMap2o] = await Promise.all([
      getPricesForTours(tourInputs, supabase, undefined, false),
      getPricesForTours(tourInputs, supabase, undefined, true),
      getAllPricesFromView(supabase, false),
      getAllPricesFromView(supabase, true),
    ])

    for (const tour of tours) {
      const slug = tour.slug || createSlug(tour.title)
      const prices = priceMap.get(slug)

      // Pular tours com preço manual S1 — admin definiu o valor manualmente
      if (tour.manual_price != null && tour.manual_price > 0) {
        // Ainda limpa descrições mesmo com preço manual
        const cleaned = cleanDescriptionPrices(tour.description ?? "")
        if (cleaned !== (tour.description ?? "")) {
          const { error: updateError } = await supabase
            .from("tours")
            .update({ description: cleaned })
            .eq("id", tour.id)
          if (!updateError) {
            descriptionsCleaned++
            updated++
          }
        }
        continue
      }

      const updates: { price?: number; price_2o_semester?: number | null; description?: string } = {}

      if (prices) {
        const tourForDisplay = { ...tour, prices } as any

        /**
         * Regras do sync:
         *
         * 1. Se o admin fixou uma atividade preferida (preferred_price_atividade),
         *    usa SEMPRE o valor ao vivo dessa atividade na tabela BTMS —
         *    independente do priceLogic global (min_price ou main_activity).
         *
         * 2. Se não há pino manual, aplica o priceLogic global:
         *    - main_activity → atividade principal calculada automaticamente
         *    - min_price     → menor preço da tabela
         *
         * O campo preferred_price_atividade NUNCA é alterado pelo sync.
         */
        const effectivePriceLogic = tour.preferred_price_atividade
          ? 'main_activity'   // garante que getDisplayPrice use o pino (etapa 1) e não desvie para min_price
          : priceLogic

        const targetPrice = getDisplayPrice({ ...tourForDisplay, price: 0 }, effectivePriceLogic)

        if (targetPrice > 0 && targetPrice !== tour.price) {
          updates.price = targetPrice
        }

        // 2o Semestre
        const prices2o = priceMap2o.get(slug)
        if (prices2o) {
          const tourForDisplay2o = {
            ...tour,
            prices: prices2o,
            price_2o_semester: null,
            manual_price: null
          } as any

          const targetPrice2o = getDisplayPrice(tourForDisplay2o, effectivePriceLogic, true)

          if ((tour.manual_price_2o_semester == null || tour.manual_price_2o_semester <= 0) && targetPrice2o > 0 && targetPrice2o !== tour.price_2o_semester) {
            updates.price_2o_semester = targetPrice2o
          }
        }
      }

      const cleaned = cleanDescriptionPrices(tour.description ?? "")
      if (cleaned !== (tour.description ?? "")) {
        updates.description = cleaned
        descriptionsCleaned++
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("tours")
          .update(updates)
          .eq("id", tour.id)

        if (updateError) {
          errors.push(`${tour.title}: ${updateError.message}`)
        } else {
          updated++
        }
      }
    }

    // Salvar data da última sincronização
    try {
      const now = new Date().toISOString()
      await Promise.all([
        supabase
        .from("admin_settings")
        .upsert({ key: "last_prices_sync_at", value: now, updated_at: now }),
        supabase
          .from("admin_settings")
          .upsert({ key: "last_prices_sync_s1_at", value: now, updated_at: now }),
        supabase
          .from("admin_settings")
          .upsert({ key: "last_prices_sync_s2_at", value: now, updated_at: now }),
      ])
    } catch (e) {
      console.error("Erro ao salvar timestamp de sincronização:", e)
    }

    if (runId) {
      await supabase
        .from("price_sync_runs")
        .update({
          status: errors.length > 0 ? "error" : "valid",
          finished_at: new Date().toISOString(),
          tours_updated: updated,
          errors: errors.length > 0 ? errors : null,
        })
        .eq("id", runId)
    }

    return { success: true, updated, total, descriptionsCleaned, errors: errors.length > 0 ? errors : undefined }
  } catch (err) {
    if (runId) {
      const supabase = await createClient()
      await supabase
        .from("price_sync_runs")
        .update({
          status: "error",
          finished_at: new Date().toISOString(),
          tours_updated: updated,
          errors: [err instanceof Error ? err.message : "Erro desconhecido"],
        })
        .eq("id", runId)
    }
    return {
      success: false,
      updated,
      total: 0,
      descriptionsCleaned: 0,
      errors: [err instanceof Error ? err.message : "Erro desconhecido"],
    }
  }
}
