"use client"

import React, { useState, useEffect, JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MapPin, Clock, Users, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SiteLayout } from "@/components/site-layout"
import { Tour2Data as TourData } from "@/lib/supabase/types"
import { useContactModal } from "@/hooks/use-contact-modal"
import { getTourBySlug } from "@/services/supabase-tours"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface TourDetailPageProps {
  initialTour: TourData | null;
}

// Função para processar HTML e converter para JSX
function formatDescription(text: string) {
  if (!text) return null

  // Primeiro, vamos limpar e processar o HTML
  const processedText = text
    // Remover tags HTML desnecessárias e converter para markdown-like
    .replace(/<p>/g, "\n\n")
    .replace(/<\/p>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    .replace(/<b>/g, "**")
    .replace(/<\/b>/g, "**")
    .replace(/<em>/g, "*")
    .replace(/<\/em>/g, "*")
    .replace(/<i>/g, "*")
    .replace(/<\/i>/g, "*")
    .replace(/<ul>/g, "\n")
    .replace(/<\/ul>/g, "\n")
    .replace(/<ol>/g, "\n")
    .replace(/<\/ol>/g, "\n")
    .replace(/<li>/g, "• ")
    .replace(/<\/li>/g, "\n")
    .replace(/<h1>/g, "\n## ")
    .replace(/<\/h1>/g, "\n")
    .replace(/<h2>/g, "\n## ")
    .replace(/<\/h2>/g, "\n")
    .replace(/<h3>/g, "\n### ")
    .replace(/<\/h3>/g, "\n")
    .replace(/<h4>/g, "\n# ")
    .replace(/<\/h4>/g, "\n")
    // Remover outras tags HTML que possam ter sobrado
    .replace(/<[^>]*>/g, "")
    // Limpar espaços extras
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim()

  // Dividir por parágrafos
  const sections = processedText.split("\n\n").filter((section) => section.trim())

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const lines = section.split("\n").filter((line) => line.trim())

        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim()
              if (!trimmedLine) return null

              // Títulos principais (## ou ###)
              if (trimmedLine.startsWith("### ")) {
                return (
                  <h3
                    key={lineIndex}
                    className="text-xl font-bold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-2"
                  >
                    {trimmedLine.replace("### ", "")}
                  </h3>
                )
              }

              if (trimmedLine.startsWith("## ")) {
                return (
                  <h2
                    key={lineIndex}
                    className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-green-500 pb-2"
                  >
                    {trimmedLine.replace("## ", "")}
                  </h2>
                )
              }

              // Subtítulos menores
              if (trimmedLine.startsWith("# ")) {
                return (
                  <h4 key={lineIndex} className="text-lg font-semibold text-green-700 mt-4 mb-2">
                    {trimmedLine.replace("# ", "")}
                  </h4>
                )
              }

              // Listas com bullets
              if (trimmedLine.startsWith("• ")) {
                return (
                  <div key={lineIndex} className="flex items-start gap-3 ml-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{formatInlineText(trimmedLine.replace("• ", ""))}</p>
                  </div>
                )
              }

              // Listas numeradas
              if (/^\d+\.\s/.test(trimmedLine)) {
                const number = trimmedLine.match(/^(\d+)\./)?.[1]
                const content = trimmedLine.replace(/^\d+\.\s/, "")
                return (
                  <div key={lineIndex} className="flex items-start gap-3 ml-4">
                    <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {number}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{formatInlineText(content)}</p>
                  </div>
                )
              }

              // Texto destacado (linhas que começam com !)
              if (trimmedLine.startsWith("! ")) {
                return (
                  <div key={lineIndex} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-3">
                    <p className="text-yellow-800 font-semibold">{formatInlineText(trimmedLine.replace("! ", ""))}</p>
                  </div>
                )
              }

              // Texto de destaque importante (linhas que começam com !!)
              if (trimmedLine.startsWith("!! ")) {
                return (
                  <div key={lineIndex} className="bg-red-50 border border-red-200 rounded-lg p-4 my-3">
                    <p className="text-red-800 font-bold">{formatInlineText(trimmedLine.replace("!! ", ""))}</p>
                  </div>
                )
              }

              // Parágrafos normais
              return (
                <p key={lineIndex} className="text-gray-700 leading-relaxed text-base mb-3">
                  {formatInlineText(trimmedLine)}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// Função auxiliar para formatar texto inline (negrito, itálico, etc.)
function formatInlineText(text: string) {
  const parts: { key: string; element: JSX.Element }[] = []
  let currentText = text
  let keyCounter = 0

  // Processar negrito **texto**
  currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    const key = `__BOLD_${keyCounter++}__`
    parts.push({
      key,
      element: (
        <strong key={key} className="font-bold text-gray-900">
          {content}
        </strong>
      ),
    })
    return key
  })

  // Processar itálico *texto*
  currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
    const key = `__ITALIC_${keyCounter++}__`
    parts.push({
      key,
      element: (
        <em key={key} className="italic text-gray-800">
          {content}
        </em>
      ),
    })
    return key
  })

  // Processar código `texto`
  currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
    const key = `__CODE_${keyCounter++}__`
    parts.push({
      key,
      element: (
        <code key={key} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
          {content}
        </code>
      ),
    })
    return key
  })

  // Dividir o texto e reconstruir com os elementos
  const finalParts = currentText.split(/(__(?:BOLD|ITALIC|CODE)_\d+__)/)

  return finalParts.map((part, index) => {
    const foundPart = parts.find((p) => p.key === part)
    if (foundPart) {
      return foundPart.element
    }
    return part
  })
}

