"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Save, X, Star } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import type { Attraction } from "@/components/attractions-section"
import { htmlToPlainText } from "@/lib/text-format"

interface AdminAttractionCardProps {
  attraction: Attraction
  onUpdate: (attraction: Attraction) => void
  onDelete: (attractionId: string) => void
}

export function AdminAttractionCard({ attraction, onUpdate, onDelete }: AdminAttractionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAttraction, setEditedAttraction] = useState<Attraction>(attraction)

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
      case "gastronomy":
        return "Gastronomia"
      case "accommodation":
        return "Hospedagem"
      case "transport":
        return "Transporte"
      case "events":
        return "Eventos"
      default:
        return "Gastronomia"
    }
  }

  const getCategoryColor = (category: Attraction["category"]) => {
    switch (category) {
      case "gastronomy":
        return "bg-orange-100 text-orange-800"
      case "accommodation":
        return "bg-blue-100 text-blue-800"
      case "transport":
        return "bg-purple-100 text-purple-800"
      case "events":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <SafeImage src={attraction.image} alt={attraction.title} fill className="object-cover" />
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(attraction.category)}`}
        >
          {getCategoryLabel(attraction.category)}
        </div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{attraction.rating}</span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedAttraction.title}
                onChange={(e) => setEditedAttraction({ ...editedAttraction, title: e.target.value })}
                className="font-bold text-lg"
              />
            ) : (
              <h3 className="font-bold text-lg line-clamp-2">{attraction.title}</h3>
            )}
          </div>
          <div className="flex space-x-2 ml-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
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

      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {isEditing ? (
          <>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editedAttraction.description}
                onChange={(e) => setEditedAttraction({ ...editedAttraction, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={editedAttraction.price}
                  onChange={(e) => setEditedAttraction({ ...editedAttraction, price: e.target.value })}
                  placeholder="R$ 100"
                />
              </div>
              <div>
                <Label htmlFor="rating">Avaliação</Label>
                <Select
                  value={editedAttraction.rating.toString()}
                  onValueChange={(value) => setEditedAttraction({ ...editedAttraction, rating: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1.0</SelectItem>
                    <SelectItem value="2">2.0</SelectItem>
                    <SelectItem value="3">3.0</SelectItem>
                    <SelectItem value="4">4.0</SelectItem>
                    <SelectItem value="5">5.0</SelectItem>
                    <SelectItem value="4.5">4.5</SelectItem>
                    <SelectItem value="4.8">4.8</SelectItem>
                    <SelectItem value="4.9">4.9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={editedAttraction.location}
                  onChange={(e) => setEditedAttraction({ ...editedAttraction, location: e.target.value })}
                  placeholder="Centro de Bonito"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  value={editedAttraction.duration}
                  onChange={(e) => setEditedAttraction({ ...editedAttraction, duration: e.target.value })}
                  placeholder="2h"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                value={editedAttraction.capacity}
                onChange={(e) => setEditedAttraction({ ...editedAttraction, capacity: e.target.value })}
                placeholder="50 pessoas"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={editedAttraction.category}
                onValueChange={(value) =>
                  setEditedAttraction({ ...editedAttraction, category: value as Attraction["category"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{htmlToPlainText(attraction.description)}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Local:</span> {attraction.location}
              </div>
              <div>
                <span className="font-medium">Duração:</span> {attraction.duration}
              </div>
              <div>
                <span className="font-medium">Capacidade:</span> {attraction.capacity}
              </div>
              <div>
                <span className="font-medium">Avaliação:</span>{" "}
                <span className="inline-flex items-center gap-1">
                  {attraction.rating}
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xl font-bold text-green-600">{attraction.price}</div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(attraction.category)}`}>
                {getCategoryLabel(attraction.category)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
