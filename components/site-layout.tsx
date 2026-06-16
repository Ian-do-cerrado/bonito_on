"use client"

import type React from "react"
// SUSPENDED: import { ContactModal } from "@/components/contact-modal"
// SUSPENDED: import { useContactModal } from "@/contexts/contact-modal-context"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  // SUSPENDED: const { isOpen, closeModal } = useContactModal()

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
      {/* SUSPENDED: <ContactModal isOpen={isOpen} closeModal={closeModal} /> */}
    </div>
  )
}
