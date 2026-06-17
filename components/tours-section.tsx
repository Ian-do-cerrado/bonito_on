import { useState, useEffect, useRef } from "react"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getAllTours, Tour as SupabaseTour } from "@/services/supabase-tours"
export type Tour = SupabaseTour






















export function ToursSection() {
  const { t } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [activeCategory, setActiveCategory] = useState<Tour["category"]>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [cardsCanLeft, setCardsCanLeft] = useState(false)
  const [cardsCanRight, setCardsCanRight] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)

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

  const handleCardsScroll = () => {
    if (cardsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cardsRef.current
      setCardsCanLeft(scrollLeft > 0)
      setCardsCanRight(scrollLeft < scrollWidth - clientWidth - 10)
      if (filteredTours.length > 0) {
        setCardIndex(Math.round(scrollLeft / (scrollWidth / filteredTours.length)))
      }
    }
  }

  const scrollCards = (direction: "left" | "right") => {
    if (cardsRef.current) {
      cardsRef.current.scrollBy({
        left: direction === "left" ? -cardsRef.current.clientWidth : cardsRef.current.clientWidth,
        behavior: "smooth",
      })
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const tabsElement = tabsRef.current
    if (tabsElement) {
      tabsElement.addEventListener("scroll", checkScrollPosition)
      // Initial check
      checkScrollPosition()
    }
    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [])

  useEffect(() => {
    if (cardsRef.current) {
      cardsRef.current.scrollTo({ left: 0 })
    }
    setCardIndex(0)
    setCardsCanLeft(false)
    requestAnimationFrame(() => handleCardsScroll())
  }, [activeCategory, searchTerm, tours])

  const filteredTours = tours
    .filter((tour) => {
      const matchesCategory = activeCategory === "all" || tour.category === activeCategory
      const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .slice(0, 8)

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
            <Link href="/tarifario" className="self-center sm:self-auto">
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white font-medium animate-slide-in-right hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
              >
                {t("seeAll")}
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-white/50 mb-3 text-center sm:text-left">Clique em uma categoria para filtrar os passeios</p>

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
              <TabsList ref={tabsRef} className="flex overflow-x-auto scrollbar-hide p-1 bg-gray-100 rounded-md w-full">
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
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300 sm:hidden"
            onClick={() => scrollCards("left")}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300 sm:hidden"
            onClick={() => scrollCards("right")}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div
            ref={cardsRef}
            className="flex sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory sm:snap-none scrollbar-hide pb-4 sm:pb-0 pl-[calc(50%-41vw)] pr-[calc(50%-41vw)] sm:pl-0 sm:pr-0"
            onScroll={handleCardsScroll}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredTours.map((tour, index) => (
              <div
                key={tour.id}
                className="flex-shrink-0 w-[82vw] sm:w-auto h-full animate-fade-in-up shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 snap-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-2 sm:hidden">
            {filteredTours.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (cardsRef.current && filteredTours.length > 0) {
                    const cardWidth = cardsRef.current.scrollWidth / filteredTours.length
                    cardsRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" })
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === cardIndex ? "bg-green-400" : "bg-white/40"
                }`}
              />
            ))}
          </div>
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
