"use client"

import { Button } from "@/components/ui/button"
import type { TourPriceInfo, TourPriceRowDisplay } from "@/lib/supabase/price-columns"
import {
  isExtraRowEntry,
  listExtraRows,
  resolveExtraRowValue,
  type PriceExtraPlacement,
  type PriceTableExtraRow,
} from "@/lib/price-table-extra-rows"
import { resolveSpecialForSeason } from "@/lib/special-tariffs"
import { parseManualOverride } from "@/lib/price-overrides"
import { resolveChildAgeLabel } from "@/lib/resolve-child-age"
import { formatInfantFreeLabel, resolveInfantFree } from "@/lib/tour-infant-free"

function standardVisiblePrices(visiblePrices?: string[]): string[] | undefined {
  if (!visiblePrices?.length) return visiblePrices
  const standard = visiblePrices.filter((v) => !isExtraRowEntry(v))
  return standard.length > 0 ? standard : undefined
}

type SemesterOverrides = {
  validityEnd?: string
  labels?: Partial<Record<"adulto" | "crianca" | "senior" | "ms" | "bonitense", string>>
  ages?: {
    childMin?: number
    childMax?: number | null
    seniorMin?: number
  }
}

interface TourPricesSidebarProps {
  prices: TourPriceInfo
  onReserve?: () => void
  /** Categorias visíveis. undefined ou vazio = todas. Suporta formato "baixa:adulto", "alta:crianca" ou legacy "adulto" */
  visiblePrices?: string[]
  /** Duração do passeio, ex: "Meio dia", "Dia inteiro" */
  duration?: string
  /** Distância, ex: "45km" */
  distance?: string
  preferNextSemester?: boolean
  priceDisplayOverrides?: {
    s1?: SemesterOverrides
    s2?: SemesterOverrides
  } | null
  /** Slug do passeio — usado para resolver faixa etária de criança do tarifário */
  tourSlug?: string
}

/** Exportado para retrocompatibilidade com outros componentes */
export const PRICE_CATEGORIES = [
  { id: "adulto",    label: "Adulto" },
  { id: "crianca",   label: "Criança" },
  { id: "senior",    label: "Sênior" },
  { id: "ms",        label: "MS" },
  { id: "bonitense", label: "Bonitense" },
] as const

/**
 * Linhas de preço dentro de cada seção de temporada.
 * `getValue` é usado no modo automático; `overrideGetValue` quando o admin escolhe uma
 * linha específica. Para "Melhor Idade", como o BTMS não é normalizado (a coluna de
 * sênior costuma vir zerada), o override usa o preço de adulto da linha escolhida —
 * permitindo selecionar qualquer preço para ocupar o campo.
 */
const SEASON_ROWS = [
  {
    id: "adulto",
    label: "Adultos",
    getValue: (r: TourPriceRowDisplay) => r.adulto,
    overrideGetValue: (r: TourPriceRowDisplay) => r.adulto,
  },
  {
    id: "crianca",
    label: "Crianças (5 -12 anos)",
    getValue: (r: TourPriceRowDisplay) => r.crianca,
    overrideGetValue: (r: TourPriceRowDisplay) => r.crianca,
  },
  {
    id: "senior",
    label: "Melhor Idade",
    getValue: (r: TourPriceRowDisplay) => r.tarifaMs,
    overrideGetValue: (r: TourPriceRowDisplay) => r.adulto ?? r.tarifaMs,
  },
] as const

function fmtBRL(v: number | null | undefined): string | null {
  if (v == null || v <= 0) return null
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 })
}

function formatDate(s: string | null | undefined): string {
  if (!s) return ""
  try {
    return new Date(s + "T12:00:00").toLocaleDateString("pt-BR")
  } catch {
    return s
  }
}

/**
 * Verifica se uma linha de temporada está visível e retorna a entrada correspondente.
 * Suporta:
 *  - Novo com override: ["baixa:adulto#TABELA BT 2026#Contemplação"] — valor específico
 *  - Novo sem override: ["baixa:adulto"] — valor automático
 *  - Legacy: ["adulto"] — aplica-se a todas as temporadas
 *
 * Retorna undefined se oculto, ou a string da entrada (pode ter #override).
 */
