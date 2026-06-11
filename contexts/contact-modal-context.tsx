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

  // Never open the modal when already on the contact page
  const isContactPage = pathname === "/contato";

  useEffect(() => {
    if (isContactPage) return;

    // Verifica se o modal automático já foi mostrado nesta sessão
    const autoModalShown = sessionStorage.getItem("autoModalShown")
    if (autoModalShown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem("autoModalShown", "true")
    }, 4000)

    return () => clearTimeout(timer)
  }, [isContactPage])

  // Close the modal whenever the user navigates to /contato
  useEffect(() => {
    if (isContactPage) {
      setIsOpen(false)
      setAttraction(null)
    }
  }, [isContactPage])

  const openModal = (attraction?: string) => {
    if (isContactPage) return; // suppress on contact page
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
