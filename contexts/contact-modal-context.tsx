"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface ContactModalContextType {
  isOpen: boolean
  openModal: (attraction?: string) => void
  closeModal: () => void
  attraction: string | null;
  setAttraction: (attraction: string | null) => void;
}

export const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined)

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [attraction, setAttraction] = useState<string | null>(null);
  const pathname = usePathname();

  // Páginas onde o modal automático de captação nunca deve aparecer
  // (a página de contato já tem o formulário; a landing /pacotes-promo é auto-contida)
  const modalSuppressedRoutes = ["/contato", "/pacotes-promo"];
  const isModalSuppressed = modalSuppressedRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  );

  useEffect(() => {
    if (isModalSuppressed) return;

    // Verifica se o modal automático já foi mostrado nesta sessão
    const autoModalShown = sessionStorage.getItem("autoModalShown")
    if (autoModalShown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem("autoModalShown", "true")
    }, 4000)

    return () => clearTimeout(timer)
  }, [isModalSuppressed])

  // Fecha o modal ao navegar para uma rota onde ele é suprimido
  useEffect(() => {
    if (isModalSuppressed) {
      setIsOpen(false)
      setAttraction(null)
    }
  }, [isModalSuppressed])

  const openModal = (attraction?: string) => {
    if (isModalSuppressed) return; // suppress on pages that opt out
    if (attraction) setAttraction(attraction)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    sessionStorage.removeItem("autoModalShown");
    setAttraction(null);
  }

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal, attraction, setAttraction }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext)
  if (context === undefined) {
    throw new Error("useContactModal must be used within a ContactModalProvider")
  }
  return context
}
