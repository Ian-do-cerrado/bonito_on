"use client";
import type React from "react"
import type { Metadata } from "next";
import { Sora } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import { ContactModalProvider } from "@/contexts/contact-modal-context"
import { SiteLayout } from "@/components/site-layout";
import { ContactModal } from "@/components/contact-modal";
import { useContactModal } from "@/hooks/use-contact-modal";
import { metadata } from "./metadata";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, closeModal } = useContactModal();
  return (
    <html lang="pt-BR" suppressHydrationWarning>

      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QBXNL437DG"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QBXNL437DG');
        </script>
        <link rel="icon" href="/bonitoon.svg" sizes="any" />
        <link rel="icon" href="/bonitoon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${sora.className} antialiased`} suppressHydrationWarning>
    <ScrollToTop />
    <LanguageProvider>
      <ContactModalProvider>
        {children}
        <Toaster />
        <ContactModal />
        </ContactModalProvider>
      </LanguageProvider>
  </body>
    </html>
  )
}