function getSeasonRowEntry(
  rowId: string,
  season: "alta" | "baixa",
  visiblePrices?: string[],
  semesterNamespace?: "s1" | "s2"
): string | undefined {
  visiblePrices = standardVisiblePrices(visiblePrices)
  if (!visiblePrices || !Array.isArray(visiblePrices) || visiblePrices.length === 0) return `${season}:${rowId}` // all visible
  const prefix = `${season}:${rowId}`
  // Prioridade: namespace do semestre → (s2 herda s1) → sem prefixo (legado).
  const prefixes: string[] = []
  if (semesterNamespace) prefixes.push(`${semesterNamespace}:${prefix}`)
  if (semesterNamespace === "s2") prefixes.push(`s1:${prefix}`)
  prefixes.push(prefix)
  for (const p of prefixes) {
    const entry = visiblePrices.find((v) => v === p || v.startsWith(p + "#"))
    if (entry) return entry
  }
  // Legacy: plain row id
  if (visiblePrices.some(v => !v.includes(":"))) {
    return visiblePrices.includes(rowId) ? rowId : undefined
  }
  return undefined
}

/**
 * Resolve the actual value for a season row cell, respecting per-cell overrides.
 * Returns null if the cell is hidden or has no value.
 */
function resolveSeasonRowValue(
  rowId: string,
  season: "alta" | "baixa",
  campo: (row: TourPriceRowDisplay) => number | null | undefined,
  overrideCampo: (row: TourPriceRowDisplay) => number | null | undefined,
  visiblePrices: string[] | undefined,
  prices: { rows?: any[]; baixaRow?: TourPriceRowDisplay | null; mainPriceRow?: TourPriceRowDisplay | null },
  semesterNamespace?: "s1" | "s2"
): number | null {
  const entry = getSeasonRowEntry(rowId, season, visiblePrices, semesterNamespace)
  if (!entry) return null
  // Check for override: "baixa:adulto#tabela#atividade"
  const hashIdx = entry.indexOf("#")
  if (hashIdx >= 0) {
    const override = entry.substring(hashIdx + 1) // "tabela#atividade" ou "__manual__#valor"
    const manual = parseManualOverride(override)
    if (manual != null) return manual
    const sepIdx = override.indexOf("#")
    if (sepIdx >= 0) {
      const tabela = override.substring(0, sepIdx)
      const atividade = override.substring(sepIdx + 1)
      const row = prices.rows?.find((r: any) => r.nomeTabela === tabela && r.atividade === atividade)
      return row ? (overrideCampo(row as TourPriceRowDisplay) ?? null) : null
    }
  }
  // Auto: use matched season row
  const autoRow = season === "baixa" ? prices.baixaRow : prices.mainPriceRow
  return autoRow ? (campo(autoRow) ?? null) : null
}


type PriceTableBodyRow = {
  id: string
  label: string
  formatted: string
}

