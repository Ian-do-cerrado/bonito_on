"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Tour } from "@/components/tours-section"

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  const price =
    typeof tour.price === "number"
      ? `R$ ${tour.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : ""

  // --- PREVIEW SEGURO: converte HTML em texto, preserva quebras onde faz sentido
  const preview = htmlToText(tour.description || "").trim()

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent hover:border-green-500">
      {/* Cabeçalho com imagem/overlay (fix z-index + isolate) */}
      <div className="relative h-48 overflow-hidden isolate">
        <div className="absolute inset-0 z-0 transition-transform duration-300 will-change-transform group-hover:scale-105">
          <Image
            src={tour.image || "/placeholder.svg"}
            alt={tour.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-2 left-2 z-20">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tour.category)}`}>
            {getCategoryLabel(tour.category)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{tour.title}</h3>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Preview somente texto — evita sobreposição no mobile */}
        <p className="text-gray-600 text-sm line-clamp-4 mb-4 whitespace-pre-line">
          {preview}
        </p>

        <div className="mb-3 mt-auto">
          {price && <div className="text-2xl font-bold text-green-600">{price}</div>}
          <div className="text-xs text-gray-500">por pessoa</div>
        </div>

        <div className="flex flex-col space-y-2 w-full">
          <Link
            href={`/passeios/${tour.slug || slugify(tour.title)}`}
            className="w-full"
          >
            <Button variant="outline" size="sm" className="text-sm w-full">
              Saber mais
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-sm w-full"
            onClick={() => (window as any)?.openModal?.() /* ou seu hook openModal() */}
          >
            Reservar
          </Button>
        </div>

        <a
          href={`https://wa.me/556796209978?text=${encodeURIComponent(
            `Olá! Vim do site Bonito ON e gostaria de mais informações sobre o passeio ${tour.title}.`,
          )}`}
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

/* Utils */

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Converte HTML em texto, preservando quebras ao fim de <p> e </li>
function htmlToText(html: string) {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
}

function getCategoryLabel(category: Tour["category"]) {
  const map: Record<string, string> = {
    adventure: "Aventura",
    contemplation: "Contemplação",
    cave: "Caverna",
    waterfall: "Cachoeira",
    rappelling: "Rapel",
    horseback: "Cavalgada",
    biking: "Biking",
    scubaDiving: "Mergulho",
    resort: "Balneário",
    floating: "Flutuação",
    pantanal: "Pantanal",
  }
  return map[category] || "Aventura"
}

function getCategoryColor(category: Tour["category"]) {
  switch (category) {
    case "pantanal":
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
