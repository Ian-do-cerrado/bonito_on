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
  const [isOpen, setIsOpen] = useState(false)
  const [attraction, setAttraction] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Do not open modal automatically on the contact page
    if (pathname === "/contato") return

    // Check if the auto-modal has already been shown in this session
    const autoModalShown = sessionStorage.getItem("autoModalShown")
    if (autoModalShown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem("autoModalShown", "true")
    }, 4000)

    return () => clearTimeout(timer)
  }, [pathname])

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
