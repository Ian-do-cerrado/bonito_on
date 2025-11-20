"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tour2Data } from "@/services/supabase-tours-2"
import Image from "next/image"
import { Pencil, Trash, Save, X, GalleryHorizontal } from "lucide-react"

interface AdminTour2CardProps {
  tour: Tour2Data
  onUpdate: (tour: Tour2Data) => void
  onDelete: (tourId: string) => void
}

export function AdminTour2Card({ tour, onUpdate, onDelete }: AdminTour2CardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTour, setEditedTour] = useState<Tour2Data>(tour)

  const handleSave = () => {
    onUpdate(editedTour)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTour(tour)
    setIsEditing(false)
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="relative h-48 w-full mb-4">
          <Image
            src={editedTour.image || "/placeholder.svg"}
            alt={editedTour.title}
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
        <CardTitle className="text-xl font-bold">{tour.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedTour.title}
              onChange={(e) => setEditedTour({ ...editedTour, title: e.target.value })}
              placeholder="Título"
            />
            <Textarea
              value={editedTour.description}
              onChange={(e) => setEditedTour({ ...editedTour, description: e.target.value })}
              placeholder="Descrição"
              rows={5}
            />
            <Input
              type="number"
              value={editedTour.price}
              onChange={(e) => setEditedTour({ ...editedTour, price: parseFloat(e.target.value) || 0 })}
              placeholder="Preço"
            />
            <Input
              type="number"
              value={editedTour.chd_price || ""}
              onChange={(e) =>
                setEditedTour({ ...editedTour, chd_price: parseFloat(e.target.value) || null })
              }
              placeholder="Preço Criança"
            />
            <Input
              type="number"
              value={editedTour.hs_price || ""}
              onChange={(e) =>
                setEditedTour({ ...editedTour, hs_price: parseFloat(e.target.value) || null })
              }
              placeholder="Preço Alta Temporada"
            />
            <Input
              type="number"
              value={editedTour.senior_price || ""}
              onChange={(e) =>
                setEditedTour({ ...editedTour, senior_price: parseFloat(e.target.value) || null })
              }
              placeholder="Preço Melhor Idade"
            />
             <Input
              type="number"
              value={editedTour.ms_price || ""}
              onChange={(e) =>
                setEditedTour({ ...editedTour, ms_price: parseFloat(e.target.value) || null })
              }
              placeholder="Preço MS"
            />
             <Input
              type="number"
              value={editedTour.min_child_age || ""}
              onChange={(e) =>
                setEditedTour({ ...editedTour, min_child_age: parseFloat(e.target.value) || null })
              }
              placeholder="Idade Mínima Criança"
            />
            <Input
              value={editedTour.duration || ""}
              onChange={(e) => setEditedTour({ ...editedTour, duration: e.target.value })}
              placeholder="Duração"
            />
            <Input
              value={editedTour.image}
              onChange={(e) => setEditedTour({ ...editedTour, image: e.target.value })}
              placeholder="URL da Imagem Principal"
            />
            <Textarea
                value={editedTour.gallery?.join("\n") || ""}
                onChange={(e) => setEditedTour({ ...editedTour, gallery: e.target.value.split("\n") })}
                placeholder="URLs da Galeria (uma por linha)"
                rows={4}
            />
            <Select value={editedTour.category} onValueChange={(value) => setEditedTour({ ...editedTour, category: value })}>
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
              value={editedTour.rating}
              onChange={(e) => setEditedTour({ ...editedTour, rating: parseFloat(e.target.value) || 0 })}
              placeholder="Avaliação (0-5)"
              max={5}
              min={0}
            />
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 truncate">{tour.description}</p>
            <p><span className="font-semibold">Preço:</span> R$ {tour.price.toFixed(2)}</p>
            {tour.min_child_age && tour.min_child_age > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Grátis até: {tour.min_child_age} ano(s)
              </p>
            )}
            <p><span className="font-semibold">Duração:</span> {tour.duration}</p>
            <p><span className="font-semibold">Categoria:</span> {tour.category}</p>
            <p><span className="font-semibold">Avaliação:</span> {tour.rating}/5</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
            <Button onClick={handleCancel} size="sm" variant="outline">
              <X className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </Button>
            <Button onClick={() => onDelete(tour.id)} size="sm" variant="destructive">
              <Trash className="w-4 h-4 mr-2" /> Excluir
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}