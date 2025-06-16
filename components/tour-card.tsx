"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useContactModal } from "@/contexts/contact-modal-context"
import Image from "next/image"
import Link from "next/link"
import { Tour } from "@/components/tours-section"

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  const { t } = useLanguage()
  const { openModal } = useContactModal()

  const getCategoryLabel = (category: Tour["category"]) => {
    switch (category) {
      case "adventure":
        return t("adventure")
      case "contemplation":
        return t("contemplation")
      case "cave":
        return t("cave")
      case "waterfall":
        return t("waterfall")
      case "rappelling":
        return t("rappelling")
      case "horseback":
        return t("horseback")
      case "biking":
        return t("biking")
      case "scubaDiving":
        return t("scubaDiving")
      case "resort":
        return t("resort")
      case "floating":
        return t("floating")
      case "pantanal":
        return t("pantanal")
      default:
        return t("adventure")
    }
  }

  const getCategoryColor = (category: Tour["category"]) => {
    switch (category) {
      case "pantanal":
        return "bg-orange-100 text-orange-800"
      case "adventure":
        return "bg-orange-100 text-orange-800"
      case "contemplation":
        return "bg-yellow-200 text-yellow-800"
      case "cave":
        return "bg-purple-200 text-purple-800"
      case "waterfall":
        return "bg-blue-200 text-blue-800"
      case "rappelling":
        return "bg-pink-200 text-pink-800"
      case "horseback":
        return "bg-amber-200 text-amber-800"
      case "biking":
        return "bg-lime-200 text-lime-800"
      case "scubaDiving":
        return "bg-teal-200 text-teal-800"
      case "resort":
        return "bg-green-200 text-green-800"
      case "floating":
        return "bg-cyan-200 text-cyan-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  const handleReserveClick = () => {
    openModal()
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48">
        <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
            tour.category,
          )}`}
        >
          {getCategoryLabel(tour.category)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg line-clamp-2 mb-2">{tour.title}</h3>

        <div
          className="text-gray-600 text-sm line-clamp-2 mb-4"
          dangerouslySetInnerHTML={{ __html: tour.description }}
        />

        <div className="mb-3">
          <div className="text-2xl font-bold text-green-600">R$ {tour.price.toFixed(2).replace(".", ",")}</div>
          <div className="text-xs text-gray-500">{t("perPerson")}</div>
        </div>

        <div className="flex space-x-2">
          <Link href={`/passeios/${tour.slug || encodeURIComponent(tour.title.toLowerCase().replace(/\s+/g, "-"))}` || "/"}>
            <Button variant="outline" size="sm" className="text-xs flex-1">
              {t("knowMore")}
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs flex-1"
            onClick={handleReserveClick}
          >
            {t("reserve")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
