"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Save, X, Plus, Minus, Clock, Users, Star } from "lucide-react"
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
      case "economico":
        return "Econômico"
      case "premium":
        return "Premium"
      case "luxo":
        return "Luxo"
      default:
        return "Padrão"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economico":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "luxo":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleHighlightsChange = (highlightsString: string) => {
    const highlights = highlightsString
      .split(",")
      .map((highlight) => highlight.trim())
      .filter(Boolean)
    setEditedPackage({ ...editedPackage, highlights })
  }

  const handleIncludedChange = (includedString: string) => {
    const included = includedString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setEditedPackage({ ...editedPackage, included })
  }

  const handleBestSeasonChange = (seasonString: string) => {
    const bestSeason = seasonString
      .split(",")
      .map((season) => season.trim())
      .filter(Boolean)
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
    // Renumber days
    const renumberedItinerary = newItinerary.map((day, i) => ({ ...day, day: i + 1 }))
    setEditedPackage({ ...editedPackage, itinerary: renumberedItinerary })
  }

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newItinerary = [...editedPackage.itinerary]
    if (field === "activities" || field === "meals") {
      newItinerary[index] = {
        ...newItinerary[index],
        [field]: value
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean),
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
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editedPackage.title}
                  onChange={(e) => setEditedPackage({ ...editedPackage, title: e.target.value })}
                  className="font-bold text-lg"
                  placeholder="Título do pacote"
                />
                <Input
                  value={editedPackage.subtitle}
                  onChange={(e) => setEditedPackage({ ...editedPackage, subtitle: e.target.value })}
                  className="text-sm"
                  placeholder="Subtítulo do pacote"
                />
              </div>
            ) : (
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
                <Button size="sm" variant="destructive" onClick={() => onDelete(pkg.id)}>
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
                value={editedPackage.description}
                onChange={(e) => setEditedPackage({ ...editedPackage, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  value={editedPackage.duration}
                  onChange={(e) => setEditedPackage({ ...editedPackage, duration: e.target.value })}
                  placeholder="3 dias / 2 noites"
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
                  onChange={(e) =>
                    setEditedPackage({
                      ...editedPackage,
                      originalPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Avaliação</Label>
                <Select
                  value={editedPackage.rating.toString()}
                  onValueChange={(value) => setEditedPackage({ ...editedPackage, rating: Number(value) })}
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
                <Label htmlFor="reviewsCount">Nº Avaliações</Label>
                <Input
                  id="reviewsCount"
                  type="number"
                  value={editedPackage.reviewsCount}
                  onChange={(e) => setEditedPackage({ ...editedPackage, reviewsCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={editedPackage.category}
                onValueChange={(value) => setEditedPackage({ ...editedPackage, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economico">Econômico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxo">Luxo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select
                value={editedPackage.difficulty}
                onValueChange={(value) => setEditedPackage({ ...editedPackage, difficulty: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={editedPackage.image}
                onChange={(e) => setEditedPackage({ ...editedPackage, image: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <Label htmlFor="highlights">Destaques (separados por vírgula)</Label>
              <Textarea
                id="highlights"
                value={editedPackage.highlights.join(", ")}
                onChange={(e) => handleHighlightsChange(e.target.value)}
                placeholder="Rio da Prata, Gruta do Lago Azul, Transfer incluso"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="included">Incluído (separado por vírgula)</Label>
              <Textarea
                id="included"
                value={editedPackage.included.join(", ")}
                onChange={(e) => handleIncludedChange(e.target.value)}
                placeholder="Hospedagem, Café da manhã, Transporte"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="bestSeason">Melhor Época (separada por vírgula)</Label>
              <Input
                id="bestSeason"
                value={editedPackage.bestSeason.join(", ")}
                onChange={(e) => handleBestSeasonChange(e.target.value)}
                placeholder="Maio, Junho, Julho, Agosto"
              />
            </div>

            {/* Itinerary Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Roteiro</Label>
                <Button type="button" size="sm" onClick={addItineraryDay} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Dia
                </Button>
              </div>

              {editedPackage.itinerary.map((day, index) => (
                <div key={index} className="border rounded-lg p-3 mb-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">Dia {day.day}</Label>
                    <Button type="button" size="sm" variant="outline" onClick={() => removeItineraryDay(index)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Input
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                      placeholder="Título do dia"
                      className="font-medium"
                    />
                    <Input
                      value={day.activities.join(", ")}
                      onChange={(e) => updateItineraryDay(index, "activities", e.target.value)}
                      placeholder="Atividades (separadas por vírgula)"
                    />
                    <Input
                      value={day.meals.join(", ")}
                      onChange={(e) => updateItineraryDay(index, "meals", e.target.value)}
                      placeholder="Refeições (separadas por vírgula)"
                    />
                    {day.accommodation && (
                      <Input
                        value={day.accommodation}
                        onChange={(e) => updateItineraryDay(index, "accommodation", e.target.value)}
                        placeholder="Acomodação"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{pkg.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Até {pkg.maxPeople}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>
                  {pkg.rating}/5 ({pkg.reviewsCount})
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                {pkg.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    R$ {pkg.originalPrice.toFixed(2).replace(".", ",")}
                  </div>
                )}
                <div className="text-xl font-bold text-green-600">R$ {pkg.price.toFixed(2).replace(".", ",")}</div>
              </div>
              <div className="text-sm text-gray-500">{pkg.itinerary.length} dias</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Destaques:</p>
              <div className="flex flex-wrap gap-1">
                {pkg.highlights.slice(0, 2).map((highlight, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
                {pkg.highlights.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{pkg.highlights.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
