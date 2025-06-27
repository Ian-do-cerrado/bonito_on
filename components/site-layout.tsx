"use client"

import type React from "react"
import { ContactModal } from "@/components/contact-modal"
import { useContactModal } from "@/contexts/contact-modal-context"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const { isOpen, closeModal } = useContactModal()

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    <ContactModal isOpen={isOpen} closeModal={closeModal} />
  </div>
);
}
