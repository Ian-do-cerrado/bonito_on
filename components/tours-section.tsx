import { useState, useEffect, useRef } from "react"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getAllTours, Tour as SupabaseTour } from "@/services/supabase-tours"
import type { DatabaseTour } from "@/lib/supabase/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
export type Tour = SupabaseTour






















export function ToursSection() {
  const { t } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [activeCategory, setActiveCategory] = useState<Tour["category"]>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const tabsRef = useRef<HTMLDivElement>(null)
  const [cardsCarouselApi, setCardsCarouselApi] = useState<CarouselApi>()
  const [cardIndex, setCardIndex] = useState(0)
  const [cardCount, setCardCount] = useState(0)

  useEffect(() => {
    const loadTours = async () => {
      try {
        const toursData = await getAllTours()
        setTours(toursData)
      } catch (error) {
        console.error("Error loading tours:", error)
        // Fallback to localStorage if Supabase fails
        const savedTours = localStorage.getItem("tours")
        if (savedTours) {
          setTours(JSON.parse(savedTours))
        }
      }
    }

    loadTours()
  }, [])

  // Listen for category change events from navigation
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
    .slice(0, 8)

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

  useEffect(() => {
    if (!cardsCarouselApi) return

    const updateCarouselState = () => {
      setCardCount(cardsCarouselApi.scrollSnapList().length)
      setCardIndex(cardsCarouselApi.selectedScrollSnap())
    }

    updateCarouselState()
    cardsCarouselApi.on("select", updateCarouselState)
    cardsCarouselApi.on("reInit", updateCarouselState)

    return () => {
      cardsCarouselApi.off("select", updateCarouselState)
      cardsCarouselApi.off("reInit", updateCarouselState)
    }
  }, [cardsCarouselApi])

  useEffect(() => {
    cardsCarouselApi?.scrollTo(0)
    setCardIndex(0)
  }, [activeCategory, searchTerm, tours, cardsCarouselApi])

  return (
    <section id="tours" className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29]">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 to-transparent opacity-60"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200&query=abstract+pattern')] opacity-5 mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 animate-fade-in-up gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight animate-slide-in-left text-center sm:text-left">
            {t("passeios")} {t("toursInBonito")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              <Input
                type="text"
                placeholder={t("searchTours")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/10 text-white placeholder:text-white/70 border-white/30 focus:border-white focus:ring-white"
              />
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2 block text-center sm:text-left">
          Filtrar por categoria
        </span>
        <p className="text-xs text-white/50 mb-3 text-center sm:text-left">
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

        <div className="relative">
          <Carousel opts={{ loop: true, align: "center" }} setApi={setCardsCarouselApi}>
            <CarouselContent className="-ml-4 sm:-ml-6 items-stretch">
              {filteredTours.map((tour, index) => (
                <CarouselItem key={tour.id} className="pl-4 sm:pl-6 basis-[82vw] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex">
                  <div
                    className="h-full w-full animate-fade-in-up shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TourCard tour={tour as unknown as DatabaseTour} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 backdrop-blur-sm shadow-lg border-0 left-2 sm:-left-4 w-10 h-10 hover:bg-white" />
            <CarouselNext className="bg-white/90 backdrop-blur-sm shadow-lg border-0 right-2 sm:-right-4 w-10 h-10 hover:bg-white" />
          </Carousel>

          {cardCount > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: cardCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => cardsCarouselApi?.scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === cardIndex ? "bg-green-400" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botões na linha de baixo */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/tarifario">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-xs"
            >
              {t("seeAllAttractions")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
