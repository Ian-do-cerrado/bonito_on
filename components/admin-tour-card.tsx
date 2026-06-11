"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Save, X, Languages, Loader2, Link2, Link2Off, DollarSign, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import type { Tour } from "@/components/tours-section"
import { getDisplayPrice } from "@/lib/tour-price-utils"
import { AdminPriceExtraRows } from "@/components/admin-price-extra-rows"
import { isExtraRowEntry } from "@/lib/price-table-extra-rows"
import { parseSpecialEntry, inferSpecialSeason, buildSpecialKey, type SpecialSeason } from "@/lib/special-tariffs"
import { buildManualOverride, parseManualOverride, isManualOverride } from "@/lib/price-overrides"


interface AdminTourCardProps {
  tour: Tour
  onUpdate: (tour: Tour) => any
  onDelete: (tourId: string) => void
}

export function AdminTourCard({ tour, onUpdate, onDelete }: AdminTourCardProps) {
  const { t } = useLanguage()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedTour, setEditedTour] = useState<Tour>(tour)
  const [availableAtrativos, setAvailableAtrativos] = useState<string[]>([])
  const [isLoadingAtrativos, setIsLoadingAtrativos] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  // All BTMS rows for this tour's atrativo (unfiltered) — used for price cell pickers
  const [allAtivRows, setAllAtivRows] = useState<any[]>([])
  const [isLoadingAtivRows, setIsLoadingAtivRows] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!editedTour.title || !editedTour.description) return
    
    setIsTranslating(true)
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedTour.title,
            description: editedTour.description
          },
          to: "en"
        })
      })
      const dataEn = await res.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedTour.title,
            description: editedTour.description
          },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      if (dataEn.error || dataEs.error) {
        throw new Error(dataEn.error || dataEs.error || "Erro desconhecido na tradução")
      }

      if (!dataEn.results || !dataEs.results) {
        throw new Error("Resultados da tradução não recebidos")
      }
      
      setEditedTour(prev => ({
        ...prev,
        title_en: dataEn.results.title || prev.title_en,
        description_en: dataEn.results.description || prev.description_en,
        title_es: dataEs.results.title || prev.title_es,
        description_es: dataEs.results.description || prev.description_es
      }))

      toast({
        title: "Sucesso",
        description: "Tradução concluída com sucesso!",
      })
    } catch (error) {
      console.error("Erro na tradução:", error)
      toast({
        title: "Erro na tradução",
        description: error instanceof Error ? error.message : "Não foi possível traduzir o conteúdo",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  /** Carrega a lista de atrativos disponíveis na view BTMS */
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


  const handleEditClick = () => {
    setIsEditing(true)
    loadAvailableAtrativos()
    // Lazy-load all BTMS rows for this tour's atrativo
    const atv = editedTour.btms_atrativo_override
      ?? (editedTour.prices?.rows?.[0] as any)?.atrativo
      ?? ""
    if (atv) {
      setIsLoadingAtivRows(true)
      import("@/app/actions/prices").then(({ fetchAllRowsForAtrativo }) =>
        fetchAllRowsForAtrativo(atv).then(res => {
          if (res.success && res.rows) setAllAtivRows(res.rows)
        }).finally(() => setIsLoadingAtivRows(false))
      )
    } else {
      // Fallback: use the filtered rows already available
      setAllAtivRows(editedTour.prices?.rows ?? [])
    }
  }

  /** Chamado quando o admin seleciona um novo atrativo no dropdown de vínculo */
  const handleAtativoChange = (novoAtrativo: string) => {
    const override = novoAtrativo === "__auto__" ? undefined : novoAtrativo
    setEditedTour(prev => ({
      ...prev,
      btms_atrativo_override: override,
      // Limpa todas as seleções de preço ao trocar atrativo
      preferred_price_atividade: undefined,
      preferred_price_tabela: undefined,
      preferred_baixa_tabela: undefined,
      preferred_ms_tabela: undefined,
      preferred_bonitense_tabela: undefined,
      price: 0,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const success = await onUpdate(editedTour)
      if (success !== false) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Erro ao salvar passeio:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedTour(tour)
    setIsEditing(false)
  }

  /** Preserva linhas extras ao editar preços padrão (baixa/alta/ms). */
  function mergeVisibleWithExtraRows(
    standard: string[] | undefined,
    full?: string[] | null
  ): string[] | undefined {
    const extras = Array.isArray(full) ? full.filter(isExtraRowEntry) : []
    const std = standard ?? []
    const merged = [...std, ...extras]
    return merged.length === 0 ? undefined : merged
  }

  const getCategoryLabel = (category: Tour["category"]) => {
    switch (category) {
      case "adventure": return t("adventure")
      case "contemplation": return t("contemplation")
      case "cave": return t("cave")
      case "waterfall": return t("waterfall")
      case "rappelling": return t("rappelling")
      case "horseback": return t("horseback")
      case "biking": return t("biking")
      case "scubaDiving": return t("scubaDiving")
      case "resort": return t("resort")
      default: return t("adventure")
    }
  }

  const getCategoryColor = (category: Tour["category"]) => {
    switch (category) {
      case "adventure": return "bg-red-100 text-red-800"
      case "contemplation": return "bg-blue-100 text-blue-800"
      case "cave": return "bg-blue-100 text-blue-800"
      case "waterfall": return "bg-cyan-100 text-cyan-800"
      case "rappelling": return "bg-purple-100 text-purple-800"
      case "horseback": return "bg-amber-100 text-amber-800"
      case "biking": return "bg-lime-100 text-lime-800"
      case "scubaDiving": return "bg-indigo-100 text-indigo-800"
      case "resort": return "bg-green-100 text-green-800"
      case "floating": return "bg-green-100 text-green-800"
      default: return "bg-green-100 text-green-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image 
          src={tour.image || "/placeholder.svg"} 
          alt={tour.title} 
          fill 
          className="object-cover"
          unoptimized={tour.image?.endsWith(".webp")}
        />
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tour.category)}`}>
          {getCategoryLabel(tour.category)}
        </div>
        {/* Badge de vínculo manual */}
        {tour.btms_atrativo_override && !isEditing && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-indigo-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm">
            <Link2 className="w-2.5 h-2.5" />
            {tour.btms_atrativo_override}
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {!isEditing && <h3 className="font-bold text-lg line-clamp-2">{tour.title}</h3>}
          </div>
          <div className="flex space-x-2 ml-2">
            {isEditing ? (
              <>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  {t("save")}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="w-4 h-4 mr-1" /> {t("cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={handleEditClick}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(tour.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <Tabs defaultValue="pt" className="w-full">
              <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="pt">PT</TabsTrigger>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="es">ES</TabsTrigger>
                </TabsList>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="flex items-center gap-2"
                >
                  {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                  {t("autoTranslate")}
                </Button>
              </div>

              <TabsContent value="pt" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (PT)</Label>
                  <Input
                    value={editedTour.title}
                    onChange={(e) => setEditedTour({ ...editedTour, title: e.target.value })}
                    className="font-bold border-green-200"
                  />
                  <Label>Descrição (PT)</Label>
                  <RichTextEditor
                    value={editedTour.description || ""}
                    onChange={(val) => setEditedTour({ ...editedTour, description: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={editedTour.title_en || ""}
                    onChange={(e) => setEditedTour({ ...editedTour, title_en: e.target.value })}
                  />
                  <Label>Description (EN)</Label>
                  <RichTextEditor
                    value={editedTour.description_en || ""}
                    onChange={(val) => setEditedTour({ ...editedTour, description_en: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="es" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (ES)</Label>
                  <Input
                    value={editedTour.title_es || ""}
                    onChange={(e) => setEditedTour({ ...editedTour, title_es: e.target.value })}
                  />
                  <Label>Descripción (ES)</Label>
                  <RichTextEditor
                    value={editedTour.description_es || ""}
                    onChange={(val) => setEditedTour({ ...editedTour, description_es: val })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t space-y-4">

              {/* ── Vínculo com Atrativo BTMS ── */}
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <Label className="text-indigo-700 font-semibold text-sm">
                    Vínculo com Atrativo BTMS
                  </Label>
                </div>
                <p className="text-xs text-indigo-500 leading-relaxed">
                  Quando vinculado, <strong>todos</strong> os preços do atrativo selecionado aparecem no dropdown abaixo — sem filtros automáticos.
                </p>
                {isLoadingAtrativos ? (
                  <div className="text-xs text-indigo-500 animate-pulse font-medium">Carregando atrativos da tabela BTMS...</div>
                ) : (
                  <Select
                    value={editedTour.btms_atrativo_override ?? "__auto__"}
                    onValueChange={handleAtativoChange}
                  >
                    <SelectTrigger className="bg-white border-indigo-200 text-sm">
                      <div className="flex items-center gap-2">
                        {editedTour.btms_atrativo_override
                          ? <Link2 className="w-3 h-3 text-indigo-500 shrink-0" />
                          : <Link2Off className="w-3 h-3 text-gray-400 shrink-0" />
                        }
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
                {editedTour.btms_atrativo_override && (
                  <p className="text-[11px] text-indigo-600 font-medium">
                    ✓ Vinculado a: <em>{editedTour.btms_atrativo_override}</em>
                  </p>
                )}
              </div>

              {/* ── Valor Manual (Override Absoluto) ── */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <Label className="text-amber-700 font-semibold text-sm">
                    Valor Manual (Opcional)
                  </Label>
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
                      value={editedTour.manual_price ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        setEditedTour(prev => ({
                          ...prev,
                          manual_price: val === "" ? null : parseFloat(val)
                        }))
                      }}
                      className="pl-10 bg-white border-amber-200 text-sm font-medium"
                    />
                  </div>
                  {editedTour.manual_price != null && editedTour.manual_price > 0 && (
                    <button
                      type="button"
                      onClick={() => setEditedTour(prev => ({ ...prev, manual_price: null }))}
                      className="text-[10px] text-amber-500 hover:text-red-500 underline underline-offset-2 whitespace-nowrap"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                {editedTour.manual_price != null && editedTour.manual_price > 0 && (
                  <p className="text-[11px] text-amber-600 font-medium">
                    ✓ Valor manual ativo: {editedTour.manual_price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    {" "}— a sincronização automática <strong>não</strong> sobrescreverá este valor.
                  </p>
                )}
              </div>

              {/* ── Valor Principal do Card (Seletor BTMS) ── */}
              {!editedTour.manual_price && (
                <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <Label className="text-green-700 font-semibold text-sm">
                        Valor Principal do Card
                      </Label>
                    </div>
                    {editedTour.preferred_price_atividade && (
                      <button
                        type="button"
                        onClick={() => setEditedTour(prev => ({
                          ...prev,
                          preferred_price_atividade: undefined,
                          preferred_price_tabela: undefined,
                        }))}
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
                  ) : (() => {
                    const allPriceRows: any[] = allAtivRows.length > 0 ? allAtivRows : (editedTour.prices?.rows ?? [])
                    const fmtBRL = (v: any) => {
                      const n = Number(v)
                      return n > 0 ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : null
                    }
                    // Current resolved value
                    const currentKey = editedTour.preferred_price_atividade && editedTour.preferred_price_tabela
                      ? `${editedTour.preferred_price_tabela}#${editedTour.preferred_price_atividade}`
                      : "__auto__"
                    let currentDisplay: string | null = null
                    if (currentKey !== "__auto__") {
                      const row = allPriceRows.find(r => r.nomeTabela === editedTour.preferred_price_tabela && r.atividade === editedTour.preferred_price_atividade)
                      currentDisplay = fmtBRL(row?.adulto ?? row?.garupaAdulto) ?? "—"
                    } else {
                      currentDisplay = fmtBRL(editedTour.prices?.mainPriceRow?.adulto) ?? "—"
                    }
                    // Sort: rows with adulto > 0 first
                    const opts = [
                      ...allPriceRows.filter(r => Number(r.adulto) > 0 || Number(r.garupaAdulto) > 0),
                      ...allPriceRows.filter(r => !(Number(r.adulto) > 0) && !(Number(r.garupaAdulto) > 0)),
                    ]
                    return (
                      <Select
                        value={currentKey}
                        onValueChange={(val) => {
                          if (val === "__auto__") {
                            setEditedTour(prev => ({
                              ...prev,
                              preferred_price_atividade: undefined,
                              preferred_price_tabela: undefined,
                            }))
                          } else {
                            const [tabela, ...rest] = val.split("#")
                            const atividade = rest.join("#")
                            setEditedTour(prev => ({
                              ...prev,
                              preferred_price_atividade: atividade,
                              preferred_price_tabela: tabela,
                            }))
                          }
                        }}
                      >
                        <SelectTrigger className="bg-white border-green-200 text-sm">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <span className={currentDisplay !== "—" ? "text-green-700 font-medium" : "text-gray-400"}>
                                {currentKey === "__auto__" ? "↺ Automático" : editedTour.preferred_price_atividade}
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
                              {fmtBRL(editedTour.prices?.mainPriceRow?.adulto) && (
                                <span className="text-gray-500 text-[10px]">{fmtBRL(editedTour.prices?.mainPriceRow?.adulto)}</span>
                              )}
                            </div>
                          </SelectItem>
                          {opts.map((r, i) => {
                            const optKey = `${r.nomeTabela}#${r.atividade}`
                            const rawVal = r.adulto ?? r.garupaAdulto
                            const val = fmtBRL(rawVal)
                            const name = r.atividadeAmigavel ?? r.atividade ?? r.nomeTabela
                            const prevHadVal = i > 0 && (Number(opts[i-1]?.adulto) > 0 || Number(opts[i-1]?.garupaAdulto) > 0)
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
                    )
                  })()}
                  {editedTour.preferred_price_atividade && (
                    <p className="text-[11px] text-green-600 font-medium">
                      ✓ Fixado em: <em>{editedTour.preferred_price_atividade}</em>
                      {editedTour.preferred_price_tabela && <span className="text-green-400"> ({editedTour.preferred_price_tabela})</span>}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="category">{t("category")}</Label>

                <Select
                  value={editedTour.category}
                  onValueChange={(value) => setEditedTour({ ...editedTour, category: value as Tour["category"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adventure">{t("adventure")}</SelectItem>
                    <SelectItem value="contemplation">{t("contemplation")}</SelectItem>
                    <SelectItem value="cave">{t("cave")}</SelectItem>
                    <SelectItem value="waterfall">{t("waterfall")}</SelectItem>
                    <SelectItem value="rappelling">{t("rappelling")}</SelectItem>
                    <SelectItem value="horseback">{t("horseback")}</SelectItem>
                    <SelectItem value="biking">{t("biking")}</SelectItem>
                    <SelectItem value="scubaDiving">{t("scubaDiving")}</SelectItem>
                    <SelectItem value="floating">{t("floating")}</SelectItem>
                    <SelectItem value="resort">{t("resort")}</SelectItem>
                    <SelectItem value="pantanal">{t("pantanal")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">{t("imageUrl")}</Label>
                <Input
                  value={editedTour.image}
                  onChange={(e) => setEditedTour({ ...editedTour, image: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">{t("location")}</Label>
                  <Input
                    id="location"
                    value={editedTour.location || ""}
                    onChange={(e) => setEditedTour({ ...editedTour, location: e.target.value })}
                    placeholder="Ex: Bonito, MS"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">{t("duration")}</Label>
                  <Input
                    id="duration"
                    value={editedTour.duration || ""}
                    onChange={(e) => setEditedTour({ ...editedTour, duration: e.target.value })}
                    placeholder="Ex: 3h"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxGroupSize">Tamanho do grupo (máx. pessoas)</Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  min={0}
                  value={editedTour.maxGroupSize ?? 0}
                  onChange={(e) => setEditedTour({ ...editedTour, maxGroupSize: Number(e.target.value) })}
                  placeholder="Ex: 15"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label>Itens Incluídos</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "includedGuide", label: t("includedGuide") },
                    { id: "includedEquipment", label: t("includedEquipment") },
                    { id: "includedInsurance", label: t("includedInsurance") },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`included-${item.id}-${tour.id}`}
                        checked={editedTour.included?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          const current = editedTour.included || []
                          if (checked) {
                            setEditedTour({ ...editedTour, included: [...current, item.id] })
                          } else {
                            setEditedTour({ ...editedTour, included: current.filter(id => id !== item.id) })
                          }
                        }}
                      />
                      <label 
                        htmlFor={`included-${item.id}-${tour.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Preços Visíveis no Site ──────────────────────── */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Preços Visíveis no Site</Label>
                  <button
                    type="button"
                    onClick={() => setEditedTour(prev => ({ ...prev, visible_prices: undefined }))}
                    className="text-[10px] text-gray-400 hover:text-indigo-500 underline underline-offset-2"
                  >
                    Resetar
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Para cada linha escolha qual valor da tabela BTMS será exibido (ou oculte-a).
                </p>

                {([
                  {
                    key: "baixa" as const, label: "Baixa Temporada",
                    badge: "bg-blue-50 border-blue-200 text-blue-700",
                    rowDefs: [
                      { id: "adulto",  label: "Adultos",      campo: "adulto"   as const, overrideCampo: "adulto" as const,   dbCol: "publico_pax" },
                      { id: "crianca", label: "Crianças",     campo: "crianca"  as const, overrideCampo: "crianca" as const,  dbCol: "publico_chd" },
                      { id: "senior",  label: "Melhor Idade", campo: "tarifaMs" as const, overrideCampo: "adulto" as const,   dbCol: "publico_crt" },
                    ],
                  },
                  {
                    key: "alta" as const, label: "Alta Temporada",
                    badge: "bg-orange-50 border-orange-200 text-orange-700",
                    rowDefs: [
                      { id: "adulto",  label: "Adultos",      campo: "adulto"   as const, overrideCampo: "adulto" as const,   dbCol: "publico_pax" },
                      { id: "crianca", label: "Crianças",     campo: "crianca"  as const, overrideCampo: "crianca" as const,  dbCol: "publico_chd" },
                      { id: "senior",  label: "Melhor Idade", campo: "tarifaMs" as const, overrideCampo: "adulto" as const,   dbCol: "publico_crt" },
                    ],
                  },
                ] as const).map(sectionDef => {
                  // Use allAtivRows (unfiltered full BTMS table) when available, else fallback to prices.rows
                  const allPriceRows: any[] = allAtivRows.length > 0 ? allAtivRows : (editedTour.prices?.rows ?? [])
                  const fmtBRL = (v: any) => {
                    const n = Number(v)
                    return n > 0 ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : null
                  }
                  // Manage visible_prices entries for this section
                  const S1_KEYS = ["s1:baixa:adulto","s1:baixa:crianca","s1:baixa:senior","s1:alta:adulto","s1:alta:crianca","s1:alta:senior","s1:ms","s1:bonitense"]
                  const LEGACY_KEYS = ["baixa:adulto","baixa:crianca","baixa:senior","alta:adulto","alta:crianca","alta:senior","ms","bonitense"]
                  const ALL_KEYS = [...S1_KEYS, ...LEGACY_KEYS]
                  const vpRaw = editedTour.visible_prices
                  const vp = Array.isArray(vpRaw)
                    ? vpRaw.filter((v) => !isExtraRowEntry(v))
                    : undefined

                  function getCellEntry(cellKey: string): string | undefined {
                    if (!vp) return cellKey // no vp = all visible, return plain key (= auto)
                    return vp.find(v => v === `s1:${cellKey}` || v.startsWith(`s1:${cellKey}#`) || v === cellKey || v.startsWith(cellKey + "#"))
                  }
                  function isCellVisible(cellKey: string): boolean {
                    if (!vp) return true
                    return !!vp.find(v => v === `s1:${cellKey}` || v.startsWith(`s1:${cellKey}#`) || v === cellKey || v.startsWith(cellKey + "#"))
                  }
                  function getCellOverride(cellKey: string): string {
                    const entry = getCellEntry(cellKey)
                    if (!entry) return "__auto__"
                    const idx = entry.indexOf("#")
                    return idx >= 0 ? entry.substring(idx + 1) : "__auto__"
                  }
                  function setCellEntry(cellKey: string, visible: boolean, override: string = "__auto__") {
                    const base: string[] = vp ? [...vp] : [...ALL_KEYS]
                    const filtered = base.filter(v => v !== cellKey && !v.startsWith(cellKey + "#") && v !== `s1:${cellKey}` && !v.startsWith(`s1:${cellKey}#`))
                    if (!visible) {
                      setEditedTour((prev) => ({
                        ...prev,
                        visible_prices: mergeVisibleWithExtraRows(
                          filtered.length === 0 ? undefined : filtered,
                          prev.visible_prices
                        ),
                      }))
                      return
                    }
                    const scoped = `s1:${cellKey}`
                    const entry = override === "__auto__" ? scoped : `${scoped}#${override}`
                    const next = [...filtered, entry]
                    setEditedTour((prev) => ({
                      ...prev,
                      visible_prices: mergeVisibleWithExtraRows(next, prev.visible_prices),
                    }))
                  }

                  return (
                    <div key={sectionDef.key} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 space-y-2">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${sectionDef.badge}`}>
                        {sectionDef.label}
                      </div>
                      {sectionDef.rowDefs.map(rowDef => {
                        const cellKey = `${sectionDef.key}:${rowDef.id}`
                        const visible = isCellVisible(cellKey)
                        const override = getCellOverride(cellKey)
                        // Coluna usada ao escolher uma linha específica. Para "Melhor Idade" usa
                        // o preço de adulto (BTMS não-normalizado), permitindo escolher qualquer preço.
                        const ovCampo = rowDef.overrideCampo
                        // Options: ALL rows (including those where the value is null/0)
                        // Sorted: rows WITH a value for the override column first, then rows without
                        const allOpts = allPriceRows
                        const opts = [
                          ...allOpts.filter(r => Number(r[ovCampo]) > 0),
                          ...allOpts.filter(r => !(Number(r[ovCampo]) > 0)),
                        ]
                        // Modo do seletor: auto, manual ou uma linha do BTMS
                        const isManual = isManualOverride(override)
                        const manualValue = isManual ? parseManualOverride(override) : null
                        const selectMode = override === "__auto__" ? "__auto__" : (isManual ? "__manual__" : override)
                        // Compute current display value
                        let displayVal: string | null = "—"
                        if (isManual) {
                          displayVal = fmtBRL(manualValue) ?? "—"
                        } else if (override !== "__auto__") {
                          const [tabela, atividade] = override.split("#")
                          const row = allPriceRows.find(r => r.nomeTabela === tabela && r.atividade === atividade)
                          displayVal = fmtBRL(row?.[ovCampo]) ?? "—"
                        } else {
                          const autoRow = sectionDef.key === "baixa" ? (editedTour.prices?.baixaRow ?? null) : (editedTour.prices?.mainPriceRow ?? null)
                          displayVal = fmtBRL(autoRow?.[rowDef.campo]) ?? "—"
                        }
                        return (
                          <div key={rowDef.id} className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                            {/* Checkbox show/hide */}
                            <div className="flex items-center gap-2 shrink-0">
                              <Checkbox
                                id={`vp-${sectionDef.key}-${rowDef.id}-${tour.id}`}
                                checked={visible}
                                onCheckedChange={(c) => setCellEntry(cellKey, !!c, override)}
                              />
                              <div className="flex flex-col min-w-0 w-20">
                                <label
                                  htmlFor={`vp-${sectionDef.key}-${rowDef.id}-${tour.id}`}
                                  className={`text-xs font-medium leading-none cursor-pointer ${visible ? "text-gray-700" : "text-gray-400 line-through"}`}
                                >
                                  {rowDef.label}
                                </label>
                                <span className="text-[9px] text-gray-300 leading-tight mt-0.5">{(rowDef as any).dbCol}</span>
                              </div>
                            </div>
                            {/* Per-cell value picker */}
                            <Select
                              value={selectMode}
                              onValueChange={(val) => {
                                if (val === "__manual__") setCellEntry(cellKey, true, buildManualOverride(manualValue ?? 0))
                                else setCellEntry(cellKey, true, val)
                              }}
                            >
                              <SelectTrigger className="h-7 flex-1 text-[11px] border-gray-200 bg-white px-2 gap-1 rounded-md min-w-0">
                                <SelectValue>
                                  <span className={displayVal !== "—" ? "text-green-700 font-medium" : "text-gray-400"}>
                                    {selectMode === "__manual__" ? (displayVal !== "—" ? `${displayVal} (manual)` : "✏️ Valor manual") : displayVal}
                                  </span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__auto__">
                                  <div className="flex items-center justify-between gap-3 w-full">
                                    <span className="text-gray-400 italic text-[11px]">↺ Automático</span>
                                    {sectionDef.key === "baixa"
                                      ? (fmtBRL(editedTour.prices?.baixaRow?.[rowDef.campo]) && <span className="text-gray-500 text-[10px]">{fmtBRL(editedTour.prices?.baixaRow?.[rowDef.campo])}</span>)
                                      : (fmtBRL(editedTour.prices?.mainPriceRow?.[rowDef.campo]) && <span className="text-gray-500 text-[10px]">{fmtBRL(editedTour.prices?.mainPriceRow?.[rowDef.campo])}</span>)
                                    }
                                  </div>
                                </SelectItem>
                                <SelectItem value="__manual__">
                                  <span className="text-[11px] text-indigo-600 font-medium">✏️ Colocar valor manual</span>
                                </SelectItem>
                                {opts.map((r, i) => {
                                  const optKey = `${r.nomeTabela}#${r.atividade}`
                                  const rawVal = r[ovCampo]
                                  const val = fmtBRL(rawVal)
                                  const name = r.atividadeAmigavel ?? r.atividade ?? r.nomeTabela
                                  const prevHadVal = i > 0 && Number(opts[i-1]?.[ovCampo]) > 0
                                  const thisHasVal = Number(rawVal) > 0
                                  const showSep = !thisHasVal && prevHadVal
                                  return (
                                    <React.Fragment key={`${optKey}|${i}`}>
                                      {showSep && <SelectSeparator />}
                                      <SelectItem value={optKey}>
                                        <div className="flex items-center justify-between gap-3 w-full">
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] text-gray-800 font-medium truncate max-w-[130px]">{name}</span>
                                            <span className="text-[9px] text-gray-400 truncate max-w-[130px]">{r.nomeTabela}</span>
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
                            </div>
                            {isManual && (
                              <div className="flex items-center gap-2 pl-7">
                                <span className="text-[10px] text-indigo-400 shrink-0">Valor manual (R$)</span>
                                <Input
                                  key={`manual-${cellKey}`}
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  defaultValue={manualValue ?? ""}
                                  placeholder="Ex: 199.90"
                                  onBlur={(e) => setCellEntry(cellKey, true, buildManualOverride(e.target.value === "" ? 0 : e.target.value))}
                                  className="h-7 flex-1 text-[11px] border-indigo-200 bg-white"
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {/* Tarifas Especiais (MS / Bonitense) — permite um valor de Alta E um de Baixa */}
                <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 space-y-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-gray-100 border-gray-200 text-gray-600">
                    Tarifas Especiais
                  </span>
                  {([
                    { id: "ms",        label: "MS" },
                    { id: "bonitense", label: "Bonitense" },
                  ] as const).map(g => {
                    // Use allAtivRows (no filter) — all rows from this atrativo
                    const allPriceRows: any[] = allAtivRows.length > 0 ? allAtivRows : (editedTour.prices?.rows ?? [])
                    const S1_KEYS = ["s1:baixa:adulto","s1:baixa:crianca","s1:baixa:senior","s1:alta:adulto","s1:alta:crianca","s1:alta:senior","s1:ms","s1:bonitense"]
                    const LEGACY_KEYS = ["baixa:adulto","baixa:crianca","baixa:senior","alta:adulto","alta:crianca","alta:senior","ms","bonitense"]
                    const ALL_KEYS = [...S1_KEYS, ...LEGACY_KEYS]
                    const vpRaw2 = editedTour.visible_prices
                    const vp = Array.isArray(vpRaw2)
                      ? vpRaw2.filter((v) => !isExtraRowEntry(v))
                      : undefined
                    const opts = [
                      ...allPriceRows.filter(r => Number(r.adulto) > 0),
                      ...allPriceRows.filter(r => !(Number(r.adulto) > 0)),
                    ]
                    const fmtBRL = (v: any) => { const n = Number(v); return n > 0 ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : null }
                    const autoRow: any = g.id === "ms" ? editedTour.prices?.msRow : editedTour.prices?.bonitenseRow
                    const rowFromOverride = (override: string) => {
                      if (override === "__auto__") return autoRow
                      const manual = parseManualOverride(override)
                      if (manual != null) return { adulto: manual }
                      const [tabela, atividade] = override.split("#")
                      return allPriceRows.find(r => r.nomeTabela === tabela && r.atividade === atividade)
                    }

                    // Estado atual de um slot (temporada), espelhando a lógica do site
                    const readSlot = (seasonKey: SpecialSeason): { visible: boolean; override: string } => {
                      if (!vp) {
                        const inferred = autoRow ? inferSpecialSeason(autoRow) : null
                        return { visible: inferred === seasonKey, override: "__auto__" }
                      }
                      let seasonOverride: string | null | undefined = undefined
                      let legacyOverride: string | null | undefined = undefined
                      for (const v of vp) {
                        const p = parseSpecialEntry(v, g.id, "s1")
                        if (!p) continue
                        if (p.season === seasonKey) { seasonOverride = p.override; break }
                        if (p.season === null && legacyOverride === undefined) legacyOverride = p.override
                      }
                      if (seasonOverride !== undefined) return { visible: true, override: seasonOverride ?? "__auto__" }
                      if (legacyOverride !== undefined) {
                        const row = rowFromOverride(legacyOverride ?? "__auto__")
                        if (row && inferSpecialSeason(row) === seasonKey) return { visible: true, override: legacyOverride ?? "__auto__" }
                      }
                      return { visible: false, override: "__auto__" }
                    }

                    // Remove todas as entradas desta tarifa (qualquer temporada / legado)
                    const stripTariff = (arr: string[]) => arr.filter(v => {
                      let s = v
                      if (s.startsWith("s1:") || s.startsWith("s2:")) s = s.substring(3)
                      return !(s === g.id || s.startsWith(g.id + ":") || s.startsWith(g.id + "#"))
                    })

                    // Define um slot, migrando a tarifa para chaves explícitas por temporada
                    const setSlot = (seasonKey: SpecialSeason, visible: boolean, override: string) => {
                      const altaState = seasonKey === "alta" ? { visible, override } : readSlot("alta")
                      const baixaState = seasonKey === "baixa" ? { visible, override } : readSlot("baixa")
                      const base = stripTariff(vp ? [...vp] : [...ALL_KEYS])
                      const next = [...base]
                      if (altaState.visible) next.push(buildSpecialKey(g.id, "alta", altaState.override))
                      if (baixaState.visible) next.push(buildSpecialKey(g.id, "baixa", baixaState.override))
                      setEditedTour((prev) => ({
                        ...prev,
                        visible_prices: mergeVisibleWithExtraRows(next.length ? next : undefined, prev.visible_prices),
                      }))
                    }

                    return (
                      <div key={g.id} className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-gray-600">{g.label}</div>
                        {([
                          { key: "alta" as const,  label: "Alta",  labelCls: "text-orange-600" },
                          { key: "baixa" as const, label: "Baixa", labelCls: "text-blue-600" },
                        ]).map(s => {
                          const slot = readSlot(s.key)
                          const isManual = isManualOverride(slot.override)
                          const manualValue = isManual ? parseManualOverride(slot.override) : null
                          const selectMode = slot.override === "__auto__" ? "__auto__" : (isManual ? "__manual__" : slot.override)
                          const displayVal = fmtBRL(rowFromOverride(slot.override)?.adulto) ?? "—"
                          return (
                            <div key={s.key} className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 shrink-0">
                                <Checkbox
                                  id={`vp-${g.id}-${s.key}-${tour.id}`}
                                  checked={slot.visible}
                                  onCheckedChange={(c) => setSlot(s.key, !!c, slot.override)}
                                />
                                <label htmlFor={`vp-${g.id}-${s.key}-${tour.id}`} className={`text-[11px] font-medium leading-none cursor-pointer w-12 ${slot.visible ? s.labelCls : "text-gray-400 line-through"}`}>
                                  {s.label}
                                </label>
                              </div>
                              <Select value={selectMode} onValueChange={(val) => {
                                if (val === "__manual__") setSlot(s.key, true, buildManualOverride(manualValue ?? 0))
                                else setSlot(s.key, true, val)
                              }}>
                                <SelectTrigger className="h-7 flex-1 text-[11px] border-gray-200 bg-white px-2 gap-1 rounded-md min-w-0">
                                  <SelectValue>
                                    <span className={displayVal !== "—" ? "text-green-700 font-medium" : "text-gray-400"}>{selectMode === "__manual__" ? (displayVal !== "—" ? `${displayVal} (manual)` : "✏️ Valor manual") : displayVal}</span>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__auto__">
                                    <div className="flex items-center justify-between gap-3 w-full">
                                      <span className="text-gray-400 italic text-[11px]">↺ Automático</span>
                                      {fmtBRL(autoRow?.adulto) && <span className="text-gray-500 text-[10px]">{fmtBRL(autoRow?.adulto)}</span>}
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="__manual__">
                                    <span className="text-[11px] text-indigo-600 font-medium">✏️ Colocar valor manual</span>
                                  </SelectItem>
                                  {isLoadingAtivRows ? (
                                    <div className="py-2 text-center text-[11px] text-gray-400">Carregando...</div>
                                  ) : (
                                    opts.map((r, i) => {
                                      const optKey = `${r.nomeTabela}#${r.atividade}`
                                      const rawVal = r.adulto
                                      const val = fmtBRL(rawVal)
                                      const name = r.atividadeAmigavel ?? r.atividade ?? r.nomeTabela
                                      const prevHadVal = i > 0 && Number(opts[i-1]?.adulto) > 0
                                      const thisHasVal = Number(rawVal) > 0
                                      const showSep = !thisHasVal && prevHadVal
                                      return (
                                        <React.Fragment key={`${g.id}-${s.key}-${optKey}|${i}`}>
                                          {showSep && <SelectSeparator />}
                                          <SelectItem value={optKey}>
                                            <div className="flex items-center justify-between gap-3 w-full">
                                              <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] text-gray-800 font-medium truncate max-w-[130px]">{name}</span>
                                                <span className="text-[9px] text-gray-400 truncate max-w-[130px]">{r.nomeTabela}</span>
                                              </div>
                                              <span className={`text-[11px] font-bold shrink-0 ${val ? "text-green-700" : "text-gray-300"}`}>
                                                {val ?? "—"}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        </React.Fragment>
                                      )
                                    })
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            {isManual && (
                              <div className="flex items-center gap-2 pl-7">
                                <span className="text-[10px] text-indigo-400 shrink-0">Valor manual (R$)</span>
                                <Input
                                  key={`manual-${g.id}-${s.key}`}
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  defaultValue={manualValue ?? ""}
                                  placeholder="Ex: 86.00"
                                  onBlur={(e) => setSlot(s.key, true, buildManualOverride(e.target.value === "" ? 0 : e.target.value))}
                                  className="h-7 flex-1 text-[11px] border-indigo-200 bg-white"
                                />
                              </div>
                            )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>

                <AdminPriceExtraRows
                  tour={editedTour}
                  allPriceRows={allAtivRows.length > 0 ? allAtivRows : (editedTour.prices?.rows ?? [])}
                  editedVisiblePrices={
                    Array.isArray(editedTour.visible_prices) ? editedTour.visible_prices : undefined
                  }
                  onVisiblePricesChange={(next) =>
                    setEditedTour((prev) => ({ ...prev, visible_prices: next }))
                  }
                />
              </div>

            </div>
          </>

        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{tour.description}</p>
            <div className="flex items-center justify-between gap-2">
              <div>
                {(() => {
                  const isManual = tour.manual_price != null && tour.manual_price > 0
                  const displayPrice = getDisplayPrice(tour)
                  if (isManual) return (
                    <>
                      <div className="text-xs text-amber-500 mb-0.5 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Valor Manual
                      </div>
                      <div className="text-xl font-bold text-amber-700">
                        {tour.manual_price!.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </>
                  )
                  if (displayPrice > 0) return (
                    <>
                      <div className="text-xs text-gray-400 mb-0.5">
                        {tour.preferred_price_atividade ? "Valor fixado" : "A partir de (Alta Temp.)"}
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        {displayPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </>
                  )
                  return (
                    <div className="text-lg font-bold text-gray-400">Sem preço vinculado</div>
                  )
                })()}
              </div>
              <div className="text-right shrink-0">
                {tour.btms_atrativo_override && (
                  <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                    <Link2 className="w-3 h-3" />
                    Vinculado
                  </div>
                )}
                {tour.preferred_price_atividade && (
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Ref: {tour.preferred_price_atividade}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
