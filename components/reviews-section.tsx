"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
// SUSPENDED: import { useContactModal } from "@/hooks/use-contact-modal"
// SUSPENDED: import { ContactModalContext } from "@/contexts/contact-modal-context";
// SUSPENDED: import { useContext } from "react";
import { useLanguage } from "@/contexts/language-context";
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"

interface Review {
id: string
name: string
rating: number
comment: string
  date: string
  avatar?: string
}

export function ReviewsSection() {
  // SUSPENDED: const { openModal } = useContext(ContactModalContext) as any;
  const { t } = useLanguage();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null)
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      name: "Erika Fernanda Nicolini Calazans",
      rating: 5,
      comment:
        "Agência sensacional Fomos indicados e com certeza indicaremos e a contrataremos novamente. Excelente receptivo, transportes, motoristas e controle de horários e confirmações. Muito Obrigada por dias incríveis!",
      date: "há 5 meses",
      avatar: "/erica.webp?height=60&width=60",
    },
    {
      id: "2",
      name: "Kelly Duarte",
      rating: 5,
      comment:
        "Fui até a agência presencialmente depois de 2 tentativas frustrantes em outras agências da cidade, o Ismael pacientemente me atendeu e explicou todos os passeios detalhadamente, com sugestões, panfletos e vídeos. Ele foi extremamente atencioso e simpático, recomendo!",
      date: "há 2 semanas",
      avatar: "/kellyduarte.webp?height=60&width=60",
    },
    {
      id: "3",
      name: "Sergio Gomes",
      rating: 5,
      comment:
        "Viagem inesquecível, com toda ajuda e suporte Pascoal da Agência que tem muita paciência para oferecer o melhor atendimento!!!! Minha família curtiu demais todas dicas !! Até breve e indicamos fortemente !!!! G🌎 …",
      date: "há 1 ano",
      avatar: "/SergioGomes.webp?height=60&width=60",
    },
    {
      id: "4",
      name: "Patrícia da Rocha",
      rating: 5,
      comment:
        "Excelente atendimento. Kathia é atenciosa, responde rápido, tira todas as dúvidas, explica. Compramos o roteiro antes de ir a Bonito com a agência e foi incrível! Tudo 100% organizado.",
      date: "há 5 meses",
      avatar: "/patriciadarocha.png",
    },
    {
      id: "5",
      name: "Day Diniz",
      rating: 5,
      comment:
        "Atendimento excepcional de todos, muito atenciosos e acolhedores, deram todo suporte antes de fechar os passeios e também na pós venda. Tornaram minha viagem bem tranquila e sem contratempo.  Agradeço muito ao trabalho feito com dedicação e o atendimento de excelência que foi essencial na escolha da agência ❤️",
      date: "há 2 anos",
      avatar: "/Daydiniz.png",
    },
    {
      id: "6",
      name: "Petter Almeida",
      rating: 5,
      comment:
        "Quero parabenizar a agente Thaynara pelo excelente atendimento prestado, e as escolhas dos passeios nos Balneários, todos personalizados conforme o roteiro escolhidos . estávamos um grupo de amigos e todos ficamos contentes. E pela escolhas de barzinhos e lanches, foi top iremos voltar novamente para a cidade .",
      date: "há 5 meses",
      avatar: "/petter.png",
    },
  ])

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / reviews.length
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" })
    }
  }

  const nextReview = () => {
    setCurrentReviewIndex((prev) => {
      const next = (prev + 1) % reviews.length
      scrollToIndex(next)
      return next
    })
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => {
      const next = (prev - 1 + reviews.length) % reviews.length
      scrollToIndex(next)
      return next
    })
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">{t("reviewsTitle")}</h2>
          <p className="text-base sm:text-lg text-green-100 max-w-2xl mx-auto mb-8 leading-relaxed">{t("reviewsSubtitle")}</p>

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
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory sm:snap-none pl-[calc(50%-41vw)] pr-[calc(50%-41vw)] sm:pl-0 sm:pr-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="flex-shrink-0 w-[82vw] sm:w-[calc(33.333%-16px)] snap-center">
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 h-full">
                  <CardContent className="p-6 sm:p-8">
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
                      <p className="text-gray-700 text-base leading-relaxed pl-6 italic">"{review.comment}"</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => { setCurrentReviewIndex(index); scrollToIndex(index) }}
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
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t("joinStories")}</h3>
            <p className="text-base text-green-100 mb-6 leading-relaxed">{t("joinStoriesDesc")}</p>
            {/*
            SUSPENDED:
            <Button onClick={() => { openModal(); }} className="bg-green-500 ...">
              <MessageCircle /> {t("heroButton")}
            </Button>
            */}
            <WhatsAppCtaButton
              message="Olá! Vim do site Bonito ON e gostaria de reservar uma experiência em Bonito."
              label="Reservar pelo WhatsApp"
              className="max-w-xs mx-auto px-8 py-3 text-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
