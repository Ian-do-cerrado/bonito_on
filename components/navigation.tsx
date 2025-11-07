"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNav, setShowNav] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)

      if (
        currentScrollY < 10 || // muito no topo
        currentScrollY < lastScrollY // rolando pra cima
      ) {
        setShowNav(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false)
      }

      lastScrollY = currentScrollY
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 50) {
        setShowNav(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  if (pathname === "/test-integrations" || pathname !== "/") {
    return null
  }

  const scrollToSection = (sectionId: string, category?: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)

      if (category) {
        setTimeout(() => {
          const event = new CustomEvent(
            sectionId === "attractions" ? "changeAttractionCategory" : "changeTourCategory",
            { detail: category }
          )
          window.dispatchEvent(event)
        }, 500)
      }
    }
  }

  const handleLanguageChange = (newLanguage: "pt" | "en" | "es") => {
    setLanguage(newLanguage)
    toast({
      description: t("languageChanged"),
      duration: 2000,
    })
  }

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-300 transform ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-black/20 backdrop-blur-sm"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className={`block transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                <Image
                  src="/images/logo-bonitoon.svg"
                  alt="BonitoON"
                  width={160}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
                {[
                  { href: "/pacotes", label: "pacotes" },
                  { href: "/tarifario", label: "passeios" }
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 ${
                      isScrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                    }`}
                  >
                    {t(label).toUpperCase()}
                  </Link>
                ))}
                <button
                  onClick={() => scrollToSection("attractions", "gastronomy")}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 ${
                    isScrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
                >
                  {t("gastronomy").toUpperCase()}
                </button>
                <button
                  onClick={() => scrollToSection("attractions", "accommodation")}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 ${
                    isScrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
                >
                  {t("accommodations").toUpperCase()}
                </button>
                <button
                  onClick={() => scrollToSection("blog")}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 ${
                    isScrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-400"
                  }`}
                >
                  {t("blog").toUpperCase()}
                </button>
              </div>
            </div>

            {/* Language Switcher & Mobile Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex space-x-1 sm:space-x-2">
                {[
                  { code: "en", flag: "🇺🇸" },
                  { code: "pt", flag: "🇧🇷" },
                  { code: "es", flag: "🇪🇸" }
                ].map(({ code, flag }) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code as "pt" | "en" | "es")}
                    className={`text-sm transition-all duration-300 p-1.5 sm:p-2 rounded-lg hover:scale-110 ${
                      language === code ? "bg-green-500/20 scale-110" : ""
                    } ${isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
                    title={code}
                  >
                    {flag}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={`lg:hidden transition-colors duration-300 p-2 ${
                  isScrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[99] lg:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[101] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-lg text-gray-900">
              Bonito<span className="text-green-500">ON</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)} className="p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-4">
              {[
                { label: "pacotes", href: "/pacotes" },
                { label: "passeios", href: "/tarifario" }
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(label).toUpperCase()}
                </Link>
              ))}
              <button
                onClick={() => scrollToSection("attractions", "gastronomy")}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t("gastronomy").toUpperCase()}
              </button>
              <button
                onClick={() => scrollToSection("attractions", "accommodation")}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t("accommodations").toUpperCase()}
              </button>
              <button
                onClick={() => scrollToSection("blog")}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t("blog").toUpperCase()}
              </button>
            </div>

            <div className="px-4 mt-6">
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Idioma</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["en", "pt", "es"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang as "pt" | "en" | "es")}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                        language === lang
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl mb-1">
                        {lang === "en" ? "🇺🇸" : lang === "pt" ? "🇧🇷" : "🇪🇸"}
                      </span>
                      <span className="text-xs font-medium">
                        {lang === "en" ? "English" : lang === "pt" ? "Português" : "Español"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t p-4">
            <div className="text-center text-sm text-gray-500">© 2024 BonitoON Turismo</div>
          </div>
        </div>
      </div>
    </>
  )
}
