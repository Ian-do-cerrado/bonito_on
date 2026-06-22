"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useContactModal } from "@/contexts/contact-modal-context"
import Image from "next/image"
import Link from "next/link"
import { Tour } from "@/types/index"
import { cleanDescriptionPrices } from "@/lib/description-cleaner"
import { getDisplayPrice } from "@/lib/tour-price-utils"
import { getTranslatedDescription, getTranslatedTitle } from "@/lib/dynamic-translations"
import { isExternalImageUrl } from "@/lib/image-url"

interface TourCardProps {
  tour: Tour
  preferNextSemester?: boolean
}

export function TourCard({ tour, preferNextSemester }: TourCardProps) {
  const { t, language, initialValueType } = useLanguage()
  const { openModal } = useContactModal()

  const getCategoryLabel = (category: Tour["category"]) => {
    switch (category) {
      case "adventure":      return t("adventure")
      case "contemplation":  return t("contemplation")
      case "cave":           return t("cave")
      case "waterfall":      return t("waterfall")
      case "rappelling":     return t("rappelling")
      case "horseback":      return t("horseback")
      case "biking":         return t("biking")
      case "scubaDiving":    return t("scubaDiving")
      case "resort":         return t("resort")
      case "floating":       return t("floating")
      case "pantanal":       return t("pantanal")
      default:               return t("adventure")
    }
  }

  const getCategoryColor = (category: Tour["category"]) => {
    switch (category) {
      case "pantanal":       return "bg-orange-500/90 text-white"
      case "adventure":      return "bg-orange-500/90 text-white"
      case "contemplation":  return "bg-yellow-500/90 text-white"
      case "cave":           return "bg-purple-600/90 text-white"
      case "waterfall":      return "bg-blue-500/90 text-white"
      case "rappelling":     return "bg-pink-500/90 text-white"
      case "horseback":      return "bg-amber-500/90 text-white"
      case "biking":         return "bg-lime-600/90 text-white"
      case "scubaDiving":    return "bg-teal-500/90 text-white"
      case "resort":         return "bg-green-600/90 text-white"
      case "floating":       return "bg-cyan-500/90 text-white"
      default:               return "bg-orange-500/90 text-white"
    }
  }

  const queryParam = preferNextSemester ? "?semester=2" : ""

  return (
    <Card className="group overflow-hidden border border-gray-100 bg-white rounded-2xl shadow-sm h-full flex flex-col">
      {/* Image container */}
      <div className="relative h-52 flex-shrink-0 overflow-hidden bg-gray-100">
        <Image
          src={tour.image || "/placeholder.svg"}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          unoptimized={isExternalImageUrl(tour.image)}
        />
        {/* Dark gradient overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />
        {/* Category badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-md transition-transform duration-500 ease-out group-hover:scale-105 z-10 ${getCategoryColor(tour.category)}`}
        >
          {getCategoryLabel(tour.category)}
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
          {getTranslatedTitle(tour, tour.title, language)}
        </h3>

        <div
          className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanDescriptionPrices(getTranslatedDescription(tour, tour.description ?? "", language)) }}
        />

        {/* Preço real do passeio */}
        <div className="mb-4 mt-auto">
          {(() => {
            const displayPrice = getDisplayPrice(tour, initialValueType === "min_price" ? "min_price" : "main_activity", preferNextSemester)
            if (displayPrice > 0) return (
              <>
                <div className="text-xs text-gray-400 leading-none mb-0.5">A partir de</div>
                <div className="text-base font-bold text-green-600 leading-tight">
                  {displayPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <div className="text-xs text-gray-400">por pessoa (adulto)</div>
              </>
            )
            return (
              <>
                <div className="text-sm font-bold text-green-600 leading-tight">Consulte o valor</div>
                <div className="text-xs text-gray-400">Entre em contato para orçamentos</div>
              </>
            )
          })()}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/passeios/${tour.slug || encodeURIComponent(tour.title.toLowerCase().replace(/\s+/g, "-"))}${queryParam}` || "/"}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-gray-200 hover:border-green-500 hover:text-green-700 transition-all duration-300"
            >
              {t("knowMore")}
            </Button>
          </Link>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs shadow-md hover:shadow-green-200 hover:shadow-lg transition-all duration-300"
            onClick={() => openModal()}
          >
            {t("reserve")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
