"use client"

import { useState, useEffect, useRef } from "react"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getAllTours, Tour as SupabaseTour } from "@/services/supabase-tours"
import { SiteLayout } from "@/components/site-layout"
import type { DatabaseTour } from "@/lib/supabase/types"

export type Tour = SupabaseTour

export default function ToursPage() {
  const { t } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [activeCategory, setActiveCategory] = useState<Tour["category"]>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadTours = async () => {
      try {
        const toursData = await getAllTours()
        setTours(toursData)
      } catch (error) {
        console.error("Error loading tours:", error)
        const savedTours = localStorage.getItem("tours")
        if (savedTours) {
          setTours(JSON.parse(savedTours))
        }
      }
    }

    loadTours()
  }, [])

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail)
    }

    window.addEventListener("changeTourCategory", handleCategoryChange as EventListener)
    return () => {
      window.removeEventListener("changeTourCategory", handleCategoryChange as EventListener)
    }
  }, [])

  const scrollFilter = (direction: "left" | "right") => {
    const el = tabsRef.current
    if (!el) return

    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
    const atStart = el.scrollLeft <= 4

    if (direction === "right") {
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" })
      else el.scrollBy({ left: 200, behavior: "smooth" })
    } else {
      if (atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" })
      else el.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const tabsElement = tabsRef.current
    if (tabsElement) {
      requestAnimationFrame(() => {
        tabsElement.scrollTo({ left: 0 })
      })
    }
  }, [])

  useEffect(() => {
    if (activeCategory !== "all") return

    requestAnimationFrame(() => {
      if (tabsRef.current) tabsRef.current.scrollLeft = 0
    })
  }, [activeCategory])

  const filteredTours = tours
    .filter((tour) => {
      const matchesCategory = activeCategory === "all" || tour.category === activeCategory
      const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })

  const categoryOptions: [Tour["category"], string, number][] = [
    ["all", t("all"), tours.length],
    ["adventure", t("adventure"), tours.filter((tour) => tour.category === "adventure").length],
    ["contemplation", t("contemplation"), tours.filter((tour) => tour.category === "contemplation").length],
    ["cave", t("cave"), tours.filter((tour) => tour.category === "cave").length],
    ["waterfall", t("waterfall"), tours.filter((tour) => tour.category === "waterfall").length],
    ["rappelling", t("rappelling"), tours.filter((tour) => tour.category === "rappelling").length],
    ["horseback", t("horseback"), tours.filter((tour) => tour.category === "horseback").length],
    ["biking", t("biking"), tours.filter((tour) => tour.category === "biking").length],
    ["scubaDiving", t("scubaDiving"), tours.filter((tour) => tour.category === "scubaDiving").length],
    ["resort", t("resort"), tours.filter((tour) => tour.category === "resort").length],
    ["floating", t("floating"), tours.filter((tour) => tour.category === "floating").length],
    ["pantanal", t("pantanal"), tours.filter((tour) => tour.category === "pantanal").length],
  ]

  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Passeios em Bonito</h1>
          <p className="text-base sm:text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
            Encontre experiências, filtre por categoria e consulte os passeios disponíveis em Bonito.
          </p>
        </div>
      </section>

      <section id="tours" className="py-12 sm:py-16 bg-green-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 animate-fade-in-up gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight animate-slide-in-left text-center sm:text-left">
            Todos os passeios
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder={t("searchTours")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/valor-futuro" className="self-center sm:self-auto">
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white font-medium animate-slide-in-right hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
              >
                Ver preços do próximo semestre
              </Button>
            </Link>
          </div>
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block text-center sm:text-left">
          Filtrar por categoria
        </span>
        <p className="text-xs text-gray-500 mb-3 text-center sm:text-left">
          <span className="sm:hidden">Arraste para ver mais categorias e toque para filtrar os passeios</span>
          <span className="hidden sm:inline">Clique em uma categoria para filtrar os passeios</span>
        </p>

        <div className="relative mb-6 sm:mb-8">
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scrollFilter("left")}
              className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
              aria-label="Rolar categorias para a esquerda"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div ref={tabsRef} className="flex overflow-x-auto scrollbar-hide gap-2 py-1 flex-1">
              {categoryOptions.map(([value, label, count]) => (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap shadow-sm ${
                    activeCategory === value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  {label} <span className="ml-1 opacity-70">({count})</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollFilter("right")}
              className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
              aria-label="Rolar categorias para a direita"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTours.map((tour, index) => (
            <div
              key={tour.id}
              className="animate-fade-in-up hover:animate-bounce-subtle"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TourCard tour={tour as unknown as DatabaseTour} />
            </div>
          ))}
        </div>

        </div>
      </section>
    </SiteLayout>
  )
}
