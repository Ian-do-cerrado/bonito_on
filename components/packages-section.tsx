"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import type { Package } from "@/types/package"
import { useContactModal } from "@/contexts/contact-modal-context"
import { getTranslatedPackageDescription, getTranslatedPackageTitle, getTranslatedPackageSubtitle } from "@/lib/dynamic-translations"

interface PackagesSectionProps {
  initialPackages?: Package[] | null
}

export function PackagesSection({ initialPackages }: PackagesSectionProps = {}) {
  const { t, language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [packages, setPackages] = useState<Package[]>(initialPackages?.slice(0, 4) ?? [])
  const [isLoading, setIsLoading] = useState(initialPackages == null)
  const { openModal } = useContactModal()

  useEffect(() => {
    if (initialPackages != null && initialPackages.length > 0) {
      setPackages(initialPackages.slice(0, 4))
      setIsLoading(false)
      return
    }
    const loadPackages = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/packages")
        if (!res.ok) throw new Error("Failed to fetch packages")
        const packagesData = await res.json()
        setPackages(packagesData.slice(0, 4))
      } catch (error) {
        console.error("Error loading packages:", error)
        setPackages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPackages()
  }, [initialPackages])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">{t("packagesTitle")}</h2>
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
                  className="flex-shrink-0 w-80 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-green-100/60 border border-gray-100 bg-white rounded-2xl group"
                >
                  <div className="relative h-48">
                    <Image
                      src={pkg.image || "/placeholder.svg?height=300&width=400&query=tropical%20destination"}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
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
                          ? t("pkgEconomy")
                          : pkg.category === "premium"
                            ? t("pkgPremium")
                            : pkg.category === "luxo"
                              ? t("pkgLuxury")
                              : t("pkgStandard")}
                      </span>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">{getTranslatedPackageTitle(pkg, pkg.title, language)}</h3>
                      <p className="text-green-200 text-sm font-medium line-clamp-2">
                        {getTranslatedPackageSubtitle(pkg, pkg.subtitle || pkg.description, language)}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Price */}
                      <div className="flex flex-col">
                        {pkg.price > 0 ? (
                          <>
                            <div className="text-xs text-gray-500">{t("from")}</div>
                            <div className="text-xl font-bold text-green-600">
                              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pkg.price)}
                            </div>
                            <div className="text-xs text-gray-500">{t("perPerson")}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-bold text-green-600">{t("priceOnRequest")}</div>
                            <div className="text-xs text-gray-500">{t("contactForQuote")}</div>
                          </>
                        )}
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1">
                        {(pkg.highlights || []).slice(0, 3).map((highlight, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                            {highlight}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/pacotes/${pkg.slug || createSlug(pkg.title)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            {t("learnMore")}
                          </Button>
                        </Link>
                        <Button onClick={() => openModal(pkg.title)} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          {t("bookNow")}
                        </Button>
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
