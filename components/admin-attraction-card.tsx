"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Save, X, Languages, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Attraction } from "@/types/index"

interface AdminAttractionCardProps {
  attraction: Attraction
  onUpdate: (attraction: Attraction) => void
  onDelete: (attractionId: string) => void
}

export function AdminAttractionCard({ attraction, onUpdate, onDelete }: AdminAttractionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAttraction, setEditedAttraction] = useState<Attraction>(attraction)
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    if (!editedAttraction.title || !editedAttraction.description) return
    
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedAttraction.title,
            description: editedAttraction.description
          },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedAttraction.title,
            description: editedAttraction.description
          },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      setEditedAttraction(prev => ({
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

  const handleSave = () => {
    onUpdate(editedAttraction)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedAttraction(attraction)
    setIsEditing(false)
  }

  const getCategoryLabel = (category: Attraction["category"]) => {
    switch (category) {
      case "gastronomy": return "Gastronomia"
      case "accommodation": return "Hospedagem"
      case "transport": return "Transporte"
      case "events": return "Eventos"
      default: return "Gastronomia"
    }
  }

  const getCategoryColor = (category: Attraction["category"]) => {
    switch (category) {
      case "gastronomy": return "bg-orange-100 text-orange-800"
      case "accommodation": return "bg-blue-100 text-blue-800"
      case "transport": return "bg-purple-100 text-purple-800"
      case "events": return "bg-pink-100 text-pink-800"
      default: return "bg-orange-100 text-orange-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={attraction.image || "/placeholder.svg"} alt={attraction.title} fill className="object-cover" />
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(attraction.category)}`}>
          {getCategoryLabel(attraction.category)}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {!isEditing && <h3 className="font-bold text-lg line-clamp-2">{attraction.title}</h3>}
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
                <Button size="sm" variant="destructive" onClick={() => onDelete(attraction.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
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
                    value={editedAttraction.title}
                    onChange={(e) => setEditedAttraction({ ...editedAttraction, title: e.target.value })}
                    className="font-bold border-green-200"
                  />
                  <Label>Descrição (PT)</Label>
                  <RichTextEditor
                    value={editedAttraction.description || ""}
                    onChange={(val) => setEditedAttraction({ ...editedAttraction, description: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={editedAttraction.title_en || ""}
                    onChange={(e) => setEditedAttraction({ ...editedAttraction, title_en: e.target.value })}
                  />
                  <Label>Description (EN)</Label>
                  <RichTextEditor
                    value={editedAttraction.description_en || ""}
                    onChange={(val) => setEditedAttraction({ ...editedAttraction, description_en: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="es" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (ES)</Label>
                  <Input
                    value={editedAttraction.title_es || ""}
                    onChange={(e) => setEditedAttraction({ ...editedAttraction, title_es: e.target.value })}
                  />
                  <Label>Descripción (ES)</Label>
                  <RichTextEditor
                    value={editedAttraction.description_es || ""}
                    onChange={(val) => setEditedAttraction({ ...editedAttraction, description_es: val })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t space-y-4">
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={editedAttraction.price}
                  onChange={(e) => setEditedAttraction({ ...editedAttraction, price: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={editedAttraction.location}
                    onChange={(e) => setEditedAttraction({ ...editedAttraction, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={editedAttraction.duration}
                    onChange={(e) => setEditedAttraction({ ...editedAttraction, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={editedAttraction.category}
                  onValueChange={(value) => setEditedAttraction({ ...editedAttraction, category: value as Attraction["category"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gastronomy">Gastronomia</SelectItem>
                    <SelectItem value="accommodation">Hospedagem</SelectItem>
                    <SelectItem value="transport">Transporte</SelectItem>
                    <SelectItem value="events">Eventos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={editedAttraction.image}
                  onChange={(e) => setEditedAttraction({ ...editedAttraction, image: e.target.value })}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{attraction.description}</p>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mt-2">
              <div><span className="font-medium">Local:</span> {attraction.location}</div>
              <div><span className="font-medium">Duração:</span> {attraction.duration}</div>
            </div>
            <div className="text-xl font-bold text-green-600 mt-2">{attraction.price}</div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
