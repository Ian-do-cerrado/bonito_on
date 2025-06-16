"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, ChevronDown } from "lucide-react"
import { useContactModal } from "@/contexts/contact-modal-context"
import { useLanguage } from "@/contexts/language-context"

export function HeroSection() {
  const { openModal } = useContactModal()
  const { t } = useLanguage()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToNext = () => {
    const element = document.getElementById("packages")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/file.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Fallback Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-blue-900 transition-opacity duration-1000 ${isVideoLoaded ? "opacity-0" : "opacity-100"}`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-[2]" />

      {/* Content */}
      <div className="relative z-[3] text-center text-white max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Main Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up opacity-0">
              <span className="block">Descubra</span>
              <span className="block font-light text-green-300 animate-fade-in-up animation-delay-300 opacity-0">
                Bonito
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-up animation-delay-500 opacity-0 leading-relaxed px-4">
              Descubra as águas cristalinas, grutas místicas e a natureza exuberante do destino mais encantador do
              Brasil
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center animate-fade-in-up animation-delay-700 opacity-0 px-4">
            <Button
              onClick={() => openModal()}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 group z-[4] relative w-full max-w-xs sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
              Fale Conosco
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-6 sm:pt-8 animate-fade-in-up animation-delay-1000 opacity-0 px-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">50+</div>
              <div className="text-xs sm:text-sm text-gray-300">Atrações</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">5000+</div>
              <div className="text-xs sm:text-sm text-gray-300">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">4.9★</div>
              <div className="text-xs sm:text-sm text-gray-300">Avaliação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 sm:bottom-8 left transform -translate-x z-[4] text-white/70 hover:text-white transition-all duration-300 animate-bounce group"
      >
        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
          <span className="text-xs sm:text-sm font-medium">Explore</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
        </div>
      </button>

      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-white/10 rounded-full animate-pulse opacity-30 z-[2] hidden sm:block" />
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-white/10 rounded-full animate-pulse opacity-20 z-[2] hidden sm:block" />
    </section>
  )
}
