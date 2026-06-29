"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MapPin, Clock, Users, Phone, Mail, Check, Calendar, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SiteLayout } from "@/components/site-layout"
import type { Package } from "@/types/package"
import { useContactModal } from "@/contexts/contact-modal-context"
import { packageService } from "@/services/supabase-packages"
import { useLanguage } from "@/contexts/language-context"
import { getTranslatedPackageDescription, getTranslatedPackageTitle, getTranslatedPackageSubtitle } from "@/lib/dynamic-translations"
import { formatDescription } from "@/lib/text-formatter"

interface PackageDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

export default function PackageDetailPage({ params: paramsPromise }: PackageDetailPageProps) {
  const resolvedParams =
    paramsPromise && typeof paramsPromise === "object" && "then" in paramsPromise ? use(paramsPromise) : (paramsPromise as { slug: string })
  const slug = resolvedParams.slug

  const { openModal } = useContactModal()
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()

  // Function to create URL-friendly slug from package title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD") // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
  }

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const packageData = await packageService.getPackageBySlug(slug)
        setPackageData(packageData)
      } catch (error) {
        console.error("Error loading package:", error)
        // Fallback to localStorage
        const savedPackages = localStorage.getItem("packages")
        if (savedPackages) {
          const packages: Package[] = JSON.parse(savedPackages)
          const foundPackage = packages.find((p) => createSlug(p.title) === slug)
          setPackageData(foundPackage || null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPackage()
  }, [slug])

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "economico":
        return t("pkgEconomy")
      case "premium":
        return t("pkgPremium")
      case "luxo":
        return t("pkgLuxury")
      default:
        return t("pkgStandard")
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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return t("easy")
      case "moderado":
        return t("moderate")
      case "dificil":
        return t("hard")
      default:
        return t("notInformed")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return "text-green-600"
      case "moderado":
        return "text-yellow-600"
      case "dificil":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        </div>
      </SiteLayout>
    )
  }

  if (!packageData) {
    return (
      <SiteLayout>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("packageNotFound")}</h1>
            <Link href="/pacotes">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToPackages")}
              </Button>
            </Link>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative h-96 pt-16">
        <Image src={packageData.image || "/placeholder.svg"} alt={packageData.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getCategoryColor(packageData.category)}>{getCategoryLabel(packageData.category)}</Badge>
            <Badge className="bg-black/50 text-white border-0">
              <Clock className="w-3 h-3 mr-1" />
              {packageData.duration}
            </Badge>
            {packageData.originalPrice && (
              <Badge className="bg-red-500 text-white">
                {Math.round(((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
          <h1 className="text-white font-bold text-4xl mb-2">{getTranslatedPackageTitle(packageData, packageData.title, language)}</h1>
          <p className="text-green-200 text-xl font-medium">{getTranslatedPackageSubtitle(packageData, packageData.subtitle || "", language)}</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/pacotes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToPackages")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("overview")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-green max-w-none">
                  {formatDescription(getTranslatedPackageDescription(packageData, packageData.description, language))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">{t("duration")}</p>
                      <p className="text-gray-600">{packageData.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">{t("group")}</p>
                      <p className="text-gray-600">{t("upTo")} {packageData.maxPeople} {t("people")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">{t("difficulty")}</p>
                      <p className={getDifficultyColor(packageData.difficulty || "")}>
                        {getDifficultyLabel(packageData.difficulty || "")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>{t("packageHighlights")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packageData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>{t("whatsIncluded")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packageData.included.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Season */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("bestSeasonToVisit")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(packageData.bestSeason) ? packageData.bestSeason : (packageData.bestSeason ? [packageData.bestSeason] : [])).map((season: string, index: number) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {season}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>{t("detailedItinerary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {packageData.itinerary.map((day, index) => (
                    <div key={index} className="relative">
                      {index < packageData.itinerary.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-green-200"></div>
                      )}

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {day.day}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{day.title}</h4>

                          {day.activities.length > 0 && (
                            <div className="mb-3">
                              <h5 className="font-semibold text-gray-700 mb-2">{t("activities")}</h5>
                              <ul className="space-y-1">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="flex items-center gap-2 text-gray-600">
                                    <ChevronRight className="w-4 h-4 text-green-600" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {day.meals && day.meals.length > 0 && (
                            <ul className="space-y-1 mb-3">
                              {day.meals.map((meal, mealIndex) => (
                                <li key={mealIndex} className="flex items-center gap-2 text-gray-600">
                                  <ChevronRight className="w-4 h-4 text-green-600" />
                                  {meal}
                                </li>
                              ))}
                            </ul>
                          )}

                          {day.accommodation && (
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-1">{t("accommodationDetails")}</h5>
                              <p className="text-gray-600">{day.accommodation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{t("reservePackage")}</h3>

                <div className="mb-6">
                  {packageData.originalPrice && (
                    <div className="text-lg text-gray-500 line-through mb-1">
                      R$ {packageData.originalPrice.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    R$ {packageData.price.toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-gray-600">{t("perPerson")}</p>
                  {packageData.originalPrice && (
                    <p className="text-sm text-green-600 font-medium">
                      {t("savingsOf")} R$ {(packageData.originalPrice - packageData.price).toFixed(2).replace(".", ",")}
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    onClick={() => openModal(packageData.title)}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 transition-transform duration-300 hover:scale-105"
                  >
                    {t("bookNow")}
                  </Button>

                  <Button
                    onClick={() => openModal(packageData.title)}
                    variant="outline"
                    className="w-full transition-colors duration-300 hover:bg-green-50"
                  >
                    {t("talkToSpecialist")}
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">{t("needHelp")}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm">(67) 99139-5384</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-green-600" />
                      <span className="text-sm">contato@bonitoon.com</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-3">{t("importantInfo")}</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• {t("infoCancel")}</li>
                    <li>• {t("infoConfirm")}</li>
                    <li>• {t("infoGuides")}</li>
                    <li>• {t("infoInsurance")}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
