"use client"

import type React from "react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
