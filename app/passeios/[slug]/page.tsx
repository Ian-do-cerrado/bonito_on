"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MapPin, Clock, Users, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SiteLayout } from "@/components/site-layout"
import { Tour } from "@/components/tours-section"
import { ContactModal } from "@/components/contact-modal"
import { getTourBySlug } from "@/services/supabase-tours"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ContactModalProvider, useContactModal } from "@/contexts/contact-modal-context";

interface TourDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

// Função para formatar texto com quebras de linha e formatação básica
function formatDescription(text: string) {
  if (!text) return null

  // Dividir por linhas
  const paragraphs = text.split("\n\n")

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        // Verificar se é um título (começa com ## ou ###)
        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
              {paragraph.replace("## ", "")}
            </h2>
          )
        }

        if (paragraph.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-semibold mt-5 mb-2">
              {paragraph.replace("### ", "")}
            </h3>
          )
        }

        // Verificar se é uma lista (começa com * ou -)
        if (paragraph.includes("\n* ") || paragraph.includes("\n- ")) {
          const listItems = paragraph.split("\n").filter((item) => item.startsWith("* ") || item.startsWith("- "))
          return (
            <ul key={index} className="list-disc pl-5 my-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">
                  {item.replace(/^\\* |^- /, "")}
                </li>
              ))}
            </ul>
          )
        }

        // Verificar se é uma lista numerada
        if (paragraph.includes("\n1. ") || paragraph.match(/\n\\d+\\. /)) {
          const listItems = paragraph.split("\n").filter((item) => /^\\d+\\. /.test(item))
          return (
            <ol key={index} className="list-decimal pl-5 my-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">
                  {item.replace(/^\\d+\\. /, "")}
                </li>
              ))}
            </ol>
          )
        }

        // Verificar se é uma citação
        if (paragraph.startsWith("> ")) {
          return (
            <blockquote key={index} className="border-l-4 border-green-500 pl-4 italic my-4 text-gray-600">
              {paragraph.replace("> ", "")}
            </blockquote>
          )
        }

        // Formatar texto com negrito e itálico
        const formattedText = paragraph
          .replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>")
          .replace(/\\*(.*?)\\*/g, "<em>$1</em>")

        // Parágrafo normal
        return (
          <p
            key={index}
            className="my-3 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        )
      })}
    </>
  )
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
  // Handle both Promise and direct object params
  const resolvedParams =
    params && typeof params === "object" && "then" in params ? use(params) : (params as { slug: string })
  const slug = resolvedParams.slug
  const [tour, setTour] = useState<Tour | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { openModal } = useContactModal();

  // Function to create URL-friendly slug from tour title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD") // Decompose accented characters
      .replace(/[\\u0300-\\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\\s-]/g, "") // Remove special characters except spaces and hyphens
      .trim()
      .replace(/\\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
  }

  useEffect(() => {
    const fetchTour = async () => {
      setIsLoading(true)
      try {
        // Tenta buscar do Supabase primeiro
        const tourData = await getTourBySlug(slug)

        if (tourData) {
          setTour(tourData)
        } else {
          // Fallback para localStorage
          const savedTours = localStorage.getItem("tours")
          if (savedTours) {
            const tours: Tour[] = JSON.parse(savedTours)
            const foundTour = tours.find((t) => createSlug(t.title) === slug)
            setTour(foundTour || null)
          }
        }
      } catch (error) {
        console.error("Error fetching tour:", error)
        // Fallback para localStorage em caso de erro
        const savedTours = localStorage.getItem("tours")
        if (savedTours) {
          const tours: Tour[] = JSON.parse(savedTours)
          const foundTour = tours.find((t) => createSlug(t.title) === slug)
          setTour(foundTour || null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTour()
  }, [slug])

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "passeios":
        return "Passeios"
      case "locations":
        return "Eventos"
      case "food":
        return "Gastronomia"
      case "transportation":
        return "Transporte"
      default:
        return "Passeios"
    }
  }

  const getCategoryColor = (category: Tour["category"]) => {
    switch (category) {
      case "adventure":
        return "bg-orange-100 text-orange-800"
      case "contemplation":
        return "bg-yellow-200 text-yellow-800"
      case "cave":
        return "bg-purple-200 text-purple-800"
      case "waterfall":
        return "bg-blue-200 text-blue-800"
      case "rappelling":
        return "bg-pink-200 text-pink-800"
      case "horseback":
        return "bg-amber-200 text-amber-800"
      case "biking":
        return "bg-lime-200 text-lime-800"
      case "scubaDiving":
        return "bg-teal-200 text-teal-800"
      case "resort":
        return "bg-green-200 text-green-800"
      case "floating":
        return "bg-cyan-200 text-cyan-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  // Função para obter as imagens da galeria
  const getGalleryImages = (tour: Tour) => {
    // Usar apenas as imagens da coluna gallery, sem fallbacks ou placeholders
    if (tour.gallery && Array.isArray(tour.gallery) && tour.gallery.length > 0) {
      // Filtrar URLs vazias ou inválidas
      return tour.gallery.filter((url) => url && url.trim() !== "")
    }

    // Se não houver galeria, retornar um array vazio
    return []
  }

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </SiteLayout>
    )
  }

  if (!tour) {
    return (
      <SiteLayout>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Item não encontrado</h1>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </SiteLayout>
    )
  }

  const galleryImages = getGalleryImages(tour)

  return (
    <ContactModalProvider>
      <SiteLayout>
        {/* Hero Section */}
        <section className="relative h-96 pt-16">
        <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8">
          <Badge className={getCategoryColor(tour.category)}>{getCategoryLabel(tour.category)}</Badge>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>

              {/* Galeria Carrossel */}
              <div className="mb-6">
                {galleryImages.length > 0 ? (
                  <>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {galleryImages.map((image, index) => (
                          <CarouselItem key={index} className="relative">
                            <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`${tour.title} - Imagem ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index === 0}
                                className="object-cover object-center transition-opacity duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=800&width=1200"
                                  target.onerror = null
                                }}
                              />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                              {index + 1}/{galleryImages.length}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {galleryImages.length > 1 && (
                        <>
                          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                          <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
                        </>
                      )}
                    </Carousel>

                    {/* Miniaturas */}
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {galleryImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                              activeImageIndex === index ? "border-green-500" : "border-transparent"
                            }`}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Miniatura ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={tour.image || "/placeholder.svg?height=800&width=1200"}
                      alt={tour.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < tour.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({tour.rating}/5)</span>
                </div>
                <div className="text-3xl font-bold text-green-600">R$ {tour.price.toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
                <div className="prose prose-green max-w-none text-gray-700">{formatDescription(tour.description)}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Localização</p>
                      <p className="text-gray-600">Bonito, MS</p>
                    </div>
                  
                  
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Duração</p>
                      <p className="text-gray-600">Dia inteiro</p>
                    </div>
                  

                  
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Grupo</p>
                      <p className="text-gray-600">Até 15 pessoas</p>
                    </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">O que está incluído</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Transporte ida e volta
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Guia especializado
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Equipamentos necessários
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Seguro de acidentes pessoais
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Reserve agora</h3>

              <div className="mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    R$ {tour.price.toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-gray-600">por pessoa</p>
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    onClick={() => openModal(tour?.title)}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 transition-transform duration-300 hover:scale-105"
                  >
                    Reservar Agora
                  </Button>

                  <Link
                    href="https://wa.me/5567991395384?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais"
<<<<<<< HEAD
<<<<<<< HEAD
                    className="w-full transition-colors duration-300 hover:bg-green-50 bg-white text-gray-900 rounded-md border border-gray-200 py-3 text-center flex items-center justify-center"
=======
                    variant="outline"
                    className="w-full transition-colors duration-300 hover:bg-green-50"
>>>>>>> 8212296 (ajusta botoes)
=======
                    className="w-full transition-colors duration-300 hover:bg-green-50 bg-white text-gray-900 rounded-md border border-gray-200 py-3 text-center flex items-center justify-center"
>>>>>>> 4d221f9 (Review Section)
                  >
                    Falar com agente especializado
                  </Link>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Precisa de ajuda?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm">(67) 99139-5384</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-green-600" />
                      <span className="text-sm">contato@bonitoon.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ContactModal attraction={tour?.title} />
    </SiteLayout>
    </ContactModalProvider>
  )
}