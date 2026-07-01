"use client"

import { Fragment, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TourPriceRowDisplay } from "@/lib/supabase/price-columns"
import { Plus, Trash2 } from "lucide-react"
import type { Tour } from "@/types"
import {
  PRICE_EXTRA_FIELD_OPTIONS,
  PRICE_EXTRA_PLACEMENT_OPTIONS,
  extraRowsInheritedFromS1,
  listExtraRowsForSemester,
  newExtraRowId,
  resolveExtraRowValue,
  setExtraRowsForSemester,
  type PriceExtraField,
  type PriceExtraPlacement,
  type PriceTableExtraRow,
} from "@/lib/price-table-extra-rows"

interface AdminPriceExtraRowsProps {
  tour: Tour
  allPriceRows: any[]
  editedVisiblePrices: string[] | undefined
  onVisiblePricesChange: (next: string[] | undefined) => void
  semester?: "s1" | "s2"
}

function fmtBRL(v: number | null | undefined): string {
  if (v == null || v <= 0) return "—"
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function AdminPriceExtraRows({
  tour,
  allPriceRows,
  editedVisiblePrices,
  onVisiblePricesChange,
  semester: semesterProp,
}: AdminPriceExtraRowsProps) {
  const [semesterInternal, setSemesterInternal] = useState<"s1" | "s2">(semesterProp ?? "s2")
  const semester = semesterProp ?? semesterInternal

  const extraRows = useMemo(
    () => listExtraRowsForSemester(editedVisiblePrices, semester),
    [editedVisiblePrices, semester]
  )
  const inheritedFromS1 = useMemo(
    () => extraRowsInheritedFromS1(editedVisiblePrices, semester),
    [editedVisiblePrices, semester]
  )

  const [draftSource, setDraftSource] = useState<"btms" | "manual">("btms")
  const [draftManualValue, setDraftManualValue] = useState("")
  const [draftTabelaAtividade, setDraftTabelaAtividade] = useState("")
  const [draftField, setDraftField] = useState<PriceExtraField>("adulto")
  const [draftPlacement, setDraftPlacement] = useState<PriceExtraPlacement>("after_alta")
  const [draftLabel, setDraftLabel] = useState("")

  const fieldGetter = useMemo(
    () => PRICE_EXTRA_FIELD_OPTIONS.find((f) => f.id === draftField)?.getValue,
    [draftField]
  )

  const rowOptions = useMemo(() => {
    const mapped = allPriceRows.map((r) => {
      const raw = fieldGetter
        ? fieldGetter(r as TourPriceRowDisplay)
        : (r as TourPriceRowDisplay).adulto
      const num = Number(raw)
      const hasValue = num > 0
      return {
        key: `${r.nomeTabela}#${r.atividade}`,
        tabela: r.nomeTabela as string,
        atividade: r.atividade as string,
        name: (r.atividadeAmigavel ?? r.atividade ?? r.nomeTabela) as string,
        subtitle: r.nomeTabela as string,
        priceFormatted: fmtBRL(hasValue ? num : null),
        hasValue,
      }
    })
    return [
      ...mapped.filter((o) => o.hasValue),
      ...mapped.filter((o) => !o.hasValue),
    ]
  }, [allPriceRows, fieldGetter])

  const selectedRowOption = rowOptions.find((o) => o.key === draftTabelaAtividade)

  const persistRows = (rows: PriceTableExtraRow[]) => {
    const tagged = rows.map((r) => ({ ...r, semester }))
    onVisiblePricesChange(setExtraRowsForSemester(editedVisiblePrices, semester, tagged))
  }

  const manualNumber = Number(String(draftManualValue).replace(",", "."))
  const manualValid = Number.isFinite(manualNumber) && manualNumber > 0
  const canAdd = draftLabel.trim().length > 0 && (draftSource === "manual" ? manualValid : !!draftTabelaAtividade)

  const handleAdd = () => {
    if (!draftLabel.trim()) return

    let row: PriceTableExtraRow
    if (draftSource === "manual") {
      if (!manualValid) return
      row = {
        id: newExtraRowId(),
        semester,
        placement: draftPlacement,
        field: draftField,
        tabela: "",
        atividade: "",
        label: draftLabel.trim(),
        manualValue: manualNumber,
      }
    } else {
      const [tabela, ...rest] = draftTabelaAtividade.split("#")
      const atividade = rest.join("#")
      if (!tabela || !atividade) return
      row = {
        id: newExtraRowId(),
        semester,
        placement: draftPlacement,
        field: draftField,
        tabela,
        atividade,
        label: draftLabel.trim(),
      }
    }
    persistRows([...extraRows, row])
    setDraftTabelaAtividade("")
    setDraftManualValue("")
    setDraftLabel("")
  }

  const handleRemove = (id: string) => {
    persistRows(extraRows.filter((r) => r.id !== id))
  }

  const previewPrices = tour.prices ?? { rows: allPriceRows }

  return (
    <div className="space-y-3 pt-2 border-t border-gray-100">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="text-sm font-semibold">Linhas extras na tabela de preços</Label>
          <p className="text-[11px] text-gray-400 mt-1">
            Adicione linhas na tabela &quot;Reserve agora&quot; do site usando qualquer preço do BTMS
            deste atrativo.
            {inheritedFromS1 && (
              <span className="block mt-1 text-violet-600 font-medium">
                Exibindo linhas do 1º semestre (herança). Ao editar, passam a valer para o 2º sem.
              </span>
            )}
          </p>
        </div>
        {semesterProp ? (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-violet-600 text-white rounded-md shrink-0">
            {semesterProp === "s2" ? "2º Sem" : "1º Sem"}
          </span>
        ) : (
          <div className="flex rounded-md border border-gray-200 overflow-hidden shrink-0">
            {(["s1", "s2"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSemesterInternal(s)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
                  semester === s ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {extraRows.length > 0 && (
        <ul className="space-y-2">
          {extraRows.map((row) => {
            const val = resolveExtraRowValue(row, previewPrices)
            const placementLabel =
              PRICE_EXTRA_PLACEMENT_OPTIONS.find((p) => p.id === row.placement)?.label ?? row.placement
            const fieldLabel =
              PRICE_EXTRA_FIELD_OPTIONS.find((f) => f.id === row.field)?.label ?? row.field
            return (
              <li
                key={row.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{row.label}</p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {row.manualValue != null && row.manualValue > 0
                      ? `${placementLabel} · Valor manual`
                      : `${placementLabel} · ${fieldLabel} · ${row.atividade}`}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-700 tabular-nums shrink-0">
                  {fmtBRL(val)}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemove(row.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/30 p-3 space-y-3">
        <p className="text-xs font-semibold text-indigo-800">Nova linha</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-600">Fonte do valor</Label>
            <Select value={draftSource} onValueChange={(v) => setDraftSource(v as "btms" | "manual")}>
              <SelectTrigger className="h-9 text-xs bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btms">Preço do BTMS</SelectItem>
                <SelectItem value="manual">✏️ Valor manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-600">Posição na tabela</Label>
            <Select
              value={draftPlacement}
              onValueChange={(v) => setDraftPlacement(v as PriceExtraPlacement)}
            >
              <SelectTrigger className="h-9 text-xs bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_EXTRA_PLACEMENT_OPTIONS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {draftSource === "manual" ? (
          <div className="space-y-1.5">
            <Label className="text-[11px] text-gray-600">Valor manual (R$)</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              className="h-9 text-xs bg-white border-indigo-200"
              placeholder="Ex: 199.90"
              value={draftManualValue}
              onChange={(e) => setDraftManualValue(e.target.value)}
            />
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-gray-600">Coluna de valor</Label>
              <Select value={draftField} onValueChange={(v) => setDraftField(v as PriceExtraField)}>
                <SelectTrigger className="h-9 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_EXTRA_FIELD_OPTIONS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-gray-600">Preço no BTMS</Label>
              <Select value={draftTabelaAtividade} onValueChange={setDraftTabelaAtividade}>
                <SelectTrigger className="h-9 text-xs bg-white">
                  <SelectValue placeholder="Selecione tabela + atividade...">
                    {selectedRowOption ? (
                      <span className="flex items-center justify-between gap-2 w-full min-w-0">
                        <span className="truncate text-left">
                          {selectedRowOption.name}
                          <span className="block text-[10px] text-gray-400 font-normal truncate">
                            {selectedRowOption.subtitle}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 font-semibold tabular-nums ${
                            selectedRowOption.hasValue ? "text-green-700" : "text-gray-300"
                          }`}
                        >
                          {selectedRowOption.priceFormatted}
                        </span>
                      </span>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[min(320px,70vh)]">
                  {rowOptions.length === 0 ? (
                    <div className="py-3 text-center text-xs text-gray-400">
                      Vincule um atrativo BTMS para carregar os preços.
                    </div>
                  ) : (
                    rowOptions.map((opt, i) => {
                      const prevHadVal = i > 0 && rowOptions[i - 1]?.hasValue
                      const showSep = !opt.hasValue && prevHadVal
                      return (
                        <Fragment key={opt.key}>
                          {showSep && <SelectSeparator />}
                          <SelectItem value={opt.key} className="py-2">
                            <div className="flex items-center justify-between gap-3 w-full min-w-[260px]">
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium truncate max-w-[180px]">
                                  {opt.name}
                                </span>
                                <span className="text-[10px] text-gray-400 truncate max-w-[180px]">
                                  {opt.subtitle}
                                </span>
                              </div>
                              <span
                                className={`text-xs font-bold shrink-0 tabular-nums ${
                                  opt.hasValue ? "text-green-700" : "text-gray-300"
                                }`}
                              >
                                {opt.priceFormatted}
                              </span>
                            </div>
                          </SelectItem>
                        </Fragment>
                      )
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label className="text-[11px] text-gray-600">Texto exibido na tabela</Label>
          <Input
            className="h-9 text-xs bg-white"
            placeholder="Ex: Garupa, Meia entrada, Pacote família..."
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
          />
        </div>

        <Button
          type="button"
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={!canAdd}
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar linha na tabela
        </Button>
      </div>
    </div>
  )
}
