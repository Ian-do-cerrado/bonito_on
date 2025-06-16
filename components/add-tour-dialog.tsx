"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { Tour } from "@/components/tours-section"

interface AddTourDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (tour: Omit<Tour, "id">) => void
}

export function AddTourDialog({ open, onOpenChange, onAdd }: AddTourDialogProps) {
  const { t } = useLanguage()
  const [newTour, setNewTour] = useState<Omit<Tour, "id">>({
    title: "",
    description: "",
    price: 0,
    image: "/placeholder.svg?height=300&width=400",
    rating: 5,
    category: "adventure",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTour.title && newTour.description && newTour.price > 0) {
      onAdd(newTour)
      setNewTour({
        title: "",
        description: "",
        price: 0,
        image: "/placeholder.svg?height=300&width=400",
        rating: 5,
        category: "adventure",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addNewTour")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={newTour.title}
              onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
              placeholder="Nome do item"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={newTour.description}
              onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
              placeholder="Descrição do item"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">{t("price")}</Label>
              <Input
                id="price"
                type="number"
                value={newTour.price}
                onChange={(e) => setNewTour({ ...newTour, price: Number(e.target.value) })}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="rating">{t("rating")}</Label>
              <Select
                value={newTour.rating.toString()}
                onValueChange={(value) => setNewTour({ ...newTour, rating: Number(value) })}
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
              value={newTour.category}
              onValueChange={(value) => setNewTour({ ...newTour, category: value as Tour["category"] })}
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
              value={newTour.image}
              onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {t("addTour")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
