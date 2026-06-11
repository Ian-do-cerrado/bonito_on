"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, Languages, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Package } from "@/types/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (pkg: Omit<Package, "id">) => void
}

export function AddPackageDialog({ open, onOpenChange, onAdd }: AddPackageDialogProps) {
  const { t } = useLanguage()
  const [isTranslating, setIsTranslating] = useState(false)
  const [newPackage, setNewPackage] = useState<Omit<Package, "id">>({
    title: "",
    subtitle: "",
    description: "",
    title_en: "",
    subtitle_en: "",
    description_en: "",
    title_es: "",
    subtitle_es: "",
    description_es: "",
    price: 0,
    duration: "",
    category: "economico",
    image: "/placeholder.svg?height=300&width=400",
    highlights: [],
    included: [],
    itinerary: [],
    bestSeason: [],
    slug: "",
    maxPeople: 0,
  })

  const handleTranslate = async () => {
    if (!newPackage.title || !newPackage.description) return
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: newPackage.title,
            subtitle: newPackage.subtitle,
            description: newPackage.description
          },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: newPackage.title,
            subtitle: newPackage.subtitle,
            description: newPackage.description
          },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      setNewPackage(prev => ({
        ...prev,
        title_en: dataEn.results.title,
        subtitle_en: dataEn.results.subtitle,
        description_en: dataEn.results.description,
        title_es: dataEs.results.title,
        subtitle_es: dataEs.results.subtitle,
        description_es: dataEs.results.description
      }))
    } catch (error) {
      console.error("Erro na tradução:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPackage.title && newPackage.description && newPackage.price > 0) {
      const pkgWithSlug = {
        ...newPackage,
        slug: newPackage.slug || createSlug(newPackage.title)
      }
      onAdd(pkgWithSlug)
      onOpenChange(false)
    }
  }

  const handleHighlightsChange = (val: string) => {
    const highlights = val.split(",").map(h => h.trim()).filter(Boolean)
    setNewPackage({ ...newPackage, highlights })
  }

  const handleIncludedChange = (val: string) => {
    const included = val.split(",").map(i => i.trim()).filter(Boolean)
    setNewPackage({ ...newPackage, included })
  }

  const addItineraryDay = () => {
    const newDay = {
      day: newPackage.itinerary.length + 1,
      title: "",
      activities: [],
      meals: [],
    }
    setNewPackage({ ...newPackage, itinerary: [...newPackage.itinerary, newDay] })
  }

  const removeItineraryDay = (index: number) => {
    const updated = newPackage.itinerary.filter((_, i) => i !== index)
    const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }))
    setNewPackage({ ...newPackage, itinerary: renumbered })
  }

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const updated = [...newPackage.itinerary]
    if (field === "activities" || field === "meals") {
      updated[index] = { ...updated[index], [field]: value.split(",").map((v: string) => v.trim()).filter(Boolean) }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setNewPackage({ ...newPackage, itinerary: updated })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Pacote</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="pt">
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

            <TabsContent value="pt" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>Título (PT)</Label>
                <Input value={newPackage.title} onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })} required />
              </div>
              <div>
                <Label>Subtítulo (PT)</Label>
                <Input value={newPackage.subtitle} onChange={(e) => setNewPackage({ ...newPackage, subtitle: e.target.value })} />
              </div>
              <div>
                <Label>Descrição (PT)</Label>
                <RichTextEditor value={newPackage.description || ""} onChange={(val) => setNewPackage({ ...newPackage, description: val })} />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>Title (EN)</Label>
                <Input value={newPackage.title_en} onChange={(e) => setNewPackage({ ...newPackage, title_en: e.target.value })} />
              </div>
              <div>
                <Label>Subtitle (EN)</Label>
                <Input value={newPackage.subtitle_en} onChange={(e) => setNewPackage({ ...newPackage, subtitle_en: e.target.value })} />
              </div>
              <div>
                <Label>Description (EN)</Label>
                <RichTextEditor value={newPackage.description_en || ""} onChange={(val) => setNewPackage({ ...newPackage, description_en: val })} />
              </div>
            </TabsContent>

            <TabsContent value="es" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>Título (ES)</Label>
                <Input value={newPackage.title_es} onChange={(e) => setNewPackage({ ...newPackage, title_es: e.target.value })} />
              </div>
              <div>
                <Label>Subtítulo (ES)</Label>
                <Input value={newPackage.subtitle_es} onChange={(e) => setNewPackage({ ...newPackage, subtitle_es: e.target.value })} />
              </div>
              <div>
                <Label>Descripción (ES)</Label>
                <RichTextEditor value={newPackage.description_es || ""} onChange={(val) => setNewPackage({ ...newPackage, description_es: val })} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preço (R$)</Label>
              <Input type="number" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Preço Original (R$)</Label>
              <Input type="number" value={newPackage.originalPrice || ""} onChange={(e) => setNewPackage({ ...newPackage, originalPrice: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duração</Label>
              <Input value={newPackage.duration} onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })} />
            </div>
            <div>
              <Label>Máx. Pessoas</Label>
              <Input type="number" value={newPackage.maxPeople} onChange={(e) => setNewPackage({ ...newPackage, maxPeople: Number(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select
                value={newPackage.category}
                onValueChange={(value) => setNewPackage({ ...newPackage, category: value as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="economico">Econômico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxo">Luxo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input value={newPackage.slug} onChange={(e) => setNewPackage({ ...newPackage, slug: e.target.value })} placeholder="ex: pacote-bonito-essencial" />
            </div>
          </div>

          <div>
            <Label>URL da Imagem</Label>
            <Input value={newPackage.image} onChange={(e) => setNewPackage({ ...newPackage, image: e.target.value })} />
          </div>

          <div>
            <Label>Destaques (separados por vírgula)</Label>
            <Textarea
              value={newPackage.highlights.join(", ")}
              onChange={(e) => handleHighlightsChange(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>Incluído (separado por vírgula)</Label>
            <Textarea
              value={newPackage.included.join(", ")}
              onChange={(e) => handleIncludedChange(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>Melhor Época (separada por vírgula)</Label>
            <Input
              value={(Array.isArray(newPackage.bestSeason) ? newPackage.bestSeason : []).join(", ")}
              onChange={(e) => setNewPackage({ ...newPackage, bestSeason: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-bold">Roteiro</Label>
              <Button type="button" size="sm" onClick={addItineraryDay} className="bg-blue-600">
                <Plus className="w-4 h-4 mr-1" /> Add Dia
              </Button>
            </div>

            {newPackage.itinerary.map((day, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-bold">Dia {day.day}</Label>
                  <Button type="button" size="sm" variant="ghost" onClick={() => removeItineraryDay(index)}>
                    <Minus className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <Input
                  value={day.title}
                  onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                  placeholder="Título do dia"
                />
                <Input
                  value={day.activities.join(", ")}
                  onChange={(e) => updateItineraryDay(index, "activities", e.target.value)}
                  placeholder="Atividades (separadas por vírgula)"
                />
                <Input
                  value={(day.meals || []).join(", ")}
                  onChange={(e) => updateItineraryDay(index, "meals", e.target.value)}
                  placeholder="Refeições (separadas por vírgula)"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {t("add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
