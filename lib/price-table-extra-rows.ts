import type { TourPriceInfo, TourPriceRowDisplay } from "@/lib/supabase/price-columns"

export const PRICE_EXTRA_ROW_PREFIX = "extra:"

export type PriceExtraPlacement = "after_baixa" | "after_alta" | "before_validity"
export type PriceExtraField =
  | "adulto"
  | "crianca"
  | "tarifaMs"
  | "garupaAdulto"
  | "garupaCrianca"

export interface PriceTableExtraRow {
  id: string
  semester: "s1" | "s2"
  placement: PriceExtraPlacement
  field: PriceExtraField
  tabela: string
  atividade: string
  label: string
  /** Valor manual digitado no painel. Quando definido (> 0), ignora tabela/atividade do BTMS. */
  manualValue?: number | null
}

export const PRICE_EXTRA_FIELD_OPTIONS: {
  id: PriceExtraField
  label: string
  getValue: (row: TourPriceRowDisplay) => number | null | undefined
}[] = [
  { id: "adulto", label: "Adulto (PAX)", getValue: (r) => r.adulto },
  { id: "crianca", label: "Criança (CHD)", getValue: (r) => r.crianca },
  { id: "tarifaMs", label: "Melhor idade (CRT)", getValue: (r) => r.tarifaMs },
  { id: "garupaAdulto", label: "Garupa adulto", getValue: (r) => r.garupaAdulto },
  { id: "garupaCrianca", label: "Garupa criança", getValue: (r) => r.garupaCrianca },
]

export const PRICE_EXTRA_PLACEMENT_OPTIONS: { id: PriceExtraPlacement; label: string }[] = [
  { id: "after_baixa", label: "Após Baixa Temporada" },
  { id: "after_alta", label: "Após Alta Temporada" },
  { id: "before_validity", label: "Antes da validade (rodapé)" },
]

export function encodeExtraRow(row: PriceTableExtraRow): string {
  return `${PRICE_EXTRA_ROW_PREFIX}${JSON.stringify(row)}`
}

export function parseExtraRow(entry: string): PriceTableExtraRow | null {
  if (!entry.startsWith(PRICE_EXTRA_ROW_PREFIX)) return null
  try {
    const parsed = JSON.parse(entry.slice(PRICE_EXTRA_ROW_PREFIX.length)) as PriceTableExtraRow
    if (!parsed?.id || !parsed.label) return null
    const hasManual = typeof parsed.manualValue === "number" && parsed.manualValue > 0
    if (!hasManual && (!parsed.tabela || !parsed.atividade)) return null
    return parsed
  } catch {
    return null
  }
}

export function listExtraRows(
  visiblePrices?: string[],
  semester?: "s1" | "s2"
): PriceTableExtraRow[] {
  if (!visiblePrices?.length) return []
  return visiblePrices
    .map(parseExtraRow)
    .filter((r): r is PriceTableExtraRow => r != null && (!semester || r.semester === semester))
}

export function isExtraRowEntry(entry: string): boolean {
  return entry.startsWith(PRICE_EXTRA_ROW_PREFIX)
}

/** Mantém entradas de preço padrão e substitui linhas extras do semestre indicado. */
export function setExtraRowsForSemester(
  visiblePrices: string[] | undefined,
  semester: "s1" | "s2",
  extraRows: PriceTableExtraRow[]
): string[] | undefined {
  const standard = (visiblePrices ?? []).filter((e) => !isExtraRowEntry(e))
  const otherSemester = listExtraRows(visiblePrices).filter((r) => r.semester !== semester)
  const encoded = [...otherSemester, ...extraRows].map(encodeExtraRow)
  const next = [...standard, ...encoded]
  return next.length === 0 ? undefined : next
}

export function resolveExtraRowValue(
  row: PriceTableExtraRow,
  prices: Pick<TourPriceInfo, "rows">
): number | null {
  // Valor manual tem prioridade absoluta
  if (row.manualValue != null && Number(row.manualValue) > 0) return Number(row.manualValue)
  const dbRow = prices.rows?.find(
    (r) => r.nomeTabela === row.tabela && r.atividade === row.atividade
  )
  if (!dbRow) return null
  const field = PRICE_EXTRA_FIELD_OPTIONS.find((f) => f.id === row.field)
  const val = field?.getValue(dbRow)
  return val != null && Number(val) > 0 ? Number(val) : null
}

export function newExtraRowId(): string {
  return `er_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}
