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
import { Attraction } from "@/types/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Languages, Loader2 } from "lucide-react"

interface AddAttractionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (attraction: Omit<Attraction, "id">) => void
}

export function AddAttractionDialog({ open, onOpenChange, onAdd }: AddAttractionDialogProps) {
  const { t } = useLanguage()
  const [isTranslating, setIsTranslating] = useState(false)
  const [newAttraction, setNewAttraction] = useState<Omit<Attraction, "id">>({
    title: "",
    description: "",
    title_en: "",
    description_en: "",
    title_es: "",
    description_es: "",
    category: "gastronomy",
    image: "/placeholder.svg?height=300&width=400",
    location: "",
    slug: "",
    highlights: [],
    rating: 5,
  })

  const handleTranslate = async () => {
    if (!newAttraction.title || !newAttraction.description) return
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: { title: newAttraction.title, description: newAttraction.description },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: { title: newAttraction.title, description: newAttraction.description },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      setNewAttraction(prev => ({
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
    if (newAttraction.title && newAttraction.description) {
      onAdd(newAttraction)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Atração</DialogTitle>
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
                <Label>{t("title")} (PT)</Label>
                <Input
                  value={newAttraction.title}
                  onChange={(e) => setNewAttraction({ ...newAttraction, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>{t("description")} (PT)</Label>
                <RichTextEditor
                  value={newAttraction.description || ""}
                  onChange={(val) => setNewAttraction({ ...newAttraction, description: val })}
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>{t("title")} (EN)</Label>
                <Input
                  value={newAttraction.title_en}
                  onChange={(e) => setNewAttraction({ ...newAttraction, title_en: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("description")} (EN)</Label>
                <RichTextEditor
                  value={newAttraction.description_en || ""}
                  onChange={(val) => setNewAttraction({ ...newAttraction, description_en: val })}
                />
              </div>
            </TabsContent>

            <TabsContent value="es" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>{t("title")} (ES)</Label>
                <Input
                  value={newAttraction.title_es}
                  onChange={(e) => setNewAttraction({ ...newAttraction, title_es: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("description")} (ES)</Label>
                <RichTextEditor
                  value={newAttraction.description_es || ""}
                  onChange={(val) => setNewAttraction({ ...newAttraction, description_es: val })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t("category")}</Label>
              <Select
                value={newAttraction.category}
                onValueChange={(value) => setNewAttraction({ ...newAttraction, category: value as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gastronomy">{t("gastronomy")}</SelectItem>
                  <SelectItem value="accommodation">{t("accommodations")}</SelectItem>
                  <SelectItem value="transport">{t("transportation")}</SelectItem>
                  <SelectItem value="events">{t("events")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">{t("imageUrl")}</Label>
              <Input
                id="image"
                value={newAttraction.image}
                onChange={(e) => setNewAttraction({ ...newAttraction, image: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              value={newAttraction.location}
              onChange={(e) => setNewAttraction({ ...newAttraction, location: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
