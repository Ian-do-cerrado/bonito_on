import { isExtraRowEntry, listExtraRows, parseExtraRow } from "@/lib/price-table-extra-rows"

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
