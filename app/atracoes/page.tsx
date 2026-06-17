"use client"

import { useEffect, useMemo, useState } from "react"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bed, Calendar, Car, Clock, MapPin, Star, Users, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteLayout } from "@/components/site-layout"
import { useLanguage } from "@/contexts/language-context"
import { getAllAttractions, type Attraction } from "@/services/supabase-attractions"
import { htmlToPlainText } from "@/lib/text-format"

export default function AttractionsPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const categories: { value: Attraction["category"] | "all"; label: string }[] = [
    { value: "all", label: t("allAttractions") },
    { value: "gastronomy", label: t("food") },
    { value: "accommodation", label: t("atracaoHospedagem") },
    { value: "transport", label: t("transportation") },
    { value: "events", label: t("events") },
  ]
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<Attraction["category"] | "all">("all")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const category = params.get("categoria") as Attraction["category"] | null
    if (category && categories.some((item) => item.value === category)) {
      setActiveCategory(category)
    }
  }, [])

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const data = await getAllAttractions()
        setAttractions(data)
      } finally {
        setIsLoading(false)
      }
    }

    loadAttractions()
  }, [])

  const filteredAttractions = useMemo(() => {
    if (activeCategory === "all") return attractions
    return attractions.filter((attraction) => attraction.category === activeCategory)
  }, [activeCategory, attractions])

  const handleCategoryChange = (category: Attraction["category"] | "all") => {
    setActiveCategory(category)
    const query = category === "all" ? "" : `?categoria=${category}`
    router.replace(`/atracoes${query}`, { scroll: false })
  }

  return (
    <SiteLayout>
      <section className="relative h-72 pt-16 bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <div className="mb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backBtn")}
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">{t("atracoesPageTitle")}</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-2xl leading-relaxed">
              {t("atracoesPageSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-green-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.value
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {getCategoryIcon(category.value)}
                {category.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
            </div>
          ) : filteredAttractions.length === 0 ? (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                {getCategoryIcon(activeCategory)}
              </div>
              <h2 className="text-lg font-semibold text-gray-700">{t("noAttractionsFound")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {t("noAttractionsInCategory")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAttractions.map((attraction) => (
                <Card key={attraction.id} className="group h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <SafeImage
                      src={attraction.image}
                      alt={attraction.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-800">{getCategoryLabel(attraction.category, t)}</Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{attraction.rating}</span>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-1 flex-col">
                    <h2 className="text-xl font-semibold leading-tight mb-2">{attraction.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-5">
                      {htmlToPlainText(attraction.description)}
                    </p>

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-gray-600">
                      <div className="inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{attraction.location}</span>
                      </div>
                      {attraction.duration && (
                        <div className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{attraction.duration}</span>
                        </div>
                      )}
                      {attraction.capacity && (
                        <div className="inline-flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{attraction.capacity}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/atracoes/${attraction.slug}`} className="mt-auto w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        {t("learnMore")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  )
}

function getCategoryLabel(category: Attraction["category"], t: (key: string) => string) {
  const labels: Record<Attraction["category"], string> = {
    gastronomy: t("food"),
    accommodation: t("atracaoHospedagem"),
    transport: t("transportation"),
    events: t("events"),
  }

  return labels[category]
}

function getCategoryIcon(category: Attraction["category"] | "all") {
  switch (category) {
    case "gastronomy":
      return <Utensils className="w-4 h-4" />
    case "accommodation":
      return <Bed className="w-4 h-4" />
    case "transport":
      return <Car className="w-4 h-4" />
    case "events":
      return <Calendar className="w-4 h-4" />
    default:
      return <Star className="w-4 h-4" />
  }
}
