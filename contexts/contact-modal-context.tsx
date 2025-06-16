"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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

  useEffect(() => {
    // Verifica se o modal automático já foi mostrado nesta sessão
    const autoModalShown = sessionStorage.getItem("autoModalShown")
    if (autoModalShown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem("autoModalShown", "true")
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const openModal = () => {
    console.log("openModal called");
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    // ❗ Removemos a flag do sessionStorage para permitir novo trigger se quiser reabrir
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
