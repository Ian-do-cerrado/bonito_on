"use client"

import React, { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link2, Link2Off, DollarSign, BarChart3 } from "lucide-react"
import type { Tour } from "@/types"
import type { TourPriceRowDisplay } from "@/lib/supabase/price-columns"

export type TourPriceLinkState = Pick<
  Tour,
  | "btms_atrativo_override"
  | "manual_price"
  | "preferred_price_atividade"
  | "preferred_price_tabela"
  | "prices"
>

export interface AdminTourPriceLinkFormProps {
  value: TourPriceLinkState
  onChange: (updates: Partial<TourPriceLinkState> & { price?: number }) => void
  /** Carrega atrativos e linhas quando o painel está visível (ex.: dialog aberto). */
  active?: boolean
}

function fmtBRL(v: unknown): string | null {
  const n = Number(v)
  return n > 0 ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : null
}

function rowAdultPrice(row?: TourPriceRowDisplay | null): number {
  if (!row) return 0
  const n = Number(row.adulto ?? row.garupaAdulto)
  return n > 0 ? n : 0
}

export function AdminTourPriceLinkForm({ value, onChange, active = true }: AdminTourPriceLinkFormProps) {
  const [availableAtrativos, setAvailableAtrativos] = useState<string[]>([])
  const [isLoadingAtrativos, setIsLoadingAtrativos] = useState(false)
  const [allAtivRows, setAllAtivRows] = useState<TourPriceRowDisplay[]>([])
  const [isLoadingAtivRows, setIsLoadingAtivRows] = useState(false)

  const loadAvailableAtrativos = async () => {
    if (availableAtrativos.length > 0) return
    setIsLoadingAtrativos(true)
    try {
      const { fetchAvailableAtrativos } = await import("@/app/actions/prices")
      const result = await fetchAvailableAtrativos()
      if (result.success && result.atrativos) {
        setAvailableAtrativos(result.atrativos)
      }
    } catch (error) {
      console.error("Erro ao carregar atrativos:", error)
    } finally {
      setIsLoadingAtrativos(false)
    }
  }

  const loadAllAtivRowsForAtrativo = async (atv: string) => {
    if (!atv.trim()) {
      setAllAtivRows((value.prices?.rows as TourPriceRowDisplay[] | undefined) ?? [])
      return
    }
    setIsLoadingAtivRows(true)
    try {
      const { fetchAllRowsForAtrativo } = await import("@/app/actions/prices")
      const res = await fetchAllRowsForAtrativo(atv.trim(), false)
      if (res.success && res.rows && res.rows.length > 0) {
        setAllAtivRows(res.rows)
      } else {
        setAllAtivRows((value.prices?.rows as TourPriceRowDisplay[] | undefined) ?? [])
      }
    } catch (error) {
      console.error("Erro ao carregar linhas do atrativo:", error)
      setAllAtivRows((value.prices?.rows as TourPriceRowDisplay[] | undefined) ?? [])
    } finally {
      setIsLoadingAtivRows(false)
    }
  }

  useEffect(() => {
    if (!active) return
    void loadAvailableAtrativos()
    const atv = value.btms_atrativo_override ?? ""
    if (atv) {
      void loadAllAtivRowsForAtrativo(atv)
    } else {
      setAllAtivRows((value.prices?.rows as TourPriceRowDisplay[] | undefined) ?? [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const handleAtativoChange = (novoAtrativo: string) => {
    const override = novoAtrativo === "__auto__" ? undefined : novoAtrativo
    onChange({
      btms_atrativo_override: override,
      preferred_price_atividade: undefined,
      preferred_price_tabela: undefined,
      price: 0,
    })
    if (override) {
      void loadAllAtivRowsForAtrativo(override)
    } else {
      setAllAtivRows((value.prices?.rows as TourPriceRowDisplay[] | undefined) ?? [])
    }
  }

  const manualActive = value.manual_price != null && value.manual_price > 0
  const allPriceRows = allAtivRows.length > 0
    ? allAtivRows
    : ((value.prices?.rows as TourPriceRowDisplay[] | undefined) ?? [])

  const currentKey =
    value.preferred_price_atividade && value.preferred_price_tabela
      ? `${value.preferred_price_tabela}#${value.preferred_price_atividade}`
      : "__auto__"

  let currentDisplay: string | null = null
  if (currentKey !== "__auto__") {
    const row = allPriceRows.find(
      (r) => r.nomeTabela === value.preferred_price_tabela && r.atividade === value.preferred_price_atividade
    )
    currentDisplay = fmtBRL(row?.adulto ?? row?.garupaAdulto) ?? "—"
  } else {
    currentDisplay = fmtBRL(value.prices?.mainPriceRow?.adulto) ?? "—"
  }

  const opts = [
    ...allPriceRows.filter((r) => Number(r.adulto) > 0 || Number(r.garupaAdulto) > 0),
    ...allPriceRows.filter((r) => !(Number(r.adulto) > 0) && !(Number(r.garupaAdulto) > 0)),
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-600" />
          <Label className="text-indigo-700 font-semibold text-sm">Vínculo com Atrativo BTMS</Label>
        </div>
        <p className="text-xs text-indigo-500 leading-relaxed">
          Quando vinculado, <strong>todos</strong> os preços do atrativo selecionado ficam disponíveis para escolha — sem filtros automáticos.
        </p>
        {isLoadingAtrativos ? (
          <div className="text-xs text-indigo-500 animate-pulse font-medium">Carregando atrativos da tabela BTMS...</div>
        ) : (
          <Select value={value.btms_atrativo_override ?? "__auto__"} onValueChange={handleAtativoChange}>
            <SelectTrigger className="bg-white border-indigo-200 text-sm">
              <div className="flex items-center gap-2">
                {value.btms_atrativo_override ? (
                  <Link2 className="w-3 h-3 text-indigo-500 shrink-0" />
                ) : (
                  <Link2Off className="w-3 h-3 text-gray-400 shrink-0" />
                )}
                <SelectValue placeholder="Detecção automática (padrão)" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__auto__">
                <span className="flex items-center gap-2 text-gray-500">
                  <Link2Off className="w-3 h-3" />
                  Detecção automática (padrão)
                </span>
              </SelectItem>
              {availableAtrativos.map((atrativo) => (
                <SelectItem key={atrativo} value={atrativo}>
                  <span className="flex items-center gap-2">
                    <Link2 className="w-3 h-3 text-indigo-400" />
                    {atrativo}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {value.btms_atrativo_override && (
          <p className="text-[11px] text-indigo-600 font-medium">
            ✓ Vinculado a: <em>{value.btms_atrativo_override}</em>
          </p>
        )}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-600" />
          <Label className="text-amber-700 font-semibold text-sm">Valor Manual (Opcional)</Label>
        </div>
        <p className="text-xs text-amber-500 leading-relaxed">
          Quando preenchido, este valor <strong>substitui completamente</strong> o preço automático da tabela BTMS. Deixe vazio para usar o preço automático.
        </p>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-amber-600 font-medium">R$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 250.00"
              value={value.manual_price ?? ""}
              onChange={(e) => {
                const val = e.target.value
                const parsed = val === "" ? null : parseFloat(val)
                onChange({
                  manual_price: parsed,
                  price: parsed != null && parsed > 0 ? parsed : 0,
                })
              }}
              className="pl-10 bg-white border-amber-200 text-sm font-medium"
            />
          </div>
          {manualActive && (
            <button
              type="button"
              onClick={() => onChange({ manual_price: null, price: 0 })}
              className="text-[10px] text-amber-500 hover:text-red-500 underline underline-offset-2 whitespace-nowrap"
            >
              Limpar
            </button>
          )}
        </div>
        {manualActive && (
          <p className="text-[11px] text-amber-600 font-medium">
            ✓ Valor manual ativo: {value.manual_price!.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            {" "}— a sincronização automática <strong>não</strong> sobrescreverá este valor.
          </p>
        )}
      </div>

      {!manualActive && (
        <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <Label className="text-green-700 font-semibold text-sm">Valor Principal do Card</Label>
            </div>
            {value.preferred_price_atividade && (
              <button
                type="button"
                onClick={() => onChange({
                  preferred_price_atividade: undefined,
                  preferred_price_tabela: undefined,
                  price: 0,
                })}
                className="text-[10px] text-gray-400 hover:text-red-500 underline underline-offset-2"
              >
                Resetar
              </button>
            )}
          </div>
          <p className="text-xs text-green-500 leading-relaxed">
            Selecione qual atividade/tabela BTMS fornecerá o preço exibido nos cards e na página do passeio.
          </p>
          {isLoadingAtivRows ? (
            <div className="text-xs text-green-500 animate-pulse font-medium">Carregando opções de preço...</div>
          ) : (
            <Select
              value={currentKey}
              onValueChange={(val) => {
                if (val === "__auto__") {
                  onChange({
                    preferred_price_atividade: undefined,
                    preferred_price_tabela: undefined,
                    price: rowAdultPrice(value.prices?.mainPriceRow) || 0,
                  })
                } else {
                  const [tabela, ...rest] = val.split("#")
                  const atividade = rest.join("#")
                  const row = allPriceRows.find(
                    (r) => r.nomeTabela === tabela && r.atividade === atividade
                  )
                  onChange({
                    preferred_price_atividade: atividade,
                    preferred_price_tabela: tabela,
                    price: rowAdultPrice(row),
                  })
                }
              }}
            >
              <SelectTrigger className="bg-white border-green-200 text-sm">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span className={currentDisplay !== "—" ? "text-green-700 font-medium" : "text-gray-400"}>
                      {currentKey === "__auto__" ? "↺ Automático" : value.preferred_price_atividade}
                    </span>
                    <span className={`text-[11px] ${currentDisplay !== "—" ? "text-green-600" : "text-gray-300"}`}>
                      {currentDisplay}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__auto__">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="text-gray-400 italic text-[11px]">↺ Automático (BTMS calcula)</span>
                    {fmtBRL(value.prices?.mainPriceRow?.adulto) && (
                      <span className="text-gray-500 text-[10px]">{fmtBRL(value.prices?.mainPriceRow?.adulto)}</span>
                    )}
                  </div>
                </SelectItem>
                {opts.map((r, i) => {
                  const optKey = `${r.nomeTabela}#${r.atividade}`
                  const rawVal = r.adulto ?? r.garupaAdulto
                  const val = fmtBRL(rawVal)
                  const name = r.atividadeAmigavel ?? r.atividade ?? r.nomeTabela
                  const prevHadVal = i > 0 && (Number(opts[i - 1]?.adulto) > 0 || Number(opts[i - 1]?.garupaAdulto) > 0)
                  const thisHasVal = Number(rawVal) > 0
                  const showSep = !thisHasVal && prevHadVal
                  return (
                    <React.Fragment key={`main-${optKey}|${i}`}>
                      {showSep && <SelectSeparator />}
                      <SelectItem value={optKey}>
                        <div className="flex items-center justify-between gap-3 w-full">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] text-gray-800 font-medium truncate max-w-[160px]">{name}</span>
                            <span className="text-[9px] text-gray-400 truncate max-w-[160px]">{r.nomeTabela}</span>
                          </div>
                          <span className={`text-[11px] font-bold shrink-0 ${val ? "text-green-700" : "text-gray-300"}`}>
                            {val ?? "—"}
                          </span>
                        </div>
                      </SelectItem>
                    </React.Fragment>
                  )
                })}
              </SelectContent>
            </Select>
          )}
          {value.preferred_price_atividade && (
            <p className="text-[11px] text-green-600 font-medium">
              ✓ Fixado em: <em>{value.preferred_price_atividade}</em>
              {value.preferred_price_tabela && (
                <span className="text-green-400"> ({value.preferred_price_tabela})</span>
              )}
            </p>
          )}
          {!value.btms_atrativo_override && allPriceRows.length === 0 && (
            <p className="text-[11px] text-gray-500">
              Vincule um atrativo BTMS ou use valor manual para definir o preço deste passeio.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function hasTourPricingConfigured(tour: {
  price?: number
  manual_price?: number | null
  preferred_price_atividade?: string
  btms_atrativo_override?: string
}): boolean {
  if (tour.manual_price != null && tour.manual_price > 0) return true
  if (tour.preferred_price_atividade) return true
  if (tour.btms_atrativo_override) return true
  if (tour.price != null && tour.price > 0) return true
  return false
}
