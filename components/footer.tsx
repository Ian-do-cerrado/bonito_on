"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Star, AlertTriangle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
// SUSPENDED: import { useContactModal } from "@/hooks/use-contact-modal"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  // SUSPENDED: const { openModal } = useContactModal()
  const { t } = useLanguage()

  const scrollToSection = (sectionId: string, category?: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })

      // If category is provided, trigger category change after scroll
      if (category) {
        setTimeout(() => {
          const event = new CustomEvent("changeTourCategory", { detail: category })
          window.dispatchEvent(event)
        }, 500)
      }
    }
  }

  return (
    <footer className="bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Company Info */}
          <div className="space-y-6 text-center">
            <div>
              <div className="flex justify-center">
                <Link href="/">
                  <Image
                    src="/images/logo-bonitoon.svg"
                    alt="BonitoON"
                    width={160}
                    height={40}
                    className="brightness-0 invert"
                  />
                </Link>
              </div>
              <p className="text-green-100 mt-2 text-sm">Sua aventura em Bonito começa aqui</p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Especialistas em ecoturismo oferecendo os melhores passeios da região de Bonito, MS. Experiências
              inesquecíveis com segurança e qualidade garantidas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-xl font-bold text-green-400">5000+</div>
                <div className="text-xs text-gray-300">Clientes satisfeitos</div>
              </div>
            </div>

          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("quickLinks")}</h3>

            <div className="space-y-3">
              <Link href="/pacotes" className="block text-gray-300 hover:text-green-400 transition-colors text-sm">
                {t("completePackages")}
              </Link>
              <button
                onClick={() => scrollToSection("tours", "passeios")}
                className="block text-gray-300 hover:text-green-400 transition-colors text-sm text-left"
              >
                {t("passeios")} {t("toursInBonito")}
              </button>
              <button
                onClick={() => scrollToSection("tours", "food")}
                className="block text-gray-300 hover:text-green-400 transition-colors text-sm text-left"
              >
                {t("localGastronomy")}
              </button>
              <button
                onClick={() => scrollToSection("tours", "locations")}
                className="block text-gray-300 hover:text-green-400 transition-colors text-sm text-left"
              >
                {t("locations")}
              </button>
              <button
                onClick={() => scrollToSection("blog")}
                className="block text-gray-300 hover:text-green-400 transition-colors text-sm text-left"
              >
                {t("blogAndTips")}
              </button>
            </div>

          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("contact")}</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{t("address")}</p>
                  <p className="text-xs text-gray-300">
                    Rua Coronel Pilad Rebuá, 1997
                    <br />
                    Centro, Bonito - MS
                    <br />
                    CEP: 79290-000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{t("phones")}</p>
                  <p className="text-xs text-gray-300">
                    (67) 99139-5384
                    <br />
                    (67) 99139-5384 (WhatsApp)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{t("email")}</p>
                  <p className="text-xs text-gray-300">contato@bonitoon.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{t("schedule")}</p>
                  <p className="text-xs text-gray-300">
                    Segunda a Sexta: 8h às 18h
                    <br />
                    Sábado: 8h às 16h
                    <br />
                    Domingo: 8h às 12h
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-200 font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t("emergency24h")}</p>
              <p className="text-xs text-red-100">(67) 99139-5384</p>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t("socialMedia")}</h4>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 p-2"
                  onClick={() => window.open("https://www.facebook.com/people/Ag%C3%AAncia-Bonito-On/61576109826482/", "_blank")}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 p-2"
                  onClick={() => window.open("https://www.instagram.com/agenciabonitoon/", "_blank")}
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 p-2"
                  onClick={() => window.open("https://youtube.com/bonitoon", "_blank")}
                >
                  <Youtube className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 p-2"
                  onClick={() => window.open("https://wa.me/5567991395384", "_blank")}
                >
                  <FaWhatsapp className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Reviews Summary */}
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">4.9/5</span>
              </div>
              <p className="text-xs text-gray-300">{t("basedOnGoogleReviews")}</p>
              <Button
                variant="link"
                className="text-green-400 hover:text-green-300 p-0 h-auto text-xs mt-1"
                onClick={() => window.open("https://g.page/r/CRyig6K6bIhfEBM/review", "_blank")}
              >
                {t("seeAllReviews")} →
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">{t("copyright").replace("{year}", new Date().getFullYear().toString())}</p>
              <p className="text-xs text-gray-400 mt-1">CNPJ: 47.950.064/0001-17 | Cadastur: 47.950.064/0001-17</p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link href="/politica-privacidade" className="text-gray-400 hover:text-green-400 transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="/termos-uso" className="text-gray-400 hover:text-green-400 transition-colors">
                {t("termsOfUse")}
              </Link>
              <Link href="/politica-cancelamento" className="text-gray-400 hover:text-green-400 transition-colors">
                {t("cancellationPolicy")}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <div className="w-32 h-32 border border-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-10">
        <div className="w-24 h-24 border border-white/20 rounded-full"></div>
      </div>
    </footer>
  )
}
