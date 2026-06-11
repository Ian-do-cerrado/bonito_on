import type React from "react"
import { Sora } from "next/font/google"
import { Providers } from "@/components/providers"
import { metadata } from "./metadata"
import "./globals.css"

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  preload: true,
  fallback: ["system-ui", "arial"],
})

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/bonitoon-favicon.svg" sizes="any" />
        <link rel="icon" href="/bonitoon-favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${sora.className} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
