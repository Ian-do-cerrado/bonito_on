"use client"

import { useState, useEffect, useRef } from "react"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import type { Tour } from "@/services/supabase-tours"
import { gsap } from "gsap"
import { SiteLayout } from "@/components/site-layout"
import { PUBLIC_DEFAULT_PREFER_S2, S2_CURRENT_LABEL, semesterLinkQuery } from "@/lib/semester-config"

interface ToursTarifarioProps {
  preferNextSemester?: boolean
}

export function ToursTarifario({ preferNextSemester = PUBLIC_DEFAULT_PREFER_S2 }: ToursTarifarioProps) {
  const { t } = useLanguage()
  const [tours, setTours] = useState<Tour[]>([])
  const [activeCategory, setActiveCategory] = useState<Tour["category"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const tabsRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const cacheKey = preferNextSemester ? "tours:semester2" : "tours:semester1"
  
  const filteredTours = tours.filter((tour) => {
    const matchesCategory = activeCategory === "all" || tour.category === activeCategory
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    const loadTours = async () => {
      const cachedTours = localStorage.getItem(cacheKey)
      if (cachedTours) {
        try {
          const parsed = JSON.parse(cachedTours)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Exibe conteúdo instantaneamente e atualiza em background.
            setTours(parsed)
          }
        } catch {
          // Ignora cache inválido e segue com fetch.
        }
      }

      try {
        const url = `/api/tours${semesterLinkQuery(preferNextSemester)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch tours")
        const toursData: Tour[] = await res.json()
        setTours(toursData)
        localStorage.setItem(cacheKey, JSON.stringify(toursData))
        localStorage.setItem("tours", JSON.stringify(toursData))
      } catch (error) {
        console.error("Error loading tours:", error)
        const savedTours = localStorage.getItem(cacheKey) || localStorage.getItem("tours")
        if (savedTours) {
          try {
            setTours(JSON.parse(savedTours))
          } catch {
            setTours([])
          }
        }
      }
    }

    loadTours()
  }, [preferNextSemester, cacheKey])

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail)
    }

    window.addEventListener("changeTourCategory", handleCategoryChange as EventListener)
    return () => {
      window.removeEventListener("changeTourCategory", handleCategoryChange as EventListener)
    }
  }, [])

  const checkScrollPosition = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

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

  useEffect(() => {
    const tabsElement = tabsRef.current
    if (tabsElement) {
      tabsElement.addEventListener("scroll", checkScrollPosition)
      checkScrollPosition()
    }
    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [])

  useEffect(() => {
    // Initial entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
    
    tl.fromTo(".title-gsap", { y: -30, opacity: 0 }, { y: 0, opacity: 1 })
      .fromTo(".search-gsap", { x: 30, opacity: 0 }, { x: 0, opacity: 1 }, "-=0.6")
      .fromTo(".btn-gsap", { x: 30, opacity: 0 }, { x: 0, opacity: 1 }, "-=0.6")
      .fromTo(".tabs-gsap", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.4")
  }, [])

  useEffect(() => {
    // Animate cards when they change (due to filtering or initial load)
    if (filteredTours.length > 0) {
      gsap.fromTo(".tour-card-gsap", 
        { y: 30, opacity: 0, scale: 0.9 }, 
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          stagger: 0.05, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          overwrite: "auto"
        }
      )
    }
  }, [filteredTours.length, activeCategory, searchQuery])

  useEffect(() => {
    // Hover effects for cards
    const cards = document.querySelectorAll(".tour-card-gsap")
    
    const handleMouseEnter = (e: Event) => {
      gsap.to(e.currentTarget, { 
        scale: 1.03, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        borderColor: "rgb(34 197 94 / 0.3)",
        duration: 0.4, 
        ease: "power2.out" 
      })
    }
    
    const handleMouseLeave = (e: Event) => {
      gsap.to(e.currentTarget, { 
        scale: 1, 
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        borderColor: "transparent",
        duration: 0.4, 
        ease: "power2.out" 
      })
    }

    cards.forEach(card => {
      card.addEventListener("mouseenter", handleMouseEnter)
      card.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      cards.forEach(card => {
        card.removeEventListener("mouseenter", handleMouseEnter)
        card.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [filteredTours])

  const getCategoryTitle = (category: Tour["category"] | "all") => {
    switch (category) {
      case "all": return t("all")
      case "resort": return t("resort")
      case "floating": return t("floating")
      case "adventure": return t("adventure")
      case "waterfall": return t("waterfall")
      case "contemplation": return t("contemplation")
      case "biking": return t("biking")
      case "pantanal": return t("pantanal")
      case "scubaDiving": return t("scubaDiving")
      case "rappelling": return t("rappelling")
      case "cave": return t("cave")
      default: return t("all")
    }
  }

  return (
    <SiteLayout>
      <section id="tours" className="py-12 sm:py-16 bg-gray-50 overflow-hidden pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center sm:text-left title-gsap">
            {preferNextSemester
              ? `Passeios em Bonito (${S2_CURRENT_LABEL})`
              : "Passeios em Bonito — prévia de valores futuros"}
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {!preferNextSemester && (
              <Link href="/tarifario" className="w-full sm:w-auto btn-gsap">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 rounded-full font-medium"
                >
                  Ver tarifas vigentes (S2)
                </Button>
              </Link>
            )}
            <div className="relative w-full sm:w-64 search-gsap">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-full"
              />
            </div>
          </div>
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
            onValueChange={(value) => setActiveCategory(value as Tour["category"] | "all")}
            className="tabs-gsap"
          >
            <div className="relative overflow-hidden">
              <TabsList ref={tabsRef} className="flex overflow-x-auto scrollbar-hide p-1 bg-gray-100 rounded-md w-full">
                {["all", "resort", "floating", "adventure", "waterfall", "contemplation", "biking", "pantanal", "scubaDiving", "rappelling", "cave"].map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="flex-shrink-0 font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all duration-200 whitespace-nowrap px-3 sm:px-4 text-sm"
                  >
                    {getCategoryTitle(cat as Tour["category"])}
                  </TabsTrigger>
                ))}
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

        <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="tour-card-gsap h-full"
            >
              <TourCard tour={tour} preferNextSemester={preferNextSemester} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href={preferNextSemester ? "/tarifario-2o-semestre" : "/tarifario"}>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto max-w-xs"
            >
              {t("seeAllAttractions")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </SiteLayout>
  )
}
