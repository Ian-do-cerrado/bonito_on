"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import { ContactModalProvider } from "@/contexts/contact-modal-context"
import { ContactModal } from "@/components/contact-modal"
import { ScrollToTop } from "@/components/scroll-to-top"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      <ContactModalProvider>
        <ScrollToTop />
        {children}
        <Toaster />
        <ContactModal />
      </ContactModalProvider>
    </LanguageProvider>
  )
}
