"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tour2Data } from "@/lib/supabase/types"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface AddTour2DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (newTour: Omit<Tour2Data, "id">) => void
}

export function AddTour2Dialog({ open, onOpenChange, onAdd }: AddTour2DialogProps) {
  const { t } = useLanguage()
  const [newTour, setNewTour] = useState<Omit<Tour2Data, "id">>({
    title: "",
    description: "",
    price: 0,
    price_high_season: null,
    chd_price_ls: null,
    price_child_hs: null,
    price_senior_low_season: null,
    price_senior_high_season: null,
    price_ms_low_season: null,
    price_ms_hs: null,
    min_child_age: null,
    image: "",
    gallery: [],
    category: "adventure",
    rating: 5,
    slug: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    duration: "",
    is_visible: false,
  })

  const handleAdd = () => {
    onAdd(newTour)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Passeio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={newTour.title}
              onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <ReactQuill
              theme="snow"
              value={newTour.description}
              onChange={(value) => setNewTour({ ...newTour, description: value })}
              className="h-64"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 pt-12">
            <Label htmlFor="price" className="text-right">
              preço baixa temporada
            </Label>
            <Input
              id="price"
              type="number"
              value={newTour.price}
              onChange={(e) => setNewTour({ ...newTour, price: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price_high_season" className="text-right">
              preço alta temporada
            </Label>
            <Input
              id="price_high_season"
              type="number"
              value={newTour.price_high_season ?? ""}
              onChange={(e) => setNewTour({ ...newTour, price_high_season: Number(e.target.value) || null })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ms_price_ls" className="text-right">
              preço ms baixa temporada
            </Label>
            <Input
              id="ms_price_ls"
              type="number"
              value={newTour.ms_price_ls ?? ""}
              onChange={(e) => setNewTour({ ...newTour, ms_price_ls: Number(e.target.value) || null })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price_ms_hs" className="text-right">
              preço ms alta temporada
            </Label>
            <Input
              id="price_ms_hs"
              type="number"
              value={newTour.price_ms_hs ?? ""}
              onChange={(e) => setNewTour({ ...newTour, price_ms_hs: Number(e.target.value) || null })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="senior_price_ls" className="text-right">
              preço melhor idade baixa temporada
            </Label>
            <Input
              id="senior_price_ls"
              type="number"
              value={newTour.senior_price_ls ?? ""}
              onChange={(e) => setNewTour({ ...newTour, senior_price_ls: Number(e.target.value) || null })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price_senior_hs" className="text-right">
              preço melhor idade alta temporada
            </Label>
            <Input
              id="price_senior_hs"
              type="number"
              value={newTour.price_senior_high_season ?? ""}
              onChange={(e) => setNewTour({ ...newTour, price_senior_high_season: Number(e.target.value) || null })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_visible" className="text-right">
              Visível
            </Label>
            <Switch
              id="is_visible"
              checked={newTour.is_visible}
              onCheckedChange={(checked) => setNewTour({ ...newTour, is_visible: checked })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleAdd}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}