/** Linha individual da tabela */
function PriceRow({
  label,
  value,
  isLast,
}: {
  label: string
  value: string
  isLast?: boolean
}) {
  return (
    <div
      className={`flex justify-between items-center ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      <span className="px-4 py-[11px] text-gray-700 text-sm">{label}</span>
      <span className="px-4 py-[11px] text-right font-medium text-gray-800 tabular-nums text-sm">
        {value}
      </span>
    </div>
  )
}

/** Cabeçalho de seção (Baixa/Alta Temporada) */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 py-[11px] text-center font-bold text-gray-800 bg-gray-50 border-b border-gray-200 text-sm">
      {label}
    </div>
  )
}

export function TourPricesSidebar({
  prices,
  onReserve,
  visiblePrices,
  duration,
  distance,
  preferNextSemester,
  priceDisplayOverrides,
  tourSlug,
}: TourPricesSidebarProps) {
  if (!prices.rows || prices.rows.length === 0) return null

  const altaRep  = prices.mainPriceRow ?? null
  const baixaRep = prices.baixaRow     ?? null
  const semester = preferNextSemester ? "s2" : "s1"

  // Tarifas especiais (MS / Bonitense) resolvidas por temporada — cada uma pode ter
  // um valor de Alta E um de Baixa simultaneamente (quando configurado/existente).
  const specialRowFor = (rowId: "ms" | "bonitense", season: "alta" | "baixa") => {
    const row = resolveSpecialForSeason(rowId, season, visiblePrices, prices, semester)
    return row && (row.adulto ?? 0) > 0 ? row : null
  }
  const hasAnySpecial = (["ms", "bonitense"] as const).some(
    (id) => specialRowFor(id, "alta") || specialRowFor(id, "baixa")
  )

  if (!altaRep && !baixaRep && !hasAnySpecial) return null

  // Ordem: Baixa primeiro, depois Alta (igual à imagem de referência)
  const orderedSeasons: { key: "baixa" | "alta"; label: string }[] = [
    { key: "baixa", label: "Baixa Temporada" },
    { key: "alta", label: "Alta Temporada" },
  ]
  // Linhas extras do semestre; no 2º semestre, herda as do 1º quando não houver específicas.
  const extraRows = (() => {
    const own = listExtraRows(visiblePrices, semester)
    if (own.length > 0 || semester !== "s2") return own
    return listExtraRows(visiblePrices, "s1")
  })()

  const extrasForPlacement = (placement: PriceExtraPlacement) =>
    extraRows.filter((r) => r.placement === placement)

  const renderExtraRows = (rows: PriceTableExtraRow[], isLastInBlock: boolean) => {
    const visible = rows
      .map((row) => {
        const val = resolveExtraRowValue(row, prices)
        const formatted = fmtBRL(val)
        if (!formatted) return null
        return { id: row.id, label: row.label, formatted }
      })
      .filter((r): r is NonNullable<typeof r> => r != null)

    return visible.map((row, idx) => (
      <PriceRow
        key={row.id}
        label={row.label}
        value={row.formatted}
        isLast={isLastInBlock && idx === visible.length - 1}
      />
    ))
  }

  // Verifica se há algum conteúdo para mostrar
  const hasSeasonContent = orderedSeasons.some((s) =>
    SEASON_ROWS.some((r) => {
      const val = resolveSeasonRowValue(r.id, s.key, r.getValue, r.overrideGetValue, visiblePrices, prices, semester)
      return val != null && val > 0
    })
  )
  const hasExtraContent = extraRows.some((r) => {
    const val = resolveExtraRowValue(r, prices)
    return val != null && val > 0
  })
  if (!hasSeasonContent && !hasExtraContent && !hasAnySpecial) return null

  // Data de validade: prefere vigFim da Alta, fallback Baixa
  const vigFim = altaRep?.vigFim || baixaRep?.vigFim
  const showTopRow = !!(distance || duration)
  const semesterOverrides: SemesterOverrides | undefined = (() => {
    if (!priceDisplayOverrides) return undefined
    if (semester === "s2") {
      const s2 = priceDisplayOverrides.s2
      if (s2?.ages?.childMin != null) return s2
      return priceDisplayOverrides.s1
    }
    return priceDisplayOverrides.s1
  })()
  const childLabelByAge = resolveChildAgeLabel(tourSlug, semesterOverrides)
  const infantFreeConfig = resolveInfantFree(tourSlug)
  const seasonRowLabel: Record<string, string> = {
    adulto: semesterOverrides?.labels?.adulto || "Adultos",
    crianca: semesterOverrides?.labels?.crianca || childLabelByAge,
    senior: semesterOverrides?.labels?.senior || "Melhor Idade",
  }
  const msLabel = semesterOverrides?.labels?.ms || "MS"
  const bonLabel = semesterOverrides?.labels?.bonitense || "Bonitense"

  // Conta total de linhas a renderizar (para saber qual é a última e não colocar borda)
  // Usamos seções dinâmicas — a lógica de "isLast" é aplicada dentro de cada seção

  return (
    <div className="space-y-4 mb-6">
      {/* ─── Tabela principal ─────────────────────────────── */}
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm text-sm">

        {/* Distância | Duração */}
        {showTopRow && (
          <div
            className={`grid border-b border-gray-200 ${
              distance && duration ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {distance && (
              <div
                className={`px-4 py-[11px] text-center text-gray-600 text-xs ${
                  duration ? "border-r border-gray-200" : ""
                }`}
              >
                Distância:{" "}
                <span className="font-semibold text-gray-800">{distance}</span>
              </div>
            )}
            {duration && (
              <div className="px-4 py-[11px] text-center text-gray-600 text-xs">
                Duração:{" "}
                <span className="font-semibold text-gray-800">{duration}</span>
              </div>
            )}
          </div>
        )}

        {/* Seções por temporada (inclui tarifas especiais MS/Bonitense da temporada) */}
        {orderedSeasons.map((season) => {
          // Filtra linhas visíveis E com valor (suporta override por célula)
          const standardRows: PriceTableBodyRow[] = SEASON_ROWS.flatMap((rowDef) => {
            const val = resolveSeasonRowValue(rowDef.id, season.key, rowDef.getValue, rowDef.overrideGetValue, visiblePrices, prices, semester)
            const formatted = fmtBRL(val)
            if (!formatted) return []
            return [{ id: rowDef.id, label: seasonRowLabel[rowDef.id] ?? rowDef.label, formatted }]
          })

          if (infantFreeConfig && standardRows.some((r) => r.id === "crianca")) {
            const criancaIdx = standardRows.findIndex((r) => r.id === "crianca")
            standardRows.splice(criancaIdx + 1, 0, {
              id: "infant",
              label: formatInfantFreeLabel(infantFreeConfig),
              formatted: "Free",
            })
          }

          // Tarifas especiais (MS/Bonitense) desta temporada (cada uma pode ter Alta e Baixa)
          const specialRows: PriceTableBodyRow[] = []
          const msSeasonRow = specialRowFor("ms", season.key)
          if (msSeasonRow) {
            const f = fmtBRL(msSeasonRow.adulto)
            if (f) specialRows.push({ id: "ms", label: msLabel, formatted: f })
          }
          const bonSeasonRow = specialRowFor("bonitense", season.key)
          if (bonSeasonRow) {
            const f = fmtBRL(bonSeasonRow.adulto)
            if (f) specialRows.push({ id: "bonitense", label: bonLabel, formatted: f })
          }

          const bodyRows = [...standardRows, ...specialRows]

          const placementKey =
            season.key === "baixa" ? ("after_baixa" as const) : ("after_alta" as const)
          const seasonExtras = extrasForPlacement(placementKey)
          const seasonExtraNodes = renderExtraRows(seasonExtras, true)

          // Seção vazia → ocultar inclusive o cabeçalho
          if (bodyRows.length === 0 && seasonExtraNodes.length === 0) return null

          return (
            <div key={season.key}>
              <SectionHeader label={season.label} />
              {bodyRows.map((row, idx) => (
                <PriceRow
                  key={row.id}
                  label={row.label}
                  value={row.formatted}
                  isLast={seasonExtraNodes.length === 0 && idx === bodyRows.length - 1}
                />
              ))}
              {seasonExtraNodes}
            </div>
          )
        })}

        {/* Linhas extras configuradas no admin (rodapé) */}
        {renderExtraRows(
          extrasForPlacement("before_validity"),
          !(semesterOverrides?.validityEnd || vigFim)
        )}

        {/* Validade */}
        {(semesterOverrides?.validityEnd || vigFim) && (
          <div className="px-4 py-[11px] text-center font-bold text-gray-800 bg-gray-50 border-t border-gray-200 text-sm">
            Validade: {formatDate(semesterOverrides?.validityEnd || vigFim)}
          </div>
        )}
      </div>

      {/* Botão de reserva */}
      {onReserve && (
        <Button
          onClick={onReserve}
          className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 transition-transform duration-300 hover:scale-105 shadow-md"
        >
          Reservar Agora
        </Button>
      )}

      <p className="text-[11px] text-gray-400 text-center">
        * Valores por pessoa. Sujeitos a confirmação.
      </p>
    </div>
  )
}
