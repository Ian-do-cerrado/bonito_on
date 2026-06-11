"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Save, X, Plus, Minus, Clock, Users, Languages, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import type { Package } from "@/types/package"

interface AdminPackageCardProps {
  package: Package
  onUpdate: (pkg: Package) => void
  onDelete: (packageId: string) => void
}

export function AdminPackageCard({ package: pkg, onUpdate, onDelete }: AdminPackageCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPackage, setEditedPackage] = useState<Package>(pkg)
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!editedPackage.title || !editedPackage.description) return
    
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedPackage.title,
            subtitle: editedPackage.subtitle || "",
            description: editedPackage.description
          },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedPackage.title,
            subtitle: editedPackage.subtitle || "",
            description: editedPackage.description
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
      
      setEditedPackage(prev => ({
        ...prev,
        title_en: dataEn.results.title || prev.title_en,
        subtitle_en: dataEn.results.subtitle || prev.subtitle_en,
        description_en: dataEn.results.description || prev.description_en,
        title_es: dataEs.results.title || prev.title_es,
        subtitle_es: dataEs.results.subtitle || prev.subtitle_es,
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

  const handleSave = () => {
    onUpdate(editedPackage)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedPackage(pkg)
    setIsEditing(false)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "economico": return "Econômico"
      case "premium": return "Premium"
      case "luxo": return "Luxo"
      default: return "Padrão"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economico": return "bg-blue-100 text-blue-800"
      case "premium": return "bg-purple-100 text-purple-800"
      case "luxo": return "bg-amber-100 text-amber-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleHighlightsChange = (highlightsString: string) => {
    const highlights = highlightsString.split(",").map(h => h.trim()).filter(Boolean)
    setEditedPackage({ ...editedPackage, highlights })
  }

  const handleIncludedChange = (includedString: string) => {
    const included = includedString.split(",").map(h => h.trim()).filter(Boolean)
    setEditedPackage({ ...editedPackage, included })
  }

  const handleBestSeasonChange = (seasonString: string) => {
    const bestSeason = seasonString.split(",").map(h => h.trim()).filter(Boolean)
    setEditedPackage({ ...editedPackage, bestSeason })
  }

  const addItineraryDay = () => {
    const newDay = {
      day: editedPackage.itinerary.length + 1,
      title: "",
      activities: [],
      meals: [],
    }
    setEditedPackage({
      ...editedPackage,
      itinerary: [...editedPackage.itinerary, newDay],
    })
  }

  const removeItineraryDay = (index: number) => {
    const newItinerary = editedPackage.itinerary.filter((_, i) => i !== index)
    const renumberedItinerary = newItinerary.map((day, i) => ({ ...day, day: i + 1 }))
    setEditedPackage({ ...editedPackage, itinerary: renumberedItinerary })
  }

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newItinerary = [...editedPackage.itinerary]
    if (field === "activities" || field === "meals") {
      newItinerary[index] = {
        ...newItinerary[index],
        [field]: value.split(",").map((item: string) => item.trim()).filter(Boolean),
      }
    } else {
      newItinerary[index] = { ...newItinerary[index], [field]: value }
    }
    setEditedPackage({ ...editedPackage, itinerary: newItinerary })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
        <div className="absolute top-2 left-2">
          <Badge className={getCategoryColor(pkg.category)}>{getCategoryLabel(pkg.category)}</Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/50 text-white border-0">
            <Clock className="w-3 h-3 mr-1" />
            {pkg.duration}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {!isEditing && (
              <div>
                <h3 className="font-bold text-lg line-clamp-2">{pkg.title}</h3>
                <p className="text-sm text-gray-600">{pkg.subtitle}</p>
              </div>
            )}
          </div>
          <div className="flex space-x-2 ml-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-1" /> Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(pkg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
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
                  Traduzir Auto
                </Button>
              </div>

              <TabsContent value="pt" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (PT)</Label>
                  <Input
                    value={editedPackage.title}
                    onChange={(e) => setEditedPackage({ ...editedPackage, title: e.target.value })}
                    className="font-bold border-green-200"
                  />
                  <Label>Subtítulo (PT)</Label>
                  <Input
                    value={editedPackage.subtitle}
                    onChange={(e) => setEditedPackage({ ...editedPackage, subtitle: e.target.value })}
                  />
                  <Label>Descrição (PT)</Label>
                  <RichTextEditor
                    value={editedPackage.description || ""}
                    onChange={(val) => setEditedPackage({ ...editedPackage, description: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={editedPackage.title_en || ""}
                    onChange={(e) => setEditedPackage({ ...editedPackage, title_en: e.target.value })}
                  />
                  <Label>Subtitle (EN)</Label>
                  <Input
                    value={editedPackage.subtitle_en || ""}
                    onChange={(e) => setEditedPackage({ ...editedPackage, subtitle_en: e.target.value })}
                  />
                  <Label>Description (EN)</Label>
                  <RichTextEditor
                    value={editedPackage.description_en || ""}
                    onChange={(val) => setEditedPackage({ ...editedPackage, description_en: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="es" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (ES)</Label>
                  <Input
                    value={editedPackage.title_es || ""}
                    onChange={(e) => setEditedPackage({ ...editedPackage, title_es: e.target.value })}
                  />
                  <Label>Subtítulo (ES)</Label>
                  <Input
                    value={editedPackage.subtitle_es || ""}
                    onChange={(e) => setEditedPackage({ ...editedPackage, subtitle_es: e.target.value })}
                  />
                  <Label>Descripción (ES)</Label>
                  <RichTextEditor
                    value={editedPackage.description_es || ""}
                    onChange={(val) => setEditedPackage({ ...editedPackage, description_es: val })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={editedPackage.duration}
                    onChange={(e) => setEditedPackage({ ...editedPackage, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPeople">Máx. Pessoas</Label>
                  <Input
                    id="maxPeople"
                    type="number"
                    value={editedPackage.maxPeople}
                    onChange={(e) => setEditedPackage({ ...editedPackage, maxPeople: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editedPackage.price}
                    onChange={(e) => setEditedPackage({ ...editedPackage, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={editedPackage.originalPrice || ""}
                    onChange={(e) => setEditedPackage({ ...editedPackage, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={editedPackage.category}
                  onValueChange={(value) => setEditedPackage({ ...editedPackage, category: value as any })}
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
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={editedPackage.image}
                  onChange={(e) => setEditedPackage({ ...editedPackage, image: e.target.value })}
                />
              </div>

              <div>
                <Label>Destaques (separados por vírgula)</Label>
                <Textarea
                  value={(editedPackage.highlights || []).join(", ")}
                  onChange={(e) => handleHighlightsChange(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label>Incluído (separado por vírgula)</Label>
                <Textarea
                  value={(editedPackage.included || []).join(", ")}
                  onChange={(e) => handleIncludedChange(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label>Melhor Época (separada por vírgula)</Label>
                <Input
                  value={(Array.isArray(editedPackage.bestSeason) ? editedPackage.bestSeason : []).join(", ")}
                  onChange={(e) => handleBestSeasonChange(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-bold">Roteiro</Label>
                  <Button type="button" size="sm" onClick={addItineraryDay} className="bg-blue-600">
                    <Plus className="w-4 h-4 mr-1" /> Add Dia
                  </Button>
                </div>

                {editedPackage.itinerary.map((day, index) => (
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
                      placeholder="Atividades (vírgula)"
                    />
                    <Input
                      value={(day.meals || []).join(", ")}
                      onChange={(e) => updateItineraryDay(index, "meals", e.target.value)}
                      placeholder="Refeições (vírgula)"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{pkg.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1"><Users className="w-4 h-4" /> Até {pkg.maxPeople}</div>
              <div className="text-green-600 font-bold">R$ {pkg.price.toFixed(2).replace(".", ",")}</div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(pkg.highlights || []).slice(0, 3).map((h, i) => (
                <Badge key={i} variant="outline" className="text-[10px]">{h}</Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
