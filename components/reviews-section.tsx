"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useContactModal } from "@/hooks/use-contact-modal"
import { useLanguage } from "@/contexts/language-context";
import { ContactModalContext } from "@/contexts/contact-modal-context";
import { useContext } from "react";

interface Review {
id: string
name: string
rating: number
comment: string
  date: string
  avatar?: string
}

export function ReviewsSection() {
  const { openModal } = useContext(ContactModalContext) as any;
  const { t } = useLanguage();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      name: "Maria Santos",
      rating: 5,
      comment:
        "Excelente atendimento! A equipe da BonitoON organizou nossa viagem de forma perfeita. Os passeios foram incríveis e superaram nossas expectativas. Recomendo muito!",
      date: "há 2 semanas",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "João Silva",
      rating: 5,
      comment:
        "Melhor agência de turismo de Bonito! Profissionais muito atenciosos e conhecedores da região. Fizemos vários passeios e todos foram organizados perfeitamente.",
      date: "há 1 mês",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      name: "Ana Costa",
      rating: 5,
      comment:
        "Experiência incrível! A BonitoON cuidou de todos os detalhes da nossa viagem. Os guias eram muito experientes e os passeios, simplesmente espetaculares!",
      date: "há 3 semanas",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "4",
      name: "Carlos Oliveira",
      rating: 5,
      comment:
        "Atendimento excepcional desde o primeiro contato. Conseguiram organizar nossa lua de mel em Bonito de forma perfeita. Cada passeio foi uma descoberta única!",
      date: "há 1 semana",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "5",
      name: "Fernanda Lima",
      rating: 5,
      comment:
        "Equipe muito profissional e prestativa. Nos ajudaram a escolher os melhores passeios para nossa família. As crianças adoraram e nós também! Voltaremos com certeza.",
      date: "há 2 meses",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "6",
      name: "Roberto Mendes",
      rating: 5,
      comment:
        "Serviço de primeira qualidade! A BonitoON superou todas as expectativas. Organização impecável, pontualidade e passeios inesquecíveis. Nota 10!",
      date: "há 3 semanas",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ])

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Auto-advance reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextReview, 5000)
    return () => clearInterval(interval)
  }, [])

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29]">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 to-transparent opacity-60"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200&query=abstract+pattern')] opacity-5 mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 md:max-w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">{t("reviewsTitle")}</h2>
          <p className="text-green-100 max-w-2xl mx-auto mb-8">{t("reviewsSubtitle")}</p>

          {/* Google Reviews Summary */}
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-semibold text-white">{t("googleReviews")}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-green-300"}`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-white">{averageRating.toFixed(1)}</span>
              <span className="text-green-200">
                ({totalReviews} {t("reviews")})
              </span>
            </div>

            <Button
              variant="secondary"
              className="bg-white text-[#1e2c1e] border-white hover:bg-green-100 hover:text-[#1e2c1e] font-medium text-base transition-colors"
              onClick={() =>
                window.open(
                  "https://www.google.com/maps/place/Ag%C3%AAncia+Bonito+ON/@-21.1283761,-56.4874656,17z/data=!4m8!3m7!1s0x947c5f60f0a903cf:0x5bfb0e5ba26c823c!8m2!3d-21.1283761!4d-56.4848907!9m1!1b1!16s%2Fg%2F11s8hry_ys",
                  "_blank",
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t("seeOnGoogle")}
            </Button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto sm:max-w-full">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="relative w-16 h-16 mr-4">
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            fill
                            className="object-cover rounded-full border-2 border-green-200"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900">{review.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-green-200" />
                        <p className="text-gray-700 text-lg leading-relaxed pl-6 italic">"{review.comment}"</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-colors sm:p-4"
          >
            <ChevronLeft className="w-6 h-6 text-green-800 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-colors sm:p-4"
          >
            <ChevronRight className="w-6 h-6 text-green-800 sm:w-7 sm:h-7" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReviewIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentReviewIndex ? "bg-green-400" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">{t("joinStories")}</h3>
            <p className="text-green-100 mb-6">{t("joinStoriesDesc")}</p>
            <Button
              onClick={() => {
                console.log("Button clicked");
                openModal();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg shadow-lg btn-mobile-full"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t("heroButton")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
