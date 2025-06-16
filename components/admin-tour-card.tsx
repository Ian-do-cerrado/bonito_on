"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Save, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import type { Tour } from "@/components/tours-section"

interface AdminTourCardProps {
  tour: Tour
  onUpdate: (tour: Tour) => void
  onDelete: (tourId: string) => void
}

export function AdminTourCard({ tour, onUpdate, onDelete }: AdminTourCardProps) {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTour, setEditedTour] = useState<Tour>(tour)

  const handleSave = () => {
    onUpdate(editedTour)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTour(tour)
    setIsEditing(false)
  }

  const getCategoryLabel = (category: Tour["category"]) => {
    switch (category) {
      case "adventure":
        return t("adventure")
      case "contemplation":
        return t("contemplation")
      case "cave":
        return t("cave")
      case "waterfall":
        return t("waterfall")
      case "rappelling":
        return t("rappelling")
      case "horseback":
        return t("horseback")
      case "biking":
        return t("biking")
      case "scubaDiving":
        return t("scubaDiving")
      case "resort":
        return t("resort")
      default:
        return t("adventure")
    }
  }

  const getCategoryColor = (category: Tour["category"]) => {
    switch (category) {
      case "adventure":
        return "bg-red-100 text-red-800"
      case "contemplation":
        return "bg-blue-100 text-blue-800"
      case "cave":
        return "bg-blue-100 text-blue-800"
      case "waterfall":
        return "bg-cyan-100 text-cyan-800"
      case "rappelling":
        return "bg-purple-100 text-purple-800"
      case "horseback":
        return "bg-amber-100 text-amber-800"
      case "biking":
        return "bg-lime-100 text-lime-800"
      case "scubaDiving":
        return "bg-indigo-100 text-indigo-800"
      case "resort":
        return "bg-green-100 text-green-800"
      case "floating":
        return "bg-green-100 text-green-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
            tour.category,
          )}`}
        >
          {getCategoryLabel(tour.category)}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedTour.title}
                onChange={(e) => setEditedTour({ ...editedTour, title: e.target.value })}
                className="font-bold text-lg"
              />
            ) : (
              <h3 className="font-bold text-lg line-clamp-2">{tour.title}</h3>
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
            <div>
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                value={editedTour.description}
                onChange={(e) => setEditedTour({ ...editedTour, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">{t("price")}</Label>
                <Input
                  id="price"
                  type="number"
                  value={editedTour.price}
                  onChange={(e) => setEditedTour({ ...editedTour, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="rating">{t("rating")}</Label>
                <Select
                  value={editedTour.rating.toString()}
                  onValueChange={(value) => setEditedTour({ ...editedTour, rating: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 estrela</SelectItem>
                    <SelectItem value="2">2 estrelas</SelectItem>
                    <SelectItem value="3">3 estrelas</SelectItem>
                    <SelectItem value="4">4 estrelas</SelectItem>
                    <SelectItem value="5">5 estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">{t("category")}</Label>
              <Select
                value={editedTour.category}
                onValueChange={(value) => setEditedTour({ ...editedTour, category: value as Tour["category"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventure">{t("adventure")}</SelectItem>
                  <SelectItem value="contemplation">{t("contemplation")}</SelectItem>
                  <SelectItem value="waterfall">{t("waterfall")}</SelectItem>
                  <SelectItem value="rappelling">{t("rappelling")}</SelectItem>
                  <SelectItem value="horseback">{t("horseback")}</SelectItem>
                  <SelectItem value="biking">{t("biking")}</SelectItem>
                  <SelectItem value="scubaDiving">{t("scubaDiving")}</SelectItem>
                  <SelectItem value="resort">{t("resort")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image">{t("imageUrl")}</Label>
              <Input
                id="image"
                value={editedTour.image}
                onChange={(e) => setEditedTour({ ...editedTour, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{tour.description}</p>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-green-600">R$ {tour.price.toFixed(2).replace(".", ",")}</div>
              <div className="text-sm text-gray-500">{tour.rating} ⭐</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
