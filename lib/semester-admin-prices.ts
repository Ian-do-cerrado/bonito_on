import { isExtraRowEntry, listExtraRows, parseExtraRow, encodeExtraRow, newExtraRowId } from "@/lib/price-table-extra-rows"
import {
  buildSpecialKey,
  parseSpecialEntry,
  type SpecialSeason,
  type SpecialTariffId,
} from "@/lib/special-tariffs"
import type { Tour } from "@/types"

export type AdminSemester = "s1" | "s2"

export const STANDARD_CELL_KEYS = [
  "baixa:adulto",
  "baixa:crianca",
  "baixa:senior",
  "alta:adulto",
  "alta:crianca",
  "alta:senior",
  "ms",
  "bonitense",
] as const

export function scopedCellKey(ns: AdminSemester, cellKey: string): string {
  return `${ns}:${cellKey}`
}

export function allStandardScopedKeys(ns: AdminSemester): string[] {
  return STANDARD_CELL_KEYS.map((k) => scopedCellKey(ns, k))
}

const LEGACY_ROW_IDS = ["adulto", "crianca", "senior"] as const

/**
 * true quando há células baixa/alta explícitas (s1:baixa:adulto, baixa:adulto ou legado adulto/crianca/senior).
 * false quando visible_prices só tem ms/bonitense (formato legado) — nesse caso a tabela padrão BTMS fica visível.
 */
export function hasExplicitStandardSeasonCells(visiblePrices?: string[]): boolean {
  const vp = visiblePrices?.filter((v) => !isExtraRowEntry(v))
  if (!vp?.length) return false
  return vp.some((v) => {
    if (/^(s1|s2):(baixa|alta):/.test(v)) return true
    if (/^(baixa|alta):/.test(v)) return true
    return LEGACY_ROW_IDS.some((id) => v === id || v.startsWith(`${id}#`))
  })
}

function entryMatchesCell(v: string, ns: AdminSemester, cellKey: string): boolean {
  const scoped = scopedCellKey(ns, cellKey)
  if (v === scoped || v.startsWith(`${scoped}#`)) return true
  if (ns === "s1" && (v === cellKey || v.startsWith(`${cellKey}#`))) return true
  return false
}

/** Lê célula com herança s1→s2 quando não há override próprio do 2º semestre. */
export function findCellEntry(
  visiblePrices: string[] | undefined,
  ns: AdminSemester,
  cellKey: string
): string | undefined {
  const vp = visiblePrices?.filter((v) => !isExtraRowEntry(v))
  if (!vp?.length) return cellKey

  const scoped = scopedCellKey(ns, cellKey)
  const direct = vp.find((v) => v === scoped || v.startsWith(`${scoped}#`))
  if (direct) return direct

  if (ns === "s2") {
    const s1Scoped = scopedCellKey("s1", cellKey)
    const fromS1 = vp.find((v) => v === s1Scoped || v.startsWith(`${s1Scoped}#`))
    if (fromS1) return fromS1.replace(/^s1:/, "s2:")
    const legacy = vp.find((v) => v === cellKey || v.startsWith(`${cellKey}#`))
    if (legacy) return legacy.includes(":") ? legacy : `s2:${legacy}`
  }

  if (ns === "s1") {
    const directLegacy = vp.find((v) => v === cellKey || v.startsWith(`${cellKey}#`))
    if (directLegacy) return directLegacy
  }

  // Legacy: entradas planas ("adulto", "crianca") aplicam-se a baixa e alta.
  if (vp.some((v) => !v.includes(":"))) {
    const rowId = cellKey.includes(":") ? cellKey.split(":")[1]! : cellKey
    const leg = vp.find((v) => v === rowId || v.startsWith(`${rowId}#`))
    if (leg) return leg
  }

  return undefined
}

export function isCellVisible(
  visiblePrices: string[] | undefined,
  ns: AdminSemester,
  cellKey: string
): boolean {
  const vp = visiblePrices?.filter((v) => !isExtraRowEntry(v))
  if (!vp?.length) return true
  // Legado: só ms/bonitense configurados → tabela padrão baixa/alta continua visível
  if (
    (cellKey.startsWith("baixa:") || cellKey.startsWith("alta:")) &&
    !hasExplicitStandardSeasonCells(visiblePrices)
  ) {
    return true
  }
  return findCellEntry(visiblePrices, ns, cellKey) !== undefined
}

export function getCellOverride(
  visiblePrices: string[] | undefined,
  ns: AdminSemester,
  cellKey: string
): string {
  const entry = findCellEntry(visiblePrices, ns, cellKey)
  if (!entry) return "__auto__"
  const idx = entry.indexOf("#")
  return idx >= 0 ? entry.substring(idx + 1) : "__auto__"
}

export function setCellEntryInList(
  visiblePrices: string[] | undefined,
  ns: AdminSemester,
  cellKey: string,
  visible: boolean,
  override: string = "__auto__"
): string[] | undefined {
  const std = visiblePrices?.filter((v) => !isExtraRowEntry(v))
  const base = std?.length ? [...std] : [...allStandardScopedKeys(ns)]
  const filtered = base.filter((v) => !entryMatchesCell(v, ns, cellKey))
  if (!visible) {
    return filtered.length > 0 ? filtered : undefined
  }
  const scoped = scopedCellKey(ns, cellKey)
  const entry = override === "__auto__" ? scoped : `${scoped}#${override}`
  return [...filtered, entry]
}

