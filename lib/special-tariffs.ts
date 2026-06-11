import type { TourPriceRowDisplay } from "@/lib/supabase/price-columns"
import { isExtraRowEntry } from "@/lib/price-table-extra-rows"
import { parseManualOverride } from "@/lib/price-overrides"

export type SpecialSeason = "alta" | "baixa"
export type SpecialTariffId = "ms" | "bonitense"

type PricesLike = {
  rows?: any[]
  msRow?: TourPriceRowDisplay | null
  bonitenseRow?: TourPriceRowDisplay | null
}

/**
 * Faz o parsing de uma entrada de tarifa especial (ms/bonitense) em visible_prices.
 * Formatos suportados (prefixo opcional s1:/s2:, temporada opcional :alta/:baixa e
 * override opcional #tabela#atividade):
 *   ms | ms:alta | ms:baixa | ms#tab#ativ | s1:ms:alta#tab#ativ | bonitense:baixa ...
 * Retorna null se a entrada não pertencer a esta tarifa/semestre.
 */
export function parseSpecialEntry(
  v: string,
  rowId: SpecialTariffId,
  semesterNamespace?: "s1" | "s2"
): { season: SpecialSeason | null; override: string | null } | null {
  let s = v
  const ns = /^(s1|s2):/.exec(s)
  if (ns) {
    if (!semesterNamespace || ns[1] !== semesterNamespace) return null
    s = s.substring(3)
  }
  if (s !== rowId && !s.startsWith(rowId + ":") && !s.startsWith(rowId + "#")) return null
  let rest = s.substring(rowId.length)
  let season: SpecialSeason | null = null
  if (rest.startsWith(":alta")) {
    season = "alta"
    rest = rest.substring(":alta".length)
  } else if (rest.startsWith(":baixa")) {
    season = "baixa"
    rest = rest.substring(":baixa".length)
  }
  let override: string | null = null
  if (rest.startsWith("#")) override = rest.substring(1)
  else if (rest !== "") return null
  return { season, override }
}

/** Infere a temporada de uma tarifa especial a partir da linha de preço (temporada / nome da tabela). */
export function inferSpecialSeason(row: TourPriceRowDisplay): SpecialSeason {
  const temporada = (row.temporada ?? "").toUpperCase()
  if (temporada === "ALTA") return "alta"
  if (temporada === "BAIXA") return "baixa"
  const tabela = (row.nomeTabela ?? "").toUpperCase()
  if (tabela.includes("ALTA") || /\bAT\b/.test(tabela)) return "alta"
  return "baixa"
}

/** Monta a chave de visible_prices para uma tarifa especial (sempre namespaced em s1). */
export function buildSpecialKey(
  rowId: SpecialTariffId,
  season: SpecialSeason | "__auto__",
  override: string
): string {
  let key = `s1:${rowId}`
  if (season !== "__auto__") key += `:${season}`
  if (override !== "__auto__") key += `#${override}`
  return key
}

/** Resolve a linha (TourPriceRowDisplay) a partir de um override "tabela#atividade" ou da linha auto. */
export function resolveSpecialRowFromOverride(
  override: string | null,
  rowId: SpecialTariffId,
  prices: PricesLike
): TourPriceRowDisplay | null {
  if (override) {
    const manual = parseManualOverride(override)
    if (manual != null) return makeManualRow(manual)
    const sepIdx = override.indexOf("#")
    if (sepIdx < 0) return null
    const tabela = override.substring(0, sepIdx)
    const atividade = override.substring(sepIdx + 1)
    return (
      (prices.rows?.find(
        (r: any) => r.nomeTabela === tabela && r.atividade === atividade
      ) as TourPriceRowDisplay | undefined) ?? null
    )
  }
  return (rowId === "ms" ? prices.msRow : prices.bonitenseRow) ?? null
}

/** Linha sintética para um valor manual de tarifa especial. */
function makeManualRow(value: number): TourPriceRowDisplay {
  return {
    vigInicio: "",
    vigFim: "",
    nomeTabela: "",
    atrativo: "",
    atividade: "",
    nomeTabelaAmigavel: "",
    temporada: null,
    isNormal: true,
    adulto: value,
    crianca: null,
    tarifaMs: null,
    atividadeAmigavel: "",
  }
}

function standardVp(visiblePrices: string[] | undefined): string[] | undefined {
  if (!visiblePrices?.length) return undefined
  const std = visiblePrices.filter((v) => !isExtraRowEntry(v))
  return std.length > 0 ? std : undefined
}

/**
 * Resolve a linha de uma tarifa especial (ms/bonitense) para UMA temporada específica.
 * Permite que MS/Bonitense tenham um valor de Alta e outro de Baixa simultaneamente.
 * Retorna null quando não há valor configurado para aquela temporada.
 */
export function resolveSpecialForSeason(
  rowId: SpecialTariffId,
  season: SpecialSeason,
  visiblePrices: string[] | undefined,
  prices: PricesLike,
  semesterNamespace?: "s1" | "s2"
): TourPriceRowDisplay | null {
  const vp = standardVp(visiblePrices)
  // Sem visible_prices = tudo visível (automático). A linha auto aparece só na temporada inferida.
  if (!vp) {
    const row = rowId === "ms" ? prices.msRow : prices.bonitenseRow
    if (!row) return null
    return inferSpecialSeason(row) === season ? row : null
  }

  // Prioridade de namespace: o do semestre e, para s2, herda s1 quando não houver config própria.
  const namespaces: ("s1" | "s2" | undefined)[] =
    semesterNamespace === "s2" ? ["s2", "s1"] : [semesterNamespace]

  for (const ns of namespaces) {
    let seasonOverride: string | null | undefined = undefined
    let legacyOverride: string | null | undefined = undefined
    for (const v of vp) {
      const p = parseSpecialEntry(v, rowId, ns)
      if (!p) continue
      if (p.season === season) {
        seasonOverride = p.override
        break
      }
      if (p.season === null && legacyOverride === undefined) {
        legacyOverride = p.override
      }
    }
    if (seasonOverride !== undefined) {
      return resolveSpecialRowFromOverride(seasonOverride, rowId, prices)
    }
    // Entrada legada sem temporada aplica-se apenas à temporada inferida da linha resolvida.
    if (legacyOverride !== undefined) {
      const row = resolveSpecialRowFromOverride(legacyOverride, rowId, prices)
      if (row && inferSpecialSeason(row) === season) return row
    }
  }
  return null
}
