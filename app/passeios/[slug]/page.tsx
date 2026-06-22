"use client"

import * as React from "react"
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
import { useLanguage } from "@/contexts/language-context"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { TourPricesSidebar } from "@/components/tour-prices-sidebar"
import { useContactModal } from "@/contexts/contact-modal-context"
import { cleanDescriptionPrices } from "@/lib/description-cleaner"
import { getDisplayPrice } from "@/lib/tour-price-utils"
import { getTranslatedDescription, getTranslatedTitle } from "@/lib/dynamic-translations"
import { formatDescription } from "@/lib/text-formatter"
import { createSlug } from "@/lib/utils"
import { resolveImageUrl, isExternalImageUrl } from "@/lib/image-url"

import { useSearchParams } from "next/navigation"

interface TourDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}




export default function TourDetailPage({ params }: TourDetailPageProps) {
  // Handle both Promise and direct object params
  const resolvedParams =
    params && typeof params === "object" && "then" in params ? use(params) : (params as { slug: string })
  const slug = resolvedParams.slug
  const searchParams = useSearchParams()
  const preferNextSemester = searchParams.get("semester") === "2"
  const { t, language, initialValueType } = useLanguage()
  const [tour, setTour] = useState<Tour | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { openModal, closeModal } = useContactModal()

  useEffect(() => {
    const fetchTour = async () => {
      setIsLoading(true)
      try {
        const queryParams = preferNextSemester ? "?semester=2" : ""
        const res = await fetch(`/api/tours/${encodeURIComponent(slug)}${queryParams}`)
        if (res.ok) {
          const tourData: Tour = await res.json()
          setTour(tourData)
        } else {
          const savedTours = localStorage.getItem("tours")
          if (savedTours) {
            const tours: Tour[] = JSON.parse(savedTours)
            setTour(tours.find((t) => createSlug(t.title) === slug) || null)
          } else {
            setTour(null)
          }
        }
      } catch (error) {
        console.error("Error fetching tour:", error)
        const savedTours = localStorage.getItem("tours")
        if (savedTours) {
          try {
            const tours: Tour[] = JSON.parse(savedTours)
            setTour(tours.find((t) => createSlug(t.title) === slug) || null)
          } catch {
            setTour(null)
          }
        } else {
          setTour(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTour()
  }, [slug, preferNextSemester])

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "passeios":
        return t("passeiosTitle")
      case "locations":
        return t("events")
      case "food":
        return t("foodTitle")
      case "transportation":
        return t("transportationTitle")
      default:
        return t("passeiosTitle")
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
    if (!Array.isArray(tour.gallery) || tour.gallery.length === 0) return []

    // Normaliza as URLs para evitar imagens quebradas vindas como path relativo.
    return tour.gallery
      .map((raw) => (typeof raw === "string" ? raw.trim() : ""))
      .filter((raw) => raw !== "" && raw !== "null" && raw !== "undefined")
      .map((raw) => resolveImageUrl(raw))
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("itemNotFound")}</h1>
            <Link href="/tarifario">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToHome")}
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
        <Image
          src={tour.image || "/images/placeholder.svg"}
          alt={tour.title}
          fill
          className="object-cover"
          unoptimized={isExternalImageUrl(tour.image)}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8">
          <Badge className={getCategoryColor(tour.category)}>{getCategoryLabel(tour.category)}</Badge>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/tarifario">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTranslatedTitle(tour, tour.title, language)}</h1>

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
                                src={image || "/images/placeholder.svg"}
                                alt={`${tour.title} - Imagem ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index === 0}
                                className="object-cover object-center transition-opacity duration-300"
                                unoptimized={isExternalImageUrl(image)}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/images/placeholder.svg"
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
                              src={image || "/images/placeholder.svg"}
                              alt={`Miniatura ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized={isExternalImageUrl(image)}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={tour.image || "/images/placeholder.svg"}
                      alt={tour.title}
                      fill
                      className="object-cover object-center"
                      unoptimized={isExternalImageUrl(tour.image)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div>
                  {(() => {
                    const displayPrice = getDisplayPrice(tour, initialValueType === "min_price" ? "min_price" : "main_activity", preferNextSemester)
                    if (displayPrice > 0) return (
                      <>
                        <div className="text-xs text-gray-500 mb-0.5">A partir de</div>
                        <div className="text-3xl font-bold text-green-600">
                          {displayPrice.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                        <div className="text-sm text-gray-500">por pessoa (adulto)</div>
                      </>
                    )
                    return (
                      <>
                        <div className="text-3xl font-bold text-green-600">Consulte o valor</div>
                        <div className="text-sm text-gray-500">Entre em contato para orçamentos</div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-5 text-gray-900">{t("description")}</h2>
                <div className="prose prose-green max-w-none prose-p:max-w-[65ch] prose-headings:scroll-mt-24">
                  {formatDescription(cleanDescriptionPrices(getTranslatedDescription(tour, tour.description ?? "", language)))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{t("location")}</p>
                      <p className="text-gray-600">{tour.location?.trim() ? tour.location : "Bonito, MS"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{t("duration")}</p>
                      <p className="text-gray-600">{tour.duration?.trim() ? tour.duration : t("fullDay")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{t("group")}</p>
                      <p className="text-gray-600">{tour.maxGroupSize && tour.maxGroupSize > 0 ? `${t("upTo")} ${tour.maxGroupSize} ${t("people")}` : t("upTo15")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* O que está incluído — oculto quando não há itens */}
            {(() => {
              const validItems = (tour.included ?? []).filter(item => item !== "includedTransport")
              if (validItems.length === 0) return null
              return (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">{t("whatsIncluded")}</h2>
                    <ul className="space-y-2 text-gray-700">
                      {validItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          {t(item)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })()}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{t("reserveNow")}</h3>

                {(() => {
                  const displayPrice = getDisplayPrice(
                    tour,
                    initialValueType === "min_price" ? "min_price" : "main_activity",
                    preferNextSemester
                  )
                  return (
                    <TourPricesSidebar
                      prices={tour.prices ?? { rows: [], precoMinimo: 0 }}
                      visiblePrices={tour.visible_prices}
                      priceDisplayOverrides={tour.price_display_overrides}
                      preferNextSemester={preferNextSemester}
                      tourSlug={tour.slug}
                      fallbackDisplayPrice={displayPrice > 0 ? displayPrice : undefined}
                      onReserve={() => openModal(tour.title)}
                      duration={tour.duration || undefined}
                    />
                  )
                })()}

                <div className="space-y-4 mb-6">
                  <Button asChild variant="outline" className="w-full transition-colors duration-300 hover:bg-green-50">
                    <Link
                      href="https://wa.me/5567991395384?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20um%20atendimento%20personalizado%20para%20ir%20a%20Bonito%20MS"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("talkToAgent")}
                    </Link>
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">{t("needHelp")}</h4>
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
    </SiteLayout>
  )
}
