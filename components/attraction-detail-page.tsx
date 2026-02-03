"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useContactModal } from "@/hooks/use-contact-modal"
import {
  MapPin,
  Clock,
  Users,
  Star,
  Phone,
  Globe,
  DollarSign,
  Utensils,
  Bed,
  Car,
  Calendar,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react"
import Link from "next/link"
import type { Attraction } from "@/services/supabase-attractions"

interface AttractionDetailPageProps {
  attraction: Attraction
}

export function AttractionDetailPage({ attraction }: AttractionDetailPageProps) {
  const contactModal = useContactModal()
  const [isFavorited, setIsFavorited] = useState(false)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gastronomia":
        return <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
      case "hospedagem":
        return <Bed className="w-4 h-4 sm:w-5 sm:h-5" />
      case "transporte":
        return <Car className="w-4 h-4 sm:w-5 sm:h-5" />
      case "eventos":
        return <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
      default:
        return <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "gastronomia":
        return "Gastronomia"
      case "hospedagem":
        return "Hospedagem"
      case "transporte":
        return "Transporte"
      case "eventos":
        return "Eventos"
      default:
        return "Gastronomia"
    }
  }

  const handleReserveClick = () => {
    contactModal.openModal(attraction.title)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: attraction.title,
          text: attraction.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src={attraction.image || "/placeholder.svg"}
          alt={attraction.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
          <Link href="/#attractions">
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-sm">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-white/90 hover:bg-white p-2"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleShare} className="bg-white/90 hover:bg-white p-2">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Badge className="bg-white/90 text-gray-800 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                {getCategoryIcon(attraction.category)}
                {getCategoryLabel(attraction.category)}
              </Badge>
              <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 sm:px-3 py-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-semibold text-gray-800">{attraction.rating}</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight">
              {attraction.title}
            </h1>
            <div className="flex items-center gap-2 text-white/90 mb-4 sm:mb-6">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-sm sm:text-lg">{attraction.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Sobre</h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{attraction.description}</p>
            </div>

            {/* Highlights */}
            {attraction.highlights && attraction.highlights.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Destaques</h2>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {attraction.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Informações</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {attraction.duration && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Duração</div>
                      <div className="text-gray-600 text-sm">{attraction.duration}</div>
                    </div>
                  </div>
                )}

                {attraction.capacity && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Capacidade</div>
                      <div className="text-gray-600 text-sm">{attraction.capacity}</div>
                    </div>
                  </div>
                )}

                {attraction.price && (
                  <div className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Preço</div>
                      <div className="text-gray-600 text-sm">{attraction.price}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Avaliação</div>
                    <div className="text-gray-600 text-sm">{attraction.rating}/5.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Booking Card */}
            <Card className="lg:sticky lg:top-6">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Interessado?</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Entre em contato para mais informações e reservas
                  </p>
                </div>

                <Separator className="my-4 sm:my-6" />

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Categoria:</span>
                    <span className="font-semibold text-sm">{getCategoryLabel(attraction.category)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Avaliação:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{attraction.rating}</span>
                    </div>
                  </div>
                  {attraction.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Preço:</span>
                      <span className="font-semibold text-green-600 text-sm">{attraction.price}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleReserveClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base sm:text-lg font-semibold"
                  size="lg"
                >
                  Consultar Preços
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">Resposta rápida garantida</p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Precisa de ajuda?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">(67) 99139-5384</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base break-all">contato@bonitoon.com.br</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
