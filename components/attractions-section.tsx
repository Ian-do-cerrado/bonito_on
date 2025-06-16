"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useContactModal } from "@/hooks/use-contact-modal"
import { MapPin, Clock, Users, Star, Utensils, Bed, Car, Calendar } from "lucide-react"
import Image from "next/image"
import { getAllAttractions, Attraction as SupabaseAttraction } from "@/services/supabase-attractions"
import Link from "next/link"

export type Attraction = SupabaseAttraction

interface AttractionProps extends Attraction {
  groupSize: string;
}

const defaultAttractions: AttractionProps[] = [
  {
    id: "1",
    title: "Gruta do Lago Azul",
    description: "Uma das mais belas cavernas inundadas do mundo, com águas cristalinas de cor azul intensa.",
    image: "/placeholder.svg?height=300&width=400",
    category: "gastronomy",
    location: "Bonito, MS",
    duration: "2-3 horas",
    groupSize: "Até 20 pessoas",
    rating: 4.9,
    highlights: ["Lago subterrâneo", "Formações calcárias", "Águas cristalinas"],
    slug: "gruta-do-lago-azul",
  },
  {
    id: "2",
    title: "Flutuação no Rio da Prata",
    description: "Experiência única de flutuação em águas cristalinas com visibilidade de até 50 metros.",
    image: "/placeholder.svg?height=300&width=400",
    category: "accommodation",
    location: "Jardim, MS",
    duration: "4-5 horas",
    groupSize: "Até 12 pessoas",
    rating: 4.8,
    highlights: ["Águas cristalinas", "Peixes coloridos", "Vegetação aquática"],
    slug: "flutuacao-no-rio-da-prata",
  },
  {
    id: "3",
    title: "Restaurante Casa do João",
    description: "Culinária regional com pratos típicos do pantanal e ingredientes locais frescos.",
    image: "/placeholder.svg?height=300&width=400",
    category: "gastronomy",
    location: "Centro de Bonito",
    duration: "1-2 horas",
    groupSize: "Qualquer tamanho",
    rating: 4.7,
    highlights: ["Peixe pintado", "Pacu assado", "Sobremesas regionais"],
    slug: "restaurante-casa-do-joao",
  },
  {
    id: "4",
    title: "Pousada Águas de Bonito",
    description: "Acomodação confortável com piscina natural e vista para a serra da Bodoquena.",
    image: "/placeholder.svg?height=300&width=400",
    category: "accommodation",
    location: "Bonito, MS",
    duration: "Pernoite",
    groupSize: "2-4 pessoas por quarto",
    rating: 4.6,
    highlights: ["Piscina natural", "Café da manhã regional", "Vista panorâmica"],
    slug: "pousada-aguas-de-bonito",
  },
]

export function AttractionsSection() {
  const { t } = useLanguage()
  const contactModal = useContactModal()
  const [activeTab, setActiveTab] = useState<Attraction["category"]>("gastronomy")
  const [attractions, setAttractions] = useState<Attraction[]>([])

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const attractionsData = await getAllAttractions()
        setAttractions(attractionsData)
      } catch (error) {
        console.error("Error loading attractions:", error)
        // Fallback to default data
        setAttractions(defaultAttractions)
      }
    }

    loadAttractions()
  }, [])

  const filteredAttractions = attractions.filter((attraction) => attraction.category === activeTab)

  const getCategoryIcon = (category: Attraction["category"]) => {
    switch (category) {
      case "gastronomy":
        return <Utensils className="w-5 h-5" />
      case "accommodation":
        return <Bed className="w-5 h-5" />
      case "transport":
        return <Car className="w-5 h-5" />
      case "events":
        return <Calendar className="w-5 h-5" />
      default:
        return <Utensils className="w-5 h-5" />
    }
  }

  const getCategoryLabel = (category: Attraction["category"]) => {
    switch (category) {
      case "gastronomy":
        return "Gastronomia"
      case "accommodation":
        return "Hospedagem"
      case "transport":
        return "Transporte"
      case "events":
        return "Eventos"
      default:
        return "Gastronomia"
    }
  }

  const handleReserveClick = () => {
    contactModal.openModal()
  }

  return (
    <section id="attractions" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("attractionsTitle")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("attractionsSubtitle")}</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(["gastronomy", "accommodation", "transport", "events"] as const).map((category) => (
            <Button
              key={category}
              variant={activeTab === category ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab(category)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === category
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "hover:bg-green-50 hover:border-green-300"
              }`}
            >
              {getCategoryIcon(category)}
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map((attraction, index) => (
            <Card
              key={attraction.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-64">
                <Image
                  src={attraction.image || "/placeholder.svg"}
                  alt={attraction.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800">{getCategoryLabel(attraction.category)}</Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{attraction.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{attraction.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {attraction.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {attraction.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {attraction.capacity}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {attraction.highlights.slice(0, 3).map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price */}
                {attraction.price && (
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      R${" "}
                      {attraction.price}
                    </div>
                    <div className="text-xs text-gray-500">{t("perPerson")}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/atracoes/${attraction.slug}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      Saiba Mais
                    </Button>
                  </Link>
                  <Button onClick={handleReserveClick} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">{getCategoryIcon(activeTab)}</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma atração encontrada</h3>
            <p className="text-gray-500">Não há atrações cadastradas nesta categoria ainda.</p>
          </div>
        )}
      </div>
    </section>
  )
}
