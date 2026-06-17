"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
// SUSPENDED: import { useContactModal } from "@/hooks/use-contact-modal"
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
import { MapPin, Clock, Users, Star, Utensils, Bed, Car, Calendar } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { getAllAttractions, Attraction as SupabaseAttraction } from "@/services/supabase-attractions"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { htmlToPlainText } from "@/lib/text-format"

export type Attraction = SupabaseAttraction

interface AttractionProps extends Attraction {
  groupSize: string;
}

const defaultAttractions: AttractionProps[] = [
  {
    id: "1",
    title: "Gruta do Lago Azul",
    description: "Uma das mais belas cavernas inundadas do mundo, com águas cristalinas de cor azul intensa.",
    image: "/placeholder-image.png",
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
    image: "/placeholder-image.png",
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
    image: "/placeholder-image.png",
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
    image: "/placeholder-image.png",
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
  // SUSPENDED: const contactModal = useContactModal()
  const [activeTab, setActiveTab] = useState<Attraction["category"]>("gastronomy")
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [count, setCount] = useState(0)

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
  const hasFilteredAttractions = filteredAttractions.length > 0

  useEffect(() => {
    if (!hasFilteredAttractions) {
      setCount(0)
      setCurrentIndex(0)
      return
    }

    carouselApi?.scrollTo(0)
    setCurrentIndex(0)
  }, [activeTab, hasFilteredAttractions, carouselApi])

  useEffect(() => {
    if (!carouselApi) return

    const updateCarouselState = () => {
      setCount(carouselApi.scrollSnapList().length)
      setCurrentIndex(carouselApi.selectedScrollSnap())
    }

    updateCarouselState()
    carouselApi.on("select", updateCarouselState)
    carouselApi.on("reInit", updateCarouselState)

    return () => {
      carouselApi.off("select", updateCarouselState)
      carouselApi.off("reInit", updateCarouselState)
    }
  }, [carouselApi])

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
        return t("attrGastronomy")
      case "accommodation":
        return t("attrAccommodation")
      case "transport":
        return t("attrTransport")
      case "events":
        return t("attrEvents")
      default:
        return t("attrGastronomy")
    }
  }

  // SUSPENDED: const handleReserveClick = () => { contactModal.openModal() }

  return (
    <section id="attractions" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">{t("attractionsTitle")}</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">{t("attractionsSubtitle")}</p>
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

        {hasFilteredAttractions ? (
          <div className="relative">
            <Carousel opts={{ loop: true, align: "center" }} setApi={setCarouselApi}>
              <CarouselContent className="-ml-6 md:-ml-8 items-stretch">
                {filteredAttractions.map((attraction, index) => (
                  <CarouselItem
                    key={attraction.id}
                    className="pl-6 md:pl-8 basis-[82vw] md:basis-1/2 lg:basis-1/3 flex"
                  >
                    <Card
                      className="h-full w-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative h-64">
                        <SafeImage
                          src={attraction.image}
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

                      <CardContent className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold mb-2">{attraction.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{htmlToPlainText(attraction.description)}</p>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{attraction.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{attraction.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span>{attraction.capacity}</span>
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
                        <div className="flex gap-2 mb-3 mt-auto">
                          <Link href={`/atracoes/${attraction.slug}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              {t("learnMore")}
                            </Button>
                          </Link>
                        </div>
                        <WhatsAppCtaButton
                          message={`Olá! Vim do site Bonito ON e gostaria de reservar ${attraction.title}.`}
                          label={t("bookWhatsApp")}
                          className="text-sm"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/90 backdrop-blur-sm shadow-lg border-0 left-2 sm:-left-4 w-10 h-10 hover:bg-white" />
              <CarouselNext className="bg-white/90 backdrop-blur-sm shadow-lg border-0 right-2 sm:-right-4 w-10 h-10 hover:bg-white" />
            </Carousel>

            {count > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentIndex ? "bg-green-500" : "bg-gray-300"
                    }`}
                    aria-label={`Ir para atração ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-lg border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 [&_svg]:h-6 [&_svg]:w-6">
              {getCategoryIcon(activeTab)}
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Nenhuma atração encontrada</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Não há atrações cadastradas nesta categoria ainda.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
