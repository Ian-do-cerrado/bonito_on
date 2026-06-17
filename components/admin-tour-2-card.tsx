"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Save, X, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { Tour2Data } from "@/lib/supabase/types"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface AdminTour2CardProps {
  tour: Tour2Data
  onUpdate: (tour: Tour2Data) => void
  onDelete: (tourId: string) => void
}

export function AdminTour2Card({ tour, onUpdate, onDelete }: AdminTour2CardProps) {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTour, setEditedTour] = useState<Tour2Data>(tour)

  const handleSave = () => {
    // Basic validation: prevent saving with an empty description
    if (!editedTour.description || editedTour.description.trim() === "<p><br></p>" || editedTour.description.trim() === "") {
      handleCancel() // Revert changes if description is empty
      return
    }
    onUpdate(editedTour)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTour(tour)
    setIsEditing(false)
  }

  const getCategoryLabel = (category: Tour2Data["category"]) => {
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

  const getCategoryColor = (category: Tour2Data["category"]) => {
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
                className="h-64"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-12">
              <div>
                <Label htmlFor="price">preço baixa temporada</Label>
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
                <Label htmlFor="hs_price">preço alta temporada</Label>
                <Input
                  id="hs_price"
                  type="number"
                  value={editedTour.hs_price ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, hs_price: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chd_price_ls">preço criança baixa temporada</Label>
                <Input
                  id="chd_price_ls"
                  type="number"
                  value={editedTour.chd_price_ls ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, chd_price_ls: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="price_chd_hs">preço criança alta temporada</Label>
                <Input
                  id="price_chd_hs"
                  type="number"
                  value={editedTour.price_chd_hs ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_chd_hs: Number(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senior_price_ls">preço melhor idade baixa temporada</Label>
                <Input
                  id="senior_price_ls"
                  type="number"
                  value={editedTour.senior_price_ls ?? ""}
                  onChange={(e) =>
                    setEditedTour({ ...editedTour, senior_price_ls: Number(e.target.value) || null })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="price_senior_hs">preço melhor idade alta temporada</Label>
                <Input
                  id="price_senior_hs"
                  type="number"
                  value={editedTour.price_senior_hs ?? ""}
                  onChange={(e) =>
                    setEditedTour({ ...editedTour, price_senior_hs: Number(e.target.value) || null })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="ms_price_ls">preço ms baixa temporada</Label>
                <Input
                  id="ms_price_ls"
                  type="number"
                  value={editedTour.ms_price_ls ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, ms_price_ls: Number(e.target.value) || null })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="price_ms_hs">preço ms alta temporada</Label>
                <Input
                  id="price_ms_hs"
                  type="number"
                  value={editedTour.price_ms_hs ?? ""}
                  onChange={(e) => setEditedTour({ ...editedTour, price_ms_hs: Number(e.target.value) || null })}
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
                  setEditedTour({ ...editedTour, category: value as Tour2Data["category"] })
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
            <div>
              <Label htmlFor="is_visible">Visível</Label>
              <Switch
                id="is_visible"
                checked={editedTour.is_visible}
                onCheckedChange={(checked) => setEditedTour({ ...editedTour, is_visible: checked })}
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
              <div className="flex items-center gap-1 text-sm text-gray-500">
                {tour.rating}
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              {tour.ms_price_ls !== null && tour.ms_price_ls !== undefined && (
                <div>
                  <strong>preço ms baixa temporada:</strong> R$
                  {tour.ms_price_ls.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_ms_hs !== null && tour.price_ms_hs !== undefined && (
                <div>
                  <strong>preço ms alta temporada:</strong> R$
                  {tour.price_ms_hs.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.chd_price_ls !== null && tour.chd_price_ls !== undefined && (
                <div>
                  <strong>Criança Baixa Temp.:</strong> R$
                  {tour.chd_price_ls.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_chd_hs !== null && tour.price_chd_hs !== undefined && (
                <div>
                  <strong>Criança Alta Temp.:</strong> R$
                  {tour.price_chd_hs.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.hs_price !== null && tour.hs_price !== undefined && (
                <div>
                  <strong>Alta Temp.:</strong> R$ {tour.hs_price.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.senior_price_ls !== null && tour.senior_price_ls !== undefined && (
                <div>
                  <strong>Melhor Idade Baixa Temp.:</strong> R$
                  {tour.senior_price_ls.toFixed(2).replace(".", ",")}
                </div>
              )}
              {tour.price_senior_hs !== null && tour.price_senior_hs !== undefined && (
                <div>
                  <strong>Melhor Idade Alta Temp.:</strong> R$
                  {tour.price_senior_hs.toFixed(2).replace(".", ",")}
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