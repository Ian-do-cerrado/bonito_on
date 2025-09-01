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
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
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
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-base line-clamp-2 mb-2">{tour.title}</h3>

        <div
          className="text-gray-600 text-xs line-clamp-3 mb-4"
          dangerouslySetInnerHTML={{ __html: tour.description }}
        />

        <div className="mb-3 mt-auto"> {/* mt-auto to push to bottom */}
          <div className="text-2xl font-bold text-green-600">R$ {tour.price.toFixed(2).replace(".", ",")}</div>
          <div className="text-xs text-gray-500">{t("perPerson")}</div>
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <Link href={`/passeios/${tour.slug || encodeURIComponent(tour.title.toLowerCase().replace(/\s+/g, "-"))}` || "/"} className="w-full">
            <Button variant="outline" size="sm" className="text-sm w-full">
              {t("knowMore")}
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-sm w-full"
            onClick={handleReserveClick}
          >
            {t("reserve")}
          </Button>
        </div>
        <a
          href={`https://wa.me/5567991395384?text=${encodeURIComponent(`Olá! Vim do site Bonito ON e gostaria de mais informações sobre o passeio ${tour.title}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Fale Com um Especialista
        </a>
      </CardContent>
    </Card>
  )
}
