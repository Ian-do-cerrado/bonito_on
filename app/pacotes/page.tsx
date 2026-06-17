"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Clock, Users, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiteLayout } from "@/components/site-layout"
import type { Package } from "@/types/package"
// SUSPENDED: import { useContactModal } from "@/hooks/use-contact-modal"
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
import { packageService } from "@/services/supabase-packages"
import { useLanguage } from "@/contexts/language-context"
import { htmlToPlainText } from "@/lib/text-format"

export default function PackagesPage() {
  const { t } = useLanguage()
  const router = useRouter()
  // SUSPENDED: const { openModal } = useContactModal()
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price-asc")

  // Garantir que a página inicie no topo
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true)
        const packageData = await packageService.getAllPackages()
        setPackages(packageData)
        setFilteredPackages(packageData)
      } catch (error) {
        console.error("Error loading packages:", error)
        // Fallback to localStorage
        const savedPackages = localStorage.getItem("packages")
        if (savedPackages) {
          const localPackages: Package[] = JSON.parse(savedPackages)
          setPackages(localPackages)
          setFilteredPackages(localPackages)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPackages()
  }, [])

  // Filter and sort packages
  useEffect(() => {
    const filtered = packages.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || pkg.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "duration-asc":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        case "duration-desc":
          return Number.parseInt(b.duration) - Number.parseInt(a.duration)
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setFilteredPackages(filtered)
  }, [packages, searchTerm, categoryFilter, sortBy])

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "economico":
        return t("categoryEconomico")
      case "premium":
        return "Premium"
      case "luxo":
        return t("categoryLuxo")
      default:
        return t("categoryPadrao")
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economico":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "luxo":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loadingPackages")}</p>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative h-72 pt-16 bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29]">
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">{t("completePackagesTitle")}</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-2xl leading-relaxed">
              {t("completePackagesSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("searchPackagesPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                <SelectItem value="economico">{t("categoryEconomico")}</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="luxo">{t("categoryLuxo")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortByLabel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">{t("sortLowestPrice")}</SelectItem>
                <SelectItem value="price-desc">{t("sortHighestPrice")}</SelectItem>
                <SelectItem value="duration-asc">{t("sortShortestDuration")}</SelectItem>
                <SelectItem value="duration-desc">{t("sortLongestDuration")}</SelectItem>
                <SelectItem value="rating">{t("sortBestRating")}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredPackages.length} {filteredPackages.length !== 1 ? t("packagesFoundPlural") : t("packagesFoundSingular")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("noPackagesFiltered")}</h3>
              <p className="text-gray-600 mb-4">{t("tryAdjustFilters")}</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setSortBy("price-asc")
                }}
                variant="outline"
              >
                {t("clearFilters")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="group h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={getCategoryColor(pkg.category)}>{getCategoryLabel(pkg.category)}</Badge>
                      {pkg.originalPrice && (
                        <Badge className="bg-red-500 text-white">
                          {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl leading-tight">{pkg.title}</CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">{pkg.subtitle}</p>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">{htmlToPlainText(pkg.description)}</p>

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
                      <div className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{t("upTo")} {pkg.maxPeople}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span>{pkg.rating}</span>
                      </div>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-4">
                      <div className="mb-4">
                        {pkg.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            R$ {pkg.originalPrice.toFixed(2).replace(".", ",")}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-green-600">
                          R$ {pkg.price.toFixed(2).replace(".", ",")}
                        </div>
                        <div className="text-sm text-gray-600">{t("perPerson")}</div>
                      </div>

                      <div className="space-y-2">
                        <Link href={`/pacotes/${createSlug(pkg.title)}`} className="w-full">
                          <Button size="sm" variant="outline" className="w-full">
                            {t("learnMore")}
                          </Button>
                        </Link>
                        {/*
                        SUSPENDED:
                        <Button size="sm" variant="outline" onClick={openModal} ...>Reservar</Button>
                        */}
                        <WhatsAppCtaButton
                          message={`Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${pkg.title}.`}
                          label={t("bookWhatsApp")}
                          className="h-9 rounded-md px-3 text-sm whitespace-nowrap"
                        />
                      </div>
                    </div>
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