/** Remove chaves padrão e linhas extras de um semestre, preservando o outro. */
export function stripSemesterVisiblePrices(
  visiblePrices: string[] | undefined,
  ns: AdminSemester
): string[] | undefined {
  if (!visiblePrices?.length) return undefined
  const filtered = visiblePrices.filter((v) => {
    if (isExtraRowEntry(v)) {
      const row = parseExtraRow(v)
      return row?.semester !== ns
    }
    if (v.startsWith(`${ns}:`)) return false
    if (ns === "s1" && !v.startsWith("s1:") && !v.startsWith("s2:")) {
      return !STANDARD_CELL_KEYS.some((k) => v === k || v.startsWith(`${k}#`))
    }
    return true
  })
  return filtered.length > 0 ? filtered : undefined
}

const SEASON_CELL_KEYS = STANDARD_CELL_KEYS.filter(
  (k): k is Exclude<(typeof STANDARD_CELL_KEYS)[number], "ms" | "bonitense"> =>
    k !== "ms" && k !== "bonitense"
)

/** Lê slot MS/Bonitense do 1º semestre (sem herança) para sincronização s1→s2. */
function readSpecialSlotForSync(
  visiblePrices: string[] | undefined,
  tariffId: SpecialTariffId,
  season: SpecialSeason
): { visible: boolean; override: string } {
  const vp = visiblePrices?.filter((v) => !isExtraRowEntry(v))
  if (!vp?.length) return { visible: false, override: "__auto__" }

  let seasonOverride: string | null | undefined = undefined
  let legacyOverride: string | null | undefined = undefined

  for (const v of vp) {
    const p = parseSpecialEntry(v, tariffId, "s1")
    if (p) {
      if (p.season === season) {
        seasonOverride = p.override
        break
      }
      if (p.season === null && legacyOverride === undefined) legacyOverride = p.override
      continue
    }
    if (!/^(s1|s2):/.test(v)) {
      const leg = parseSpecialEntry(v, tariffId, undefined)
      if (!leg) continue
      if (leg.season === season) {
        seasonOverride = leg.override
        break
      }
      if (leg.season === null && legacyOverride === undefined) legacyOverride = leg.override
    }
  }

  if (seasonOverride !== undefined) {
    return { visible: true, override: seasonOverride ?? "__auto__" }
  }
  if (legacyOverride !== undefined) {
    return { visible: true, override: legacyOverride ?? "__auto__" }
  }
  return { visible: false, override: "__auto__" }
}

/**
 * Copia a configuração efetiva do 1º semestre para entradas explícitas s2: em visible_prices.
 * Remove overrides s2 existentes antes de aplicar.
 */
export function syncVisiblePricesFromS1ToS2(visiblePrices?: string[]): string[] | undefined {
  const base = stripSemesterVisiblePrices(visiblePrices, "s2")
  const s2Entries: string[] = []

  for (const cellKey of SEASON_CELL_KEYS) {
    if (!isCellVisible(base, "s1", cellKey)) continue
    const override = getCellOverride(base, "s1", cellKey)
    const chunk = setCellEntryInList(undefined, "s2", cellKey, true, override)
    if (chunk) s2Entries.push(...chunk)
  }

  for (const tariffId of ["ms", "bonitense"] as const) {
    let addedSeasonSlot = false
    for (const season of ["alta", "baixa"] as const) {
      const slot = readSpecialSlotForSync(base, tariffId, season)
      if (!slot.visible) continue
      s2Entries.push(buildSpecialKey(tariffId, season, slot.override, "s2"))
      addedSeasonSlot = true
    }
    if (!addedSeasonSlot && isCellVisible(base, "s1", tariffId)) {
      const override = getCellOverride(base, "s1", tariffId)
      if (override !== "__auto__") {
        s2Entries.push(`${scopedCellKey("s2", tariffId)}#${override}`)
      } else {
        s2Entries.push(scopedCellKey("s2", tariffId))
      }
    }
  }

  const s1Extras = listExtraRows(base, "s1")
  const s2Extras = s1Extras.map((row) =>
    encodeExtraRow({ ...row, semester: "s2", id: newExtraRowId() })
  )

  const merged = [...(base ?? []), ...s2Entries, ...s2Extras]
  return merged.length > 0 ? merged : undefined
}

/** Aplica sync s1→s2 nos campos de preço de um passeio (sem alterar título, descrição, etc.). */
export function syncTourPricingS2FromS1(tour: Tour): Tour {
  const s1Display = tour.price_display_overrides?.s1
  return {
    ...tour,
    visible_prices: syncVisiblePricesFromS1ToS2(tour.visible_prices),
    manual_price_2o_semester: tour.manual_price ?? null,
    price_display_overrides: s1Display
      ? {
          ...(tour.price_display_overrides ?? {}),
          s2: { ...s1Display },
        }
      : tour.price_display_overrides,
  }
}
