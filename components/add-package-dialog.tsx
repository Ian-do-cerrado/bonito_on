"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, Minus } from "lucide-react"
import type { Package } from "@/types/package"

interface AddPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (pkg: Omit<Package, "id">) => void
}

export function AddPackageDialog({ open, onOpenChange, onAdd }: AddPackageDialogProps) {
  const [newPackage, setNewPackage] = useState<Omit<Package, "id">>({
    title: "",
    subtitle: "",
    description: "",
    duration: "",
    price: 0,
    originalPrice: undefined,
    image: "/placeholder.svg?height=400&width=600",
    highlights: [],
    included: [],
    itinerary: [],
    category: "economico",
    rating: 5,
    reviewsCount: 0,
    maxPeople: 10,
    difficulty: "facil",
    bestSeason: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPackage.title && newPackage.description && newPackage.duration && newPackage.price > 0) {
      onAdd(newPackage)
      setNewPackage({
        title: "",
        subtitle: "",
        description: "",
        duration: "",
        price: 0,
        originalPrice: undefined,
        image: "/placeholder.svg?height=400&width=600",
        highlights: [],
        included: [],
        itinerary: [],
        category: "economico",
        rating: 5,
        reviewsCount: 0,
        maxPeople: 10,
        difficulty: "facil",
        bestSeason: [],
      })
    }
  }

  const handleHighlightsChange = (highlightsString: string) => {
    const highlights = highlightsString
      .split(",")
      .map((highlight) => highlight.trim())
      .filter(Boolean)
    setNewPackage({ ...newPackage, highlights })
  }

  const handleIncludedChange = (includedString: string) => {
    const included = includedString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setNewPackage({ ...newPackage, included })
  }

  const handleBestSeasonChange = (seasonString: string) => {
    const bestSeason = seasonString
      .split(",")
      .map((season) => season.trim())
      .filter(Boolean)
    setNewPackage({ ...newPackage, bestSeason })
  }

  const addItineraryDay = () => {
    const newDay = {
      day: newPackage.itinerary.length + 1,
      title: "",
      activities: [],
      meals: [],
    }
    setNewPackage({
      ...newPackage,
      itinerary: [...newPackage.itinerary, newDay],
    })
  }

  const removeItineraryDay = (index: number) => {
    const newItinerary = newPackage.itinerary.filter((_, i) => i !== index)
    // Renumber days
    const renumberedItinerary = newItinerary.map((day, i) => ({ ...day, day: i + 1 }))
    setNewPackage({ ...newPackage, itinerary: renumberedItinerary })
  }

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newItinerary = [...newPackage.itinerary]
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
    setNewPackage({ ...newPackage, itinerary: newItinerary })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Pacote</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="itinerary">Roteiro</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Pacote</Label>
                  <Input
                    id="title"
                    value={newPackage.title}
                    onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                    placeholder="Nome do pacote"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={newPackage.subtitle}
                    onChange={(e) => setNewPackage({ ...newPackage, subtitle: e.target.value })}
                    placeholder="Descrição curta"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  placeholder="Descrição detalhada do pacote"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={newPackage.duration}
                    onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                    placeholder="3 dias / 2 noites"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxPeople">Máximo de Pessoas</Label>
                  <Input
                    id="maxPeople"
                    type="number"
                    value={newPackage.maxPeople}
                    onChange={(e) => setNewPackage({ ...newPackage, maxPeople: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={newPackage.originalPrice || ""}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="reviewsCount">Nº de Avaliações</Label>
                  <Input
                    id="reviewsCount"
                    type="number"
                    value={newPackage.reviewsCount}
                    onChange={(e) => setNewPackage({ ...newPackage, reviewsCount: Number(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={newPackage.category}
                    onValueChange={(value) => setNewPackage({ ...newPackage, category: value as any })}
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
                    value={newPackage.difficulty}
                    onValueChange={(value) => setNewPackage({ ...newPackage, difficulty: value as any })}
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
                  <Label htmlFor="rating">Avaliação</Label>
                  <Select
                    value={newPackage.rating.toString()}
                    onValueChange={(value) => setNewPackage({ ...newPackage, rating: Number(value) })}
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
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={newPackage.image}
                  onChange={(e) => setNewPackage({ ...newPackage, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div>
                <Label htmlFor="highlights">Destaques do Pacote (separados por vírgula)</Label>
                <Textarea
                  id="highlights"
                  value={newPackage.highlights.join(", ")}
                  onChange={(e) => handleHighlightsChange(e.target.value)}
                  placeholder="Rio da Prata - Flutuação, Gruta do Lago Azul, Transfer incluso"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="included">O que está incluído (separado por vírgula)</Label>
                <Textarea
                  id="included"
                  value={newPackage.included.join(", ")}
                  onChange={(e) => handleIncludedChange(e.target.value)}
                  placeholder="Hospedagem, Café da manhã, Transporte, Guia especializado"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bestSeason">Melhor Época para Visitar (separada por vírgula)</Label>
                <Input
                  id="bestSeason"
                  value={newPackage.bestSeason.join(", ")}
                  onChange={(e) => handleBestSeasonChange(e.target.value)}
                  placeholder="Maio, Junho, Julho, Agosto, Setembro"
                />
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Roteiro do Pacote</Label>
                <Button type="button" onClick={addItineraryDay} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Dia
                </Button>
              </div>

              {newPackage.itinerary.map((day, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Dia {day.day}</h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeItineraryDay(index)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`day-title-${index}`}>Título do Dia</Label>
                      <Input
                        id={`day-title-${index}`}
                        value={day.title}
                        onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                        placeholder="Ex: Chegada e Aquário Natural"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`day-activities-${index}`}>Atividades (separadas por vírgula)</Label>
                      <Textarea
                        id={`day-activities-${index}`}
                        value={day.activities.join(", ")}
                        onChange={(e) => updateItineraryDay(index, "activities", e.target.value)}
                        placeholder="Check-in no hotel, Aquário Natural, Jantar de boas-vindas"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`day-meals-${index}`}>Refeições (separadas por vírgula)</Label>
                      <Input
                        id={`day-meals-${index}`}
                        value={day.meals.join(", ")}
                        onChange={(e) => updateItineraryDay(index, "meals", e.target.value)}
                        placeholder="Café da manhã, Almoço, Jantar"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`day-accommodation-${index}`}>Acomodação (opcional)</Label>
                      <Input
                        id={`day-accommodation-${index}`}
                        value={day.accommodation || ""}
                        onChange={(e) => updateItineraryDay(index, "accommodation", e.target.value)}
                        placeholder="Hotel 4 estrelas, Resort, Pousada"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {newPackage.itinerary.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">Nenhum dia adicionado ao roteiro</p>
                  <Button type="button" onClick={addItineraryDay} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Dia
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar Pacote
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
