"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import type { Package } from "@/types/package"
import { getAllPackages } from "@/services/supabase-packages"
// SUSPENDED: import { useContactModal } from "@/contexts/contact-modal-context"
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"

export function PackagesSection() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // SUSPENDED: const { openModal } = useContactModal()

  useEffect(() => {
    const loadPackages = async () => {
      setIsLoading(true)
      try {
        const packagesData = await getAllPackages()
        setPackages(packagesData)
      } catch (error) {
        console.error("Error loading packages:", error)
        setPackages([])
      } finally {
        setIsLoading(false)
      }
    }
    loadPackages()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      const cardWidth = scrollWidth / packages.length
      setCurrentIndex(Math.round(scrollLeft / cardWidth))
    }
  }

  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(() => handleScroll())
    }
  }, [isLoading])

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {t("packagesTitle")}
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">{t("packagesSubtitle")}</p>
          </div>
          <Link href="/pacotes" className="self-center sm:self-auto">
            <Button variant="outline" className="group transition-all duration-300 hover:pr-5">
              {t("seeAllPackages")}
              <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300" />
            </Button>
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && packages.length === 0 && (
            <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
              <p className="text-gray-500 text-lg mb-4">{t("noPackagesFound")}</p>
              {/*
              SUSPENDED:
              <Button onClick={() => openModal()}>{t("contactUs")}</Button>
              */}
              <WhatsAppCtaButton
                message="Olá! Vim do site Bonito ON e gostaria de informações sobre os pacotes disponíveis."
                label={t("contactWhatsApp")}
                className="max-w-xs"
              />
            </div>
          )}

          {/* Carousel */}
          {!isLoading && packages.length > 0 && (
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory sm:snap-none -mx-4 sm:mx-0 px-[9vw] sm:px-0"
              onScroll={handleScroll}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="flex flex-col flex-shrink-0 w-[82vw] lg:w-[calc(25%-18px)] snap-center lg:snap-start overflow-hidden hover:shadow-xl transition-all duration-300 group border border-transparent group-hover:border-green-500"
                >
                  {/* ======= BLOCO DA IMAGEM/OVERLAY CORRIGIDO ======= */}
                  <div className="relative h-48 overflow-hidden isolate">
                    {/* Wrapper da imagem (escala aqui) */}
                    <div className="absolute inset-0 z-0 transition-transform duration-300 will-change-transform group-hover:scale-105">
                      <Image
                        src={
                          pkg.image ||
                          "/placeholder.svg?height=300&width=400&query=tropical%20destination"
                        }
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Overlay acima da imagem */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/70" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pkg.category === "economico"
                            ? "bg-blue-100 text-blue-800"
                            : pkg.category === "premium"
                            ? "bg-purple-100 text-purple-800"
                            : pkg.category === "luxo"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pkg.category === "economico"
                          ? "Econômico"
                          : pkg.category === "premium"
                          ? "Premium"
                          : pkg.category === "luxo"
                          ? "Luxo"
                          : "Padrão"}
                      </span>
                    </div>

                    {/* Título/Subtítulo */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h3 className="text-lg font-semibold text-white mb-1">{pkg.title}</h3>
                      <p className="text-green-200 text-sm font-medium">{pkg.subtitle}</p>
                    </div>
                  </div>
                  {/* ======= FIM DO BLOCO CORRIGIDO ======= */}

                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Top content */}
                    <div className="space-y-4">
                      {/* Price */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl font-bold text-green-600">
                            R$ {pkg.price.toLocaleString("pt-BR")}
                          </div>
                          {pkg.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              R$ {pkg.originalPrice.toLocaleString("pt-BR")}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{t("perPerson")}</div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                      {/* Actions — pinned to bottom */}
                      <div className="flex flex-col gap-2 pt-4 mt-auto">
                        <Link
                          href={`/pacotes/${pkg.slug || createSlug(pkg.title)}`}
                          className="w-full"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            {t("learnMore")}
                          </Button>
                        </Link>
                        {/*
                        SUSPENDED:
                        <Button
                          onClick={() => openModal(pkg.title)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {t("bookNow")}
                        </Button>
                        */}
                        {/*
                        SUSPENDED:
                        <a href={`https://wa.me/5567991395384?text=...`} className="...bg-orange-500...">
                          Fale Com um Especialista
                        </a>
                        */}
                        <WhatsAppCtaButton
                          message={`Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${pkg.title}.`}
                          label={t("bookWhatsApp")}
                          className="text-sm"
                        />
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Dots */}
          {!isLoading && packages.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {packages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollRef.current) {
                      const cardWidth = scrollRef.current.scrollWidth / packages.length
                      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" })
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
