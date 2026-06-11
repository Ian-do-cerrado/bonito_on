import type { Tour } from "@/services/supabase-tours"
import { parseManualOverride } from "@/lib/price-overrides"

/**
 * Retorna o preço principal a ser exibido nos tour cards e na página do passeio.
 *
 * Prioridade:
 *  -1. Preço manual (tour.manual_price) — override absoluto definido pelo admin
 *   0. Override granular de célula: visible_prices["alta:adulto#tabela#atividade"]
 *   1. Atividade fixada manualmente pelo admin (preferred_price_atividade)
 *   2. Lógica automática BTMS ao vivo (mainPriceRow / precoMinimo)
 *   3. Preço fixo manual (tour.price) — usado apenas quando não há dados BTMS
 */
export function getDisplayPrice(
  tour: Tour, 
  priceLogic: 'main_activity' | 'min_price' = 'main_activity',
  preferNextSemester?: boolean
): number {
  // -1. Override manual absoluto — definido pelo admin no painel
  if (preferNextSemester) {
    if (tour.manual_price_2o_semester != null && tour.manual_price_2o_semester > 0) return tour.manual_price_2o_semester
    if (tour.price_2o_semester != null && tour.price_2o_semester > 0) return tour.price_2o_semester
  } else {
    if (tour.manual_price != null && tour.manual_price > 0) return tour.manual_price
  }

  // 0. Override granular de célula para cards/detalhe:
  //  - 2º semestre: "s2:alta:adulto" (novo) e fallback para "alta:adulto" (legado)
  //  - 1º semestre: "s1:alta:adulto" (novo) e fallback para "alta:adulto" (legado)
  const overrideKeys = preferNextSemester
    ? ["s2:alta:adulto", "s1:alta:adulto", "alta:adulto"]
    : ["s1:alta:adulto", "alta:adulto"]
  const resolvedOverride = resolveVisiblePriceOverrideByKeys(tour, overrideKeys)
  if (resolvedOverride != null && resolvedOverride > 0) return resolvedOverride

  // 1. Prioridade Absoluta: Atividade selecionada manualmente pelo administrador
  if (tour.preferred_price_atividade && tour.prices?.rows) {
    const preferred = tour.prices.rows.find((r: any) =>
      r.atividade === tour.preferred_price_atividade &&
      (!tour.preferred_price_tabela || r.nomeTabela === tour.preferred_price_tabela)
    )
    if (preferred) {
      const price = preferred.adulto ?? preferred.garupaAdulto
      if (price != null && price > 0) return price
    }
  }

  // 2. Lógica automática BTMS ao vivo — tem prioridade sobre tour.price legado
  if (tour.prices) {
    if (priceLogic === 'min_price') {
      const min = tour.prices.precoMinimo
      if (min != null && min > 0) return min
    }

    // Match ideal: atividade principal da tabela
    const main = tour.prices.mainPriceRow
    if (main) {
      const adulto = main.adulto ?? main.garupaAdulto
      if (adulto != null && adulto > 0) return adulto
    }

    // Preço mínimo da tabela como fallback
    if (tour.prices.precoMinimo > 0) return tour.prices.precoMinimo
  }

  // 3. Preço fixo manual (tour.price) — só alcançado quando não há dados BTMS
  if (tour.price && tour.price > 0) return tour.price

  return 0
}

/**
 * Resolve o valor de adulto de um override granular em visible_prices.
 * Ex: "alta:adulto#TABELA AT 2026#Contemplação" → busca o adulto nessa linha.
 * Retorna null se não houver override com "#".
 */
export function resolveVisiblePriceOverride(tour: Tour, cellKey: string): number | null {
  return resolveVisiblePriceOverrideByKeys(tour, [cellKey])
}

function resolveVisiblePriceOverrideByKeys(tour: Tour, cellKeys: string[]): number | null {
  const vp = tour.visible_prices
  if (!vp || !tour.prices?.rows) return null
  // Prioriza por ordem das chaves (ex.: s2 antes de s1 antes do legado)
  let entry: string | undefined
  for (const key of cellKeys) {
    entry = vp.find((v) => v === key || v.startsWith(key + "#"))
    if (entry) break
  }
  if (!entry || !entry.includes("#")) return null
  const override = entry.substring(entry.indexOf("#") + 1) // "tabela#atividade" ou "__manual__#valor"
  const manual = parseManualOverride(override)
  if (manual != null) return manual
  const sepIdx = override.indexOf("#")
  if (sepIdx < 0) return null
  const tabela = override.substring(0, sepIdx)
  const atividade = override.substring(sepIdx + 1)
  const row = (tour.prices.rows as any[]).find(r => r.nomeTabela === tabela && r.atividade === atividade)
  const val = row?.adulto ?? row?.garupaAdulto
  return (val != null && Number(val) > 0) ? Number(val) : null
}

/**
 * Retorna o preço principal resolvido (com override) ou null se não disponível.
 */
export function getMainDisplayPrice(
  tour: Tour, 
  priceLogic: 'main_activity' | 'min_price' = 'main_activity',
  preferNextSemester?: boolean
): number | null {
  const price = getDisplayPrice(tour, priceLogic, preferNextSemester)
  return price > 0 ? price : null
}
