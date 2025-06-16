"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Resetar rolagem para o topo sempre que a rota mudar
    // Usar setTimeout para garantir que aconteça após o render
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }

    // Executar imediatamente
    scrollToTop()

    // E também após um pequeno delay para garantir
    const timeoutId = setTimeout(scrollToTop, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  useEffect(() => {
    // Garantir que a página inicie no topo em carregamentos iniciais
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  return null
}
