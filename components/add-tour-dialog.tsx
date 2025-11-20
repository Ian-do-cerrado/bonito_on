"use client"

import type React from "react"

import { useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { DatabaseTour } from "@/lib/supabase/types" // Import DatabaseTour

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface AddTourDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (tour: Omit<DatabaseTour, "id" | "created_at" | "updated_at" | "slug">) => void // Slug is no longer expected from the dialog
}

export function AddTourDialog({ open, onOpenChange, onAdd }: AddTourDialogProps) {
  const { t } = useLanguage()
  const [newTour, setNewTour] = useState<Omit<DatabaseTour, "id" | "created_at" | "updated_at" | "slug">>({
    title: "",
    description: "",
    price: 0, // price for low season
    price_high_season: null, // Generic high season price
    price_ms_low_season: null,
    price_ms_high_season: null,
    price_child: null, // Generic child price
    price_child_low_season: null,
    price_child_high_season: null,
    price_senior: null, // Generic senior price
    price_senior_low_season: null,
    price_senior_high_season: null,
    price_ms: null, // Generic MS price
    min_child_age: null,
    image: "/placeholder.svg?height=300&width=400",
    gallery: [], // Initialize as empty array
    rating: 5,
    category: "adventure",
    duration: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTour.title && newTour.description && newTour.price >= 0) { // Changed to >= 0 as price can be 0 or null
      onAdd(newTour)
      setNewTour({
        title: "",
        description: "",
        price: 0,
        price_high_season: null,
        price_ms_low_season: null,
        price_ms_high_season: null,
        price_child: null,
        price_child_low_season: null,
        price_child_high_season: null,
        price_senior: null,
        price_senior_low_season: null,
        price_senior_high_season: null,
        price_ms: null,
        min_child_age: null,
        image: "/placeholder.svg?height=300&width=400",
        gallery: [],
        rating: 5,
        category: "adventure",
        gallery: [],
        rating: 5,
        category: "adventure",
        duration: "",
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
            <ReactQuill
              theme="snow"
              value={newTour.description}
              onChange={(value) => setNewTour({ ...newTour, description: value })}
              className="h-32 mb-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço baixa Temporada</Label>
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
              <Label htmlFor="price_high_season">Preço Alta Temporada</Label>
              <Input
                id="price_high_season"
                type="number"
                value={newTour.price_high_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_high_season: Number(e.target.value) || null })}
                placeholder="0"
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
                value={newTour.price_child ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_child: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="price_senior">Preço Melhor Idade</Label>
              <Input
                id="price_senior"
                type="number"
                value={newTour.price_senior ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_senior: Number(e.target.value) || null })}
                placeholder="0"
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
                value={newTour.price_ms ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_ms: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_child_low_season">Preço Criança Baixa temporada</Label>
              <Input
                id="price_child_low_season"
                type="number"
                value={newTour.price_child_low_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_child_low_season: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="price_child_high_season">Preço Criança Alta temporada</Label>
              <Input
                id="price_child_high_season"
                type="number"
                value={newTour.price_child_high_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_child_high_season: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_senior_low_season">Preço melhor idade Baixa temporada</Label>
              <Input
                id="price_senior_low_season"
                type="number"
                value={newTour.price_senior_low_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_senior_low_season: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="price_senior_high_season">Preço melhor idade Alta temporada</Label>
              <Input
                id="price_senior_high_season"
                type="number"
                value={newTour.price_senior_high_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_senior_high_season: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_ms_low_season">Preço MS Baixa temporada</Label>
              <Input
                id="price_ms_low_season"
                type="number"
                value={newTour.price_ms_low_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_ms_low_season: Number(e.target.value) || null })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="price_ms_high_season">Preço MS Alta temporada</Label>
              <Input
                id="price_ms_high_season"
                type="number"
                value={newTour.price_ms_high_season ?? ""}
                onChange={(e) => setNewTour({ ...newTour, price_ms_high_season: Number(e.target.value) || null })}
                placeholder="0"
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
              value={newTour.min_child_age ?? ""}
              onChange={(e) => setNewTour({ ...newTour, min_child_age: Number(e.target.value) || null })}
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="gallery">Galeria (URLs separadas por vírgula)</Label>
            <Input
              id="gallery"
              value={newTour.gallery?.join(", ") || ""}
              onChange={(e) =>
                setNewTour({
                  ...newTour,
                  gallery: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [],
                })
              }
              placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg"
            />
          </div>

          <div>
            <Label htmlFor="category">{t("category")}</Label>
            <Select
              value={newTour.category}
              onValueChange={(value) => setNewTour({ ...newTour, category: value as DatabaseTour["category"] })} // Adjusted type
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
            <Label htmlFor="duration">Duração</Label>
            <Input
              id="duration"
              value={newTour.duration || ""}
              onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
              placeholder="Ex: Meio dia"
            />
          </div>

          <div>
            <Label htmlFor="image">{t("imageUrl")}</Label>
            <Input
              id="image"
              value={newTour.image || ""} // Provide empty string as fallback
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
