"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Attraction } from "@/components/attractions-section"

interface AddAttractionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (attraction: Omit<Attraction, "id">) => void
}

export function AddAttractionDialog({ open, onOpenChange, onAdd }: AddAttractionDialogProps) {
  const [newAttraction, setNewAttraction] = useState<Omit<Attraction, "id">>({
    title: "",
    description: "",
    price: "",
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    location: "",
    duration: "",
    capacity: "",
    category: "gastronomy",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAttraction.title && newAttraction.description && newAttraction.price) {
      onAdd(newAttraction)
      setNewAttraction({
        title: "",
        description: "",
        price: "",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.5,
        location: "",
        duration: "",
        capacity: "",
        category: "gastronomy",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Atração</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={newAttraction.title}
              onChange={(e) => setNewAttraction({ ...newAttraction, title: e.target.value })}
              placeholder="Nome da atração"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newAttraction.description}
              onChange={(e) => setNewAttraction({ ...newAttraction, description: e.target.value })}
              placeholder="Descrição da atração"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                value={newAttraction.price}
                onChange={(e) => setNewAttraction({ ...newAttraction, price: e.target.value })}
                placeholder="R$ 100"
                required
              />
            </div>
            <div>
              <Label htmlFor="rating">Avaliação</Label>
              <Select
                value={newAttraction.rating.toString()}
                onValueChange={(value) => setNewAttraction({ ...newAttraction, rating: Number(value) })}
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
                value={newAttraction.location}
                onChange={(e) => setNewAttraction({ ...newAttraction, location: e.target.value })}
                placeholder="Centro de Bonito"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={newAttraction.duration}
                onChange={(e) => setNewAttraction({ ...newAttraction, duration: e.target.value })}
                placeholder="2h"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="capacity">Capacidade</Label>
            <Input
              id="capacity"
              value={newAttraction.capacity}
              onChange={(e) => setNewAttraction({ ...newAttraction, capacity: e.target.value })}
              placeholder="50 pessoas"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={newAttraction.category}
              onValueChange={(value) =>
                setNewAttraction({ ...newAttraction, category: value as Attraction["category"] })
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
              value={newAttraction.image}
              onChange={(e) => setNewAttraction({ ...newAttraction, image: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar Atração
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
