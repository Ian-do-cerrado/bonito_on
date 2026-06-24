import type { TourPriceRowDisplay } from "@/lib/supabase/price-columns"

/** Tabela BTMS de baixa temporada (BT/BAIXA como palavra, não substring de BOTE). */
export function isBaixaTemporadaTable(nomeTabela: string, temporada?: string | null): boolean {
  const temp = (temporada ?? "").toUpperCase()
  if (temp === "BT" || temp === "BAIXA") return true
  if (temp === "AT" || temp === "ALTA") return false

  const upper = (nomeTabela ?? "").toUpperCase()
  if (/\bAT\b|\bALTA\b/i.test(upper) && !/\bBT\b|\bBAIXA\b/i.test(upper)) return false
  return /\bBT\b|\bBAIXA\b/i.test(upper)
}

/** Tabela BTMS de alta temporada (AT/ALTA como palavra). */
export function isAltaTemporadaTable(nomeTabela: string, temporada?: string | null): boolean {
  const temp = (temporada ?? "").toUpperCase()
  if (temp === "AT" || temp === "ALTA") return true
  if (temp === "BT" || temp === "BAIXA") return false

  const upper = (nomeTabela ?? "").toUpperCase()
  if (/\bBT\b|\bBAIXA\b/i.test(upper) && !/\bAT\b|\bALTA\b/i.test(upper)) return false
  return /\bAT\b|\bALTA\b/i.test(upper)
}

/** Tabelas BTMS nomeadas para o 2º semestre (ex.: "BOTE 2026 - 2 SEMESTRE AT"). */
export function isSecondSemesterTable(nomeTabela: string): boolean {
  return /2\s*º?\s*SEMESTRE|2\s*SEMESTRE/i.test(nomeTabela ?? "")
}

/**
 * Opções do picker admin: baixa mostra só BT; alta mostra só AT.
 * No 2º semestre, alta prioriza linhas "2 SEMESTRE" no topo.
 */
export function filterRowsForSeasonPicker(
  rows: TourPriceRowDisplay[],
  season: "baixa" | "alta",
  preferSecondSemesterAlta?: boolean
): TourPriceRowDisplay[] {
  const filtered = rows.filter((r) =>
    season === "baixa"
      ? isBaixaTemporadaTable(r.nomeTabela, r.temporada)
      : isAltaTemporadaTable(r.nomeTabela, r.temporada)
  )
  if (filtered.length === 0) return rows

  if (season === "alta" && preferSecondSemesterAlta) {
    const secondSem = filtered.filter((r) => isSecondSemesterTable(r.nomeTabela))
    const other = filtered.filter((r) => !isSecondSemesterTable(r.nomeTabela))
    return [...secondSem, ...other]
  }

  return filtered
}

/** No 2º semestre, prefere a variante "2 SEMESTRE AT" da mesma atividade. */
export function preferSecondSemesterAltaRow(
  row: TourPriceRowDisplay | null | undefined,
  displayRows: TourPriceRowDisplay[]
): TourPriceRowDisplay | null | undefined {
  if (!row) return row

  const upgrade = displayRows.find(
    (r) =>
      r.atividade === row.atividade &&
      isAltaTemporadaTable(r.nomeTabela, r.temporada) &&
      isSecondSemesterTable(r.nomeTabela) &&
      (r.adulto ?? r.garupaAdulto ?? 0) > 0
  )

  return upgrade ?? row
}
