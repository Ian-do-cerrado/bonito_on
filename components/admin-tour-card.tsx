"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Save, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import type { DatabaseTour } from "@/lib/supabase/types" // Use DatabaseTour

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface AdminTourCardProps {
  tour: DatabaseTour
  onUpdate: (tour: DatabaseTour) => void
  onDelete: (tourId: string) => void
}

export function AdminTourCard({ tour, onUpdate, onDelete }: AdminTourCardProps) {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTour, setEditedTour] = useState<DatabaseTour>(tour)

  const handleSave = () => {
    onUpdate(editedTour)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTour(tour)
    setIsEditing(false)
  }

  const getCategoryLabel = (category: DatabaseTour["category"]) => {
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
      case "floating":
        return t("floating")
      case "pantanal":
        return t("pantanal")
      default:
        return t("adventure")
    }
  }

  const getCategoryColor = (category: DatabaseTour["category"]) => {
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
        return "bg-blue-100 text-blue-800"
      case "pantanal":
        return "bg-yellow-100 text-yellow-800"
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
              <ReactQuill
                theme="snow"
                value={editedTour.description}
                onChange={(value) => setEditedTour({ ...editedTour, description: value })}
                className="h-32 mb-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço baixa Temporada</Label>
                <Input
                  id="price"
                  type="number"
                  value={editedTour.price}
                  onChange={(e) => setEditedTour({ ...editedTour, price: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="price_high_season">Preço Alta Temporada</Label>
                <Input
                  id="price_high_season"
                  type="number"
                  value={editedTour.price_high_season ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_high_season: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_child">Preço Criança</Label>
                <Input
                  id="price_child"
                  type="number"
                  value={editedTour.price_child ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_child: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="price_senior">Preço Melhor Idade</Label>
                <Input
                  id="price_senior"
                  type="number"
                  value={editedTour.price_senior ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_senior: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_ms">Preço MS</Label>
                <Input
                  id="price_ms"
                  type="number"
                  value={editedTour.price_ms ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_ms: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_ms_low_season">Preço MS Baixa temporada</Label>
                <Input
                  id="price_ms_low_season"
                  type="number"
                  value={editedTour.price_ms_low_season ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_ms_low_season: Number(e.target.value) || null })}
                />
              </div>
              <div>
                <Label htmlFor="price_ms_high_season">Preço MS Alta temporada</Label>
                <Input
                  id="price_ms_high_season"
                  type="number"
                  value={editedTour.price_ms_high_season ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_ms_high_season: Number(e.target.value) || null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_child_low_season">Preço Criança Baixa temporada</Label>
                <Input
                  id="price_child_low_season"
                  type="number"
                  value={editedTour.price_child_low_season ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_child_low_season: Number(e.target.value) || null })}
                />
              </div>
              <div>
                <Label htmlFor="price_child_high_season">Preço Criança Alta temporada</Label>
                <Input
                  id="price_child_high_season"
                  type="number"
                  value={editedTour.price_child_high_season ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_child_high_season: Number(e.target.value) || null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_high_season">Preço Alta Temporada</Label>
                <Input
                  id="price_senior_high_season"
                  type="number"
                  value={editedTour.price_senior_high_season ?? ""}
                  onChange={(e) =>
                    setEditedTour({ ...editedTour, price_senior_high_season: Number(e.target.value) || null })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="min_child_age">Idade Mínima Criança Pagante</Label>
              <Input
                id="min_child_age"
                type="number"
                value={editedTour.min_child_age ?? ""}
                onChange={(e) => setEditedTour({ ...editedTour, min_child_age: Number(e.target.value) || null })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="category">{t("category")}</Label>
              <Select
                value={editedTour.category}
                onValueChange={(value) =>
                  setEditedTour({ ...editedTour, category: value as DatabaseTour["category"] })
                }
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
                  <SelectItem value="floating">{t("floating")}</SelectItem>
                  <SelectItem value="pantanal">{t("pantanal")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image">{t("imageUrl")}</Label>
              <Input
                id="image"
                value={editedTour.image ?? ""}
                onChange={(e) => setEditedTour({ ...editedTour, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={editedTour.duration || ""}
                onChange={(e) => setEditedTour({ ...editedTour, duration: e.target.value })}
                placeholder="Ex: Meio dia"
              />
            </div>
            <div>
              <Label htmlFor="gallery">Galeria (URLs separadas por vírgula)</Label>
              <Input
                id="gallery"
                value={editedTour.gallery?.join(", ") || ""}
                onChange={(e) =>
                  setEditedTour({
                    ...editedTour,
                    gallery: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [],
                  })
                }
                placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg"
              />
            </div>
          </>
        ) : (
          <>
            <div
              className="text-gray-600 text-sm line-clamp-3"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            ></div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-green-600">
                R$ {tour.price !== null ? tour.price.toFixed(2).replace(".", ",") : "N/A"}
              </div>
              <div className="text-sm text-gray-500">{tour.rating} ⭐</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              {tour.price_ms_low_season !== null && tour.price_ms_low_season !== undefined && (
                <div>
                  <strong>Preço MS Baixa Temp.:</strong> R$
                  {tour.price_ms_low_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_ms_high_season !== null && tour.price_ms_high_season !== undefined && (
                <div>
                  <strong>Preço MS Alta Temp.:</strong> R$
                  {tour.price_ms_high_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_child_low_season !== null && tour.price_child_low_season !== undefined && (
                <div>
                  <strong>Criança Baixa Temp.:</strong> R$
                  {tour.price_child_low_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_child_high_season !== null && tour.price_child_high_season !== undefined && (
                <div>
                  <strong>Criança Alta Temp.:</strong> R$
                  {tour.price_child_high_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_high_season !== null && tour.price_high_season !== undefined && (
                <div>
                  <strong>Alta Temp.:</strong> R$ {tour.price_high_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_senior_low_season !== null && tour.price_senior_low_season !== undefined && (
                <div>
                  <strong>Melhor Idade Baixa Temp.:</strong> R$
                  {tour.price_senior_low_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_senior_high_season !== null && tour.price_senior_high_season !== undefined && (
                <div>
                  <strong>Melhor Idade Alta Temp.:</strong> R$
                  {tour.price_senior_high_season.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_child !== null && tour.price_child !== undefined && (
                <div>
                  <strong>Preço Criança:</strong> R$ {tour.price_child.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_senior !== null && tour.price_senior !== undefined && (
                <div>
                  <strong>Preço Melhor Idade:</strong> R$ {tour.price_senior.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_ms !== null && tour.price_ms !== undefined && (
                <div>
                  <strong>Preço MS:</strong> R$ {tour.price_ms.toFixed(2).replace(".", ",")}
                </div>
              )}
            </div>
            {tour.duration && (
              <div className="text-sm text-gray-500 mt-2">
                <strong>Duração:</strong> {tour.duration}
              </div>
            )}
            {tour.min_child_age !== null && tour.min_child_age !== undefined && (
              <div className="text-sm text-gray-500 mt-2">
                <strong>Idade Mínima Criança Pagante:</strong> {tour.min_child_age} anos
              </div>
            )}
            {tour.gallery && tour.gallery.length > 0 && (
              <div className="mt-4">
                <strong>Galeria:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tour.gallery.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Galeria ${idx + 1}`}
                      width={60}
                      height={40}
                      className="object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
