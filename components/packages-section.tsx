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
import { useContactModal } from "@/contexts/contact-modal-context"

export function PackagesSection() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { openModal } = useContactModal()

  useEffect(() => {
    const loadPackages = async () => {
      setIsLoading(true)
      try {
        const packagesData = await getAllPackages()
        setPackages(packagesData.slice(0, 4))
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
      const scrollAmount = 400
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
    }
  }

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {t("packagesTitle")}
            </h2>
            <p className="text-gray-600 text-lg">{t("packagesSubtitle")}</p>
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
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

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
              <Button onClick={() => openModal()}>{t("contactUs")}</Button>
            </div>
          )}

          {/* Carousel */}
          {!isLoading && packages.length > 0 && (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              onScroll={handleScroll}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="flex-shrink-0 w-80 overflow-hidden hover:shadow-xl transition-all duration-300 group border border-transparent group-hover:border-green-500"
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
                      <h3 className="text-white font-bold text-lg mb-1">{pkg.title}</h3>
                      <p className="text-green-200 text-sm font-medium">{pkg.subtitle}</p>
                    </div>
                  </div>
                  {/* ======= FIM DO BLOCO CORRIGIDO ======= */}

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Price */}
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
                      <div className="text-sm text-gray-600">{t("perPerson")}</div>

                      {/* Highlights */}
                      <div className="space-y-1">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                            {highlight}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex gap-2">
                          <Link
                            href={`/pacotes/${pkg.slug || createSlug(pkg.title)}`}
                            className="flex-1"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              {t("learnMore")}
                            </Button>
                          </Link>
                          <Button
                            onClick={() => openModal(pkg.title)}
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {t("bookNow")}
                          </Button>
                        </div>
                        <a
                          href={`https://wa.me/556796209978?text=${encodeURIComponent(
                            `Olá! Vim do site Bonito ON e gostaria de mais informações sobre o pacote ${pkg.title}.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Fale Com um Especialista
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
