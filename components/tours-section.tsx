import { useState, useEffect, useRef } from "react"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
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

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Scroll handlers
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const tabsElement = tabsRef.current
    if (tabsElement) {
      tabsElement.addEventListener("scroll", checkScrollPosition)
      requestAnimationFrame(() => {
        tabsElement.scrollTo({ left: 0 })
        checkScrollPosition()
      })
    }
    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [])

  useEffect(() => {
    if (activeCategory !== "all") return

    requestAnimationFrame(() => {
      if (tabsRef.current) tabsRef.current.scrollLeft = 0
      checkScrollPosition()
    })
  }, [activeCategory])

  const filteredTours = tours
    .filter((tour) => {
      const matchesCategory = activeCategory === "all" || tour.category === activeCategory
      const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .slice(0, 8)

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

  const getCategoryTitle = (category: Tour["category"]) => {
    switch (category) {
      case "all":
        return t("all")
      case "resort":
        return t("resort")
      case "floating":
        return t("floating")
      case "adventure":
        return t("adventure")
      case "waterfall":
        return t("waterfall")
      case "contemplation":
        return t("contemplation")
      case "biking":
        return t("biking")
      case "pantanal":
        return t("pantanal")
      case "scubaDiving":
        return t("scubaDiving")
      case "rappelling":
        return t("rappelling")
      case "cave":
        return t("cave")
      default:
        return t("all")
    }
  }

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

        <p className="text-xs text-white/50 mb-3 text-center sm:text-left">
          <span className="sm:hidden">Arraste para ver mais categorias e toque para filtrar os passeios</span>
          <span className="hidden sm:inline">Clique em uma categoria para filtrar os passeios</span>
        </p>

        <div className="relative mb-6 sm:mb-8">
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white rounded-full p-1 sm:p-1 shadow-md z-10 hover:bg-gray-100 hidden sm:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </button>
          )}

          <Tabs
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as Tour["category"])}
            className="animate-fade-in-up animation-delay-200"
          >
            <div className="relative overflow-hidden">
              <TabsList ref={tabsRef} className="flex justify-start overflow-x-auto scrollbar-hide p-1 bg-gray-100 rounded-md w-full">
                <TabsTrigger
                  value="all"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("all")}
                </TabsTrigger>
                <TabsTrigger
                  value="resort"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("resort")}
                </TabsTrigger>
                <TabsTrigger
                  value="floating"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("floating")}
                </TabsTrigger>
                <TabsTrigger
                  value="adventure"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("adventure")}
                </TabsTrigger>
                <TabsTrigger
                  value="waterfall"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("waterfall")}
                </TabsTrigger>
                <TabsTrigger
                  value="contemplation"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("contemplation")}
                </TabsTrigger>
                <TabsTrigger
                  value="biking"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("biking")}
                </TabsTrigger>
                <TabsTrigger
                  value="pantanal"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("pantanal")}
                </TabsTrigger>
                <TabsTrigger
                  value="scubaDiving"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("scubaDiving")}
                </TabsTrigger>
                <TabsTrigger
                  value="rappelling"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("rappelling")}
                </TabsTrigger>
                <TabsTrigger
                  value="cave"
                  className="flex-shrink-0 font-medium text-black data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("cave")}
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white rounded-full p-1 sm:p-1 shadow-md z-10 hover:bg-gray-100 hidden sm:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </button>
          )}
        </div>

        <div className="relative">
          <Carousel opts={{ loop: true, align: "center" }} setApi={setCardsCarouselApi}>
            <CarouselContent className="-ml-4 sm:-ml-6">
              {filteredTours.map((tour, index) => (
                <CarouselItem key={tour.id} className="pl-4 sm:pl-6 basis-[82vw] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div
                    className="h-full animate-fade-in-up shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TourCard tour={tour as unknown as DatabaseTour} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 backdrop-blur-sm shadow-lg border-0 -left-4 w-10 h-10 hover:bg-white sm:hidden" />
            <CarouselNext className="bg-white/90 backdrop-blur-sm shadow-lg border-0 -right-4 w-10 h-10 hover:bg-white sm:hidden" />
          </Carousel>

          {cardCount > 1 && (
            <div className="flex justify-center mt-4 gap-2 sm:hidden">
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
