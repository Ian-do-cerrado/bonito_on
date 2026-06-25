"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Tour } from "@/types/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Languages, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { AdminTourPriceLinkForm, hasTourPricingConfigured } from "@/components/admin-tour-price-link-form"

interface AddTourDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (tour: Omit<Tour, "id">) => void
}

function createEmptyTour(): Omit<Tour, "id"> {
  return {
    title: "",
    description: "",
    title_en: "",
    description_en: "",
    title_es: "",
    description_es: "",
    price: 0,
    manual_price: null,
    btms_atrativo_override: undefined,
    preferred_price_atividade: undefined,
    preferred_price_tabela: undefined,
    image: "/placeholder.svg?height=300&width=400",
    category: "adventure",
    slug: "",
    highlights: [],
    included: [],
    duration: "",
    difficulty: "easy",
    location: "",
    bestSeason: "",
    maxGroupSize: 0,
  }
}

export function AddTourDialog({ open, onOpenChange, onAdd }: AddTourDialogProps) {
  const { t } = useLanguage()
  const [isTranslating, setIsTranslating] = useState(false)
  const [newTour, setNewTour] = useState<Omit<Tour, "id">>(createEmptyTour)

  const handleTranslate = async () => {
    if (!newTour.title || !newTour.description) return
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: { title: newTour.title, description: newTour.description },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: { title: newTour.title, description: newTour.description },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      setNewTour(prev => ({
        ...prev,
        title_en: dataEn.results.title,
        description_en: dataEn.results.description,
        title_es: dataEs.results.title,
        description_es: dataEs.results.description
      }))
    } catch (error) {
      console.error("Erro na tradução:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTour.title && newTour.description && hasTourPricingConfigured(newTour)) {
      onAdd(newTour)
      setNewTour(createEmptyTour())
      onOpenChange(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNewTour(createEmptyTour())
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addNewTour")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="pt">
            <div className="flex items-center justify-between mb-4">
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

            <TabsContent value="pt" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>{t("title")} (PT)</Label>
                <Input
                  value={newTour.title}
                  onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                  placeholder="Nome do item"
                  required
                />
              </div>
              <div>
                <Label>{t("description")} (PT)</Label>
                <RichTextEditor
                  value={newTour.description || ""}
                  onChange={(val) => setNewTour({ ...newTour, description: val })}
                  placeholder="Descrição..."
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>{t("title")} (EN)</Label>
                <Input
                  value={newTour.title_en}
                  onChange={(e) => setNewTour({ ...newTour, title_en: e.target.value })}
                  placeholder="Title in English"
                />
              </div>
              <div>
                <Label>{t("description")} (EN)</Label>
                <RichTextEditor
                  value={newTour.description_en || ""}
                  onChange={(val) => setNewTour({ ...newTour, description_en: val })}
                  placeholder="Description in English..."
                />
              </div>
            </TabsContent>

            <TabsContent value="es" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>{t("title")} (ES)</Label>
                <Input
                  value={newTour.title_es}
                  onChange={(e) => setNewTour({ ...newTour, title_es: e.target.value })}
                  placeholder="Título en Español"
                />
              </div>
              <div>
                <Label>{t("description")} (ES)</Label>
                <RichTextEditor
                  value={newTour.description_es || ""}
                  onChange={(val) => setNewTour({ ...newTour, description_es: val })}
                  placeholder="Descripción en Español..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <AdminTourPriceLinkForm
            active={open}
            value={{
              btms_atrativo_override: newTour.btms_atrativo_override,
              manual_price: newTour.manual_price,
              preferred_price_atividade: newTour.preferred_price_atividade,
              preferred_price_tabela: newTour.preferred_price_tabela,
              prices: newTour.prices,
            }}
            onChange={(updates) => setNewTour((prev) => ({ ...prev, ...updates }))}
          />

          <div>
            <Label htmlFor="category">{t("category")}</Label>
            <Select
              value={newTour.category}
              onValueChange={(value) => setNewTour({ ...newTour, category: value as Tour["category"] })}
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
              id="image"
              value={newTour.image}
              onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">{t("location")}</Label>
              <Input
                id="location"
                value={newTour.location || ""}
                onChange={(e) => setNewTour({ ...newTour, location: e.target.value })}
                placeholder="Ex: Bonito, MS"
              />
            </div>
            <div>
              <Label htmlFor="duration">{t("duration")}</Label>
              <Input
                id="duration"
                value={newTour.duration || ""}
                onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
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
              value={newTour.maxGroupSize ?? 0}
              onChange={(e) => setNewTour({ ...newTour, maxGroupSize: Number(e.target.value) })}
              placeholder="Ex: 15"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label>Itens Incluídos</Label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "includedGuide", label: t("includedGuide") },
                { id: "includedEquipment", label: t("includedEquipment") },
                { id: "includedInsurance", label: t("includedInsurance") },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`new-included-${item.id}`}
                    checked={newTour.included?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      const current = newTour.included || []
                      if (checked) {
                        setNewTour({ ...newTour, included: [...current, item.id] })
                      } else {
                        setNewTour({ ...newTour, included: current.filter(id => id !== item.id) })
                      }
                    }}
                  />
                  <Label htmlFor={`new-included-${item.id}`} className="cursor-pointer font-normal">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {t("addTour")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
