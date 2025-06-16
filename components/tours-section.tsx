import { useState, useEffect, useRef } from "react"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getAllTours, Tour as SupabaseTour } from "@/services/supabase-tours"
export type Tour = SupabaseTour






















export function ToursSection() {
  const { t } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [activeCategory, setActiveCategory] = useState<Tour["category"]>("all")
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

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
      // Initial check
      checkScrollPosition()
    }
    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [])

  const filteredTours =
    activeCategory === "all" ? tours.slice(0, 8) : tours.filter((tour) => tour.category === activeCategory).slice(0, 8)

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
    <section id="tours" className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 animate-fade-in-up gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight animate-slide-in-left text-center sm:text-left">
            Passeios em Bonito
          </h2>
          <Link href="/tarifario" className="self-center sm:self-auto">
            <Button
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white font-medium animate-slide-in-right hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            >
              {t("seeAll")}
            </Button>
          </Link>
        </div>

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
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("all")}
                </TabsTrigger>
                <TabsTrigger
                  value="resort"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("resort")}
                </TabsTrigger>
                <TabsTrigger
                  value="floating"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("floating")}
                </TabsTrigger>
                <TabsTrigger
                  value="adventure"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("adventure")}
                </TabsTrigger>
                <TabsTrigger
                  value="waterfall"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("waterfall")}
                </TabsTrigger>
                <TabsTrigger
                  value="contemplation"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("contemplation")}
                </TabsTrigger>
                <TabsTrigger
                  value="biking"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("biking")}
                </TabsTrigger>
                <TabsTrigger
                  value="pantanal"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("pantanal")}
                </TabsTrigger>
                <TabsTrigger
                  value="scubaDiving"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("scubaDiving")}
                </TabsTrigger>
                <TabsTrigger
                  value="rappelling"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                >
                  {t("rappelling")}
                </TabsTrigger>
                <TabsTrigger
                  value="cave"
                  className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white hover:scale-105 transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTours.map((tour, index) => (
            <div
              key={tour.id}
              className="animate-fade-in-up hover:animate-bounce-subtle"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>

        {/* Botões na linha de baixo */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/tarifario">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-xs"
            >
              {t("seeAllAttractions")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