export default function TourDetailPage({ initialTour }: TourDetailPageProps) {
  const { openModal } = useContactModal()
  const [tour, setTour] = useState<TourData | null>(initialTour)
  const [isLoading, setIsLoading] = useState(false) // No longer loading on client if initialTour is provided
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Function to create URL-friendly slug from tour title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD") // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
  }

  useEffect(() => {
    // If initialTour is not provided, or if the slug changes, fetch the tour on the client
    if (!initialTour) {
      setIsLoading(true)
      const fetchTour = async () => {
        try {
          const slug = window.location.pathname.split('/').pop();
          if (!slug) return;

          // Tenta buscar do Supabase primeiro
          const tourData = await getTourBySlug(slug)

          if (tourData) {
            setTour(tourData)
          } else {
            // Fallback para localStorage
            const savedTours = localStorage.getItem("tours")
            if (savedTours) {
              const tours: TourData[] = JSON.parse(savedTours)
              const foundTour = tours.find((t) => createSlug(t.title) === window.location.pathname.split("/").pop())
              setTour(foundTour || null)
            }
          }
        } catch (error) {
          console.error("Error fetching tour:", error)
          // Fallback para localStorage em caso de erro
          const savedTours = localStorage.getItem("tours")
          if (savedTours) {
            const tours: TourData[] = JSON.parse(savedTours)
            const foundTour = tours.find((t) => createSlug(t.title) === window.location.pathname.split("/").pop())
            setTour(foundTour || null)
          }
        } finally {
          setIsLoading(false)
        }
      }

      fetchTour()
    }
  }, [initialTour])

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "passeios":
        return "bg-green-100 text-green-800"
      case "locations":
        return "bg-blue-100 text-blue-800"
      case "food":
        return "bg-orange-100 text-orange-800"
      case "transportation":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  // Função para obter as imagens da galeria
  const getGalleryImages = (tour: TourData) => {
    // Usar apenas as imagens da coluna gallery, sem fallbacks ou placeholders
    if (tour.gallery && Array.isArray(tour.gallery) && tour.gallery.length > 0) {
      // Filtrar URLs vazias ou inválidas
      return tour.gallery.filter((url: string) => url && url.trim() !== "")
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
                        {galleryImages.map((image: string, index: number) => (
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
                        {galleryImages.map((image: string, index: number) => (
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
              </div>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Descrição</h2>
                <div className="prose-custom max-w-none">{formatDescription(tour.description)}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Localização</p>
                      <p className="text-gray-600">Bonito, MS</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Duração</p>
                      <p className="text-gray-600">{tour.duration || "Não informado"}</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                  O que está incluído
                </h2>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Disponível a contratação de transfer
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Guia especializado
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Equipamentos necessários
                  </li>
                  <li className="flex items-center gap-3">
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
                <h3 className="text-xl font-semibold mb-6">Valores</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Os preços podem sofrer alterações, fale com o agente.
                </p>

                <div className="space-y-4 mb-6">
                  {/* Preço Principal - Baixa Temporada */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-800">Baixa Temporada</p>
                        <p className="text-xs text-green-600">Adulto</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">
                          R$ {tour.price.toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    </div>
                    {tour.min_child_age && tour.min_child_age > 0 && (
                       <div className="text-xs text-gray-500 mt-1 text-right">
                         Grátis até: {tour.min_child_age} anos
                       </div>
                     )}
                  </div>

                  {/* Alta Temporada */}
                  {tour.hs_price && tour.hs_price > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Alta Temporada</p>
                          <p className="text-xs text-gray-500">Adulto</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            R$ {tour.hs_price.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Criança (Baixa Temporada) */}
                  {tour.chd_price && tour.chd_price > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Criança (Baixa Temporada)</p>
                          {tour.min_child_age !== undefined && tour.min_child_age !== null && (
                            <p className="text-xs text-gray-500">Grátis até: {tour.min_child_age} anos</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            R$ {tour.chd_price.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <Button onClick={openModal} className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                    Reservar Agora
                  </Button>

                  <Button onClick={openModal} variant="outline" className="w-full bg-transparent">
                    Falar com especialista
                  </Button>
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
                      <span className="text-sm">contato@bonitoon.com.br</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
