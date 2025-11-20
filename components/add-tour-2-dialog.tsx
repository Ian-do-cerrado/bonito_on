"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tour2Data } from "@/services/supabase-tours-2"

interface AddTour2DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (tour: Omit<Tour2Data, "id">) => void
}

const initialState: Omit<Tour2Data, "id"> = {
  title: "",
  description: "",
  price_to_semester: 0, // Corresponds to price in UI (Baixa Temporada - Adulto)
  chd_price: null, // Corresponds to price_child in UI (Criança - qualquer temporada)
  hs_price: null, // Corresponds to price_high_season in UI (Alta Temporada - Adulto)
  senior_price: null, // Corresponds to price_senior in UI (Melhor Idade - qualquer temporada)
  ms_price: null, // Corresponds to price_ms in UI (Morador MS - qualquer temporada)
  min_child_age: null,
  image: "",
  gallery: [],
  category: "adventure",
  rating: 5,
  duration: "",
}

export function AddTour2Dialog({ open, onOpenChange, onAdd }: AddTour2DialogProps) {
  const [newTour, setNewTour] = useState(initialState)

  const handleAdd = () => {
    onAdd(newTour)
    setNewTour(initialState)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Passeio (Próximo Semestre)</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Input
            value={newTour.title}
            onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
            placeholder="Título"
            className="md:col-span-2"
          />
          <Textarea
            value={newTour.description}
            onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
            placeholder="Descrição"
            rows={5}
            className="md:col-span-2"
          />
          <Input
            type="number"
            value={newTour.price_to_semester}
            onChange={(e) => setNewTour({ ...newTour, price_to_semester: parseFloat(e.target.value) || 0 })}
            placeholder="Preço (2º Semestre)"
          />
          <Input
            type="number"
            value={newTour.chd_price || ""}
            onChange={(e) =>
              setNewTour({ ...newTour, chd_price: parseFloat(e.target.value) || null })
            }
            placeholder="Preço Criança"
          />
          <Input
            type="number"
            value={newTour.hs_price || ""}
            onChange={(e) =>
              setNewTour({ ...newTour, hs_price: parseFloat(e.target.value) || null })
            }
            placeholder="Preço Alta Temporada"
          />
          <Input
            type="number"
            value={newTour.senior_price || ""}
            onChange={(e) =>
              setNewTour({ ...newTour, senior_price: parseFloat(e.target.value) || null })
            }
            placeholder="Preço Melhor Idade"
          />
          <Input
            type="number"
            value={newTour.ms_price || ""}
            onChange={(e) =>
              setNewTour({ ...newTour, ms_price: parseFloat(e.target.value) || null })
            }
            placeholder="Preço MS"
          />
          <Input
            type="number"
            value={newTour.min_child_age || ""}
            onChange={(e) =>
              setNewTour({ ...newTour, min_child_age: parseFloat(e.target.value) || null })
            }
            placeholder="Idade Mínima Criança"
          />
          <Input
            value={newTour.duration || ""}
            onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
            placeholder="Duração"
          />
          <Input
            value={newTour.image}
            onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
            placeholder="URL da Imagem Principal"
            className="md:col-span-2"
          />
          <Textarea
            value={newTour.gallery?.join("\n") || ""}
            onChange={(e) => setNewTour({ ...newTour, gallery: e.target.value.split("\n") })}
            placeholder="URLs da Galeria (uma por linha)"
            rows={4}
            className="md:col-span-2"
          />
          <Select value={newTour.category} onValueChange={(value) => setNewTour({ ...newTour, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="adventure">Aventura</SelectItem>
                <SelectItem value="contemplation">Contemplação</SelectItem>
                <SelectItem value="cave">Gruta</SelectItem>
                <SelectItem value="waterfall">Cachoeira</SelectItem>
                <SelectItem value="rappelling">Rapel</SelectItem>
                <SelectItem value="horseback">Cavalgada</SelectItem>
                <SelectItem value="biking">Ciclismo</SelectItem>
                <SelectItem value="scubaDiving">Mergulho</SelectItem>
                <SelectItem value="resort">Balneário</SelectItem>
                <SelectItem value="floating">Flutuação</SelectItem>
                <SelectItem value="pantanal">Pantanal</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={newTour.rating}
            onChange={(e) => setNewTour({ ...newTour, rating: parseFloat(e.target.value) || 0 })}
            placeholder="Avaliação (0-5)"
            max={5}
            min={0}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleAdd}>
            Adicionar Passeio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}