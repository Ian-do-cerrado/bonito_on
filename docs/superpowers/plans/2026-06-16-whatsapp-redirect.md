# WhatsApp Redirect — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all reservation forms and modal-triggering buttons with WhatsApp CTA buttons using the official FaWhatsapp icon, green `#25D366` color, and personalized messages per context.

**Architecture:** Create a shared `WhatsAppCtaButton` component, suspend `ContactModal` in both `app/layout.tsx` and `components/site-layout.tsx`, then replace all `openModal()` buttons and orange "Fale Com um Especialista" links across 8 files.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind CSS, `react-icons/fa` (FaWhatsapp — already installed), TypeScript.

---

## Files Map

| Action | File | Change |
|---|---|---|
| Create | `components/whatsapp-cta-button.tsx` | New shared WhatsApp CTA component |
| Modify | `app/layout.tsx` | Suspend `<ContactModal />` |
| Modify | `components/site-layout.tsx` | Suspend `<ContactModal />` + `useContactModal` |
| Modify | `components/hero-section.tsx` | Suspend modal button, add WhatsApp CTA |
| Modify | `components/tour-card.tsx` | Suspend "Reservar", replace orange link |
| Modify | `components/package-card.tsx` | Suspend "Reservar" + `useContactModal`, replace orange link |
| Modify | `components/attraction-detail-page.tsx` | Suspend "Consultar Preços" + handler, add WhatsApp CTA |
| Modify | `app/passeios/[slug]/index.tsx` | Suspend both modal buttons, add WhatsApp CTA |
| Modify | `app/pacotes/[slug]/index.tsx` | Suspend "Reservar Agora" + `useContactModal`, update orange link |
| Modify | `components/TourDetailPage.tsx` | Suspend both inert buttons, add WhatsApp CTA |
| Modify | `components/footer.tsx` | Swap `MessageCircle` for `FaWhatsapp` |

---

## Task 1: Create `WhatsAppCtaButton` component

**Files:**
- Create: `components/whatsapp-cta-button.tsx`

- [ ] **Step 1: Create the component**

Create `components/whatsapp-cta-button.tsx` with this exact content:

```tsx
"use client"

import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_NUMBER = "5567991395384"

interface WhatsAppCtaButtonProps {
  message: string
  label?: string
  className?: string
}

export function WhatsAppCtaButton({
  message,
  label = "Reservar pelo WhatsApp",
  className = "",
}: WhatsAppCtaButtonProps) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm w-full ${className}`}
    >
      <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
      {label}
    </a>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/davirlima/bonito_on && pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors referencing `whatsapp-cta-button.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/whatsapp-cta-button.tsx
git commit -m "feat: add WhatsAppCtaButton shared component"
```

---

## Task 2: Suspend `ContactModal` in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Apply changes**

In `app/layout.tsx`, replace the block from line 7 (`import { ContactModal }`) and line 63 (`<ContactModal />`) with suspended versions:

```tsx
// SUSPENDED: import { ContactModal } from "@/components/contact-modal";
```

And in the JSX body, replace `<ContactModal />` with:

```tsx
{/* SUSPENDED: <ContactModal /> */}
```

The file should look like this after the change:

```tsx
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/language-context";
import { ContactModalProvider } from "@/contexts/contact-modal-context";
// SUSPENDED: import { ContactModal } from "@/components/contact-modal";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import WhatsAppButton from "@/components/whatsapp-button";

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Bonito ON",
  description: "Site da Bonito ON",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/bonitoon.svg" sizes="any" />
        <link rel="icon" href="/bonitoon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${sora.className} antialiased`} suppressHydrationWarning>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T5GX4T7X');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T5GX4T7X"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ScrollToTop />
        <LanguageProvider>
          <ContactModalProvider>
            {children}
            <Toaster />
            {/* SUSPENDED: <ContactModal /> */}
            <WhatsAppButton />
          </ContactModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: suspend ContactModal from root layout"
```

---

## Task 3: Suspend `ContactModal` in `components/site-layout.tsx`

**Files:**
- Modify: `components/site-layout.tsx`

- [ ] **Step 1: Apply changes**

Replace the entire file content:

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/site-layout.tsx
git commit -m "feat: suspend ContactModal from SiteLayout"
```

---

## Task 4: Update `components/hero-section.tsx`

**Files:**
- Modify: `components/hero-section.tsx`

- [ ] **Step 1: Apply changes**

Replace the full file content:

```tsx
"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
// SUSPENDED: import { Button } from "@/components/ui/button"
// SUSPENDED: import { MessageCircle } from "lucide-react"
// SUSPENDED: import { useContactModal } from "@/contexts/contact-modal-context"
// SUSPENDED: import { useLanguage } from "@/contexts/language-context"
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"

export function HeroSection() {
  // SUSPENDED: const { openModal } = useContactModal()
  // SUSPENDED: const { t } = useLanguage()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToNext = () => {
    const element = document.getElementById("packages")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/file.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Fallback Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-blue-900 transition-opacity duration-1000 ${isVideoLoaded ? "opacity-0" : "opacity-100"}`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-[2]" />

      {/* Content */}
      <div className="relative z-[3] text-center text-white max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Main Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up opacity-0">
              <span className="block">Descubra</span>
              <span className="block font-light text-green-300 animate-fade-in-up animation-delay-300 opacity-0">
                Bonito
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-up animation-delay-500 opacity-0 leading-relaxed px-4">
              Descubra as águas cristalinas, grutas místicas e a natureza exuberante do destino mais encantador do
              Brasil
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center animate-fade-in-up animation-delay-700 opacity-0 px-4">
            {/*
            SUSPENDED:
            <Button
              onClick={() => openModal()}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 group z-[4] relative w-full max-w-xs sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
              Fale Conosco
            </Button>
            */}
            <WhatsAppCtaButton
              message="Olá! Vim do site Bonito ON e gostaria de mais informações sobre os passeios."
              label="Fale Conosco pelo WhatsApp"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-2xl hover:scale-105 z-[4] relative w-full max-w-xs sm:w-auto"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-6 sm:pt-8 animate-fade-in-up animation-delay-1000 opacity-0 px-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">50+</div>
              <div className="text-xs sm:text-sm text-gray-300">Atrações</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">5000+</div>
              <div className="text-xs sm:text-sm text-gray-300">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">4.9★</div>
              <div className="text-xs sm:text-sm text-gray-300">Avaliação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 sm:bottom-8 left transform -translate-x z-[4] text-white/70 hover:text-white transition-all duration-300 animate-bounce group"
      >
        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
          <span className="text-xs sm:text-sm font-medium">Explore</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
        </div>
      </button>

      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-white/10 rounded-full animate-pulse opacity-30 z-[2] hidden sm:block" />
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-white/10 rounded-full animate-pulse opacity-20 z-[2] hidden sm:block" />
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/hero-section.tsx
git commit -m "feat: replace hero modal button with WhatsApp CTA"
```

---

## Task 5: Update `components/tour-card.tsx`

**Files:**
- Modify: `components/tour-card.tsx`

- [ ] **Step 1: Apply changes to the buttons section**

In `components/tour-card.tsx`, add the import at the top (after existing imports):

```tsx
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
```

Then replace the buttons block (lines 66–93 in the original) with:

```tsx
        <div className="flex flex-col space-y-2 w-full">
          <Link
            href={`${basePath}/${tour.slug || slugify(tour.title)}`}
            className="w-full"
          >
            <Button variant="outline" size="sm" className="text-sm w-full">
              Saber mais
            </Button>
          </Link>
          {/*
          SUSPENDED:
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-sm w-full"
            onClick={() => (window as any)?.openModal?.()}
          >
            Reservar
          </Button>
          */}
        </div>

        {/*
        SUSPENDED:
        <a
          href={`https://wa.me/5567991395384?text=${encodeURIComponent(
            `Olá! Vim do site Bonito ON e gostaria de mais informações sobre o passeio ${tour.title}.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Fale Com um Especialista
        </a>
        */}
        <WhatsAppCtaButton
          message={`Olá! Vim do site Bonito ON e gostaria de reservar o passeio ${tour.title}.`}
          label="Reservar pelo WhatsApp"
          className="mt-2 text-sm"
        />
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/tour-card.tsx
git commit -m "feat: replace tour card modal button with WhatsApp CTA"
```

---

## Task 6: Update `components/package-card.tsx`

**Files:**
- Modify: `components/package-card.tsx`

- [ ] **Step 1: Apply changes**

Replace the entire file content:

```tsx
"use client"

import type React from "react"
// SUSPENDED: import { Button } from "@/components/ui/button"
// SUSPENDED: import { useContactModal } from "@/contexts/contact-modal-context"
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"

interface PackageCardProps {
  title: string
  description: string
  price: string
  features: string[]
}

const PackageCard: React.FC<PackageCardProps> = ({ title, description, price, features }) => {
  // SUSPENDED: const { openModal } = useContactModal()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center mb-4">
        <span className="text-2xl font-bold text-green-600">{price}</span>
        <span className="text-gray-500">/mes</span>
      </div>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      {/*
      SUSPENDED:
      <Button
        onClick={() => openModal(title)}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        Reservar
      </Button>
      */}
      {/*
      SUSPENDED:
      <a
        href={`https://wa.me/5567991395384?text=${encodeURIComponent(`Olá! Vim do site Bonito ON e gostaria de mais informações sobre o pacote ${title}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-4 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Fale Com um Especialista
      </a>
      */}
      <WhatsAppCtaButton
        message={`Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${title}.`}
        label="Reservar pelo WhatsApp"
      />
    </div>
  )
}

export default PackageCard
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/package-card.tsx
git commit -m "feat: replace package card modal button with WhatsApp CTA"
```

---

## Task 7: Update `components/attraction-detail-page.tsx`

**Files:**
- Modify: `components/attraction-detail-page.tsx`

- [ ] **Step 1: Apply changes**

Add import for `WhatsAppCtaButton` at the top of the file (after existing imports):

```tsx
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
```

Comment out the `useContactModal` import:

```tsx
// SUSPENDED: import { useContactModal } from "@/hooks/use-contact-modal"
```

Inside the component, comment out the hook call and `handleReserveClick`:

```tsx
  // SUSPENDED: const contactModal = useContactModal()
  const [isFavorited, setIsFavorited] = useState(false)

  // SUSPENDED:
  // const handleReserveClick = () => {
  //   contactModal.openModal(attraction.title)
  // }
```

In the sidebar's booking card, replace the `<Button onClick={handleReserveClick}>` block with `WhatsAppCtaButton`:

```tsx
                {/*
                SUSPENDED:
                <Button
                  onClick={handleReserveClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base sm:text-lg font-semibold"
                  size="lg"
                >
                  Consultar Preços
                </Button>
                */}
                <WhatsAppCtaButton
                  message={`Olá! Vim do site Bonito ON e gostaria de mais informações sobre ${attraction.title}.`}
                  label="Reservar pelo WhatsApp"
                  className="py-3 text-base sm:text-lg"
                />
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/attraction-detail-page.tsx
git commit -m "feat: replace attraction detail modal button with WhatsApp CTA"
```

---

## Task 8: Update `app/passeios/[slug]/index.tsx`

**Files:**
- Modify: `app/passeios/[slug]/index.tsx`

- [ ] **Step 1: Apply changes**

Add import for `WhatsAppCtaButton` at the top (after existing imports):

```tsx
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
```

Comment out the `useContactModal` import:

```tsx
// SUSPENDED: import { useContactModal } from "@/hooks/use-contact-modal"
```

Comment out the hook call at the top of the component:

```tsx
  // SUSPENDED: const { openModal } = useContactModal()
```

In the sidebar card, replace the two modal buttons with a single `WhatsAppCtaButton`. The original block (around line 588–595) is:

```tsx
                <div className="space-y-3 mb-6">
                  <Button onClick={openModal} className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                    Reservar Agora
                  </Button>

                  <Button onClick={openModal} variant="outline" className="w-full bg-transparent">
                    Falar com especialista
                  </Button>
                </div>
```

Replace with:

```tsx
                <div className="space-y-3 mb-6">
                  {/*
                  SUSPENDED:
                  <Button onClick={openModal} className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                    Reservar Agora
                  </Button>
                  <Button onClick={openModal} variant="outline" className="w-full bg-transparent">
                    Falar com especialista
                  </Button>
                  */}
                  <WhatsAppCtaButton
                    message={`Olá! Vim do site Bonito ON e gostaria de reservar o passeio ${tour.title}.`}
                    label="Reservar pelo WhatsApp"
                    className="text-lg py-3"
                  />
                </div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/passeios/\[slug\]/index.tsx
git commit -m "feat: replace passeio detail modal buttons with WhatsApp CTA"
```

---

## Task 9: Update `app/pacotes/[slug]/index.tsx`

**Files:**
- Modify: `app/pacotes/[slug]/index.tsx`

- [ ] **Step 1: Apply changes**

Add import for `WhatsAppCtaButton` (after existing imports):

```tsx
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
```

Comment out the `useContactModal` import:

```tsx
// SUSPENDED: import { useContactModal } from "@/contexts/contact-modal-context";
```

Comment out the hook call at the top of the component:

```tsx
  // SUSPENDED: const { openModal } = useContactModal();
```

In the sidebar card, replace the "Reservar Agora" button and the orange "Fale Com um Especialista" link with a single `WhatsAppCtaButton`. The original block (around lines 370–384) is:

```tsx
                <div className="space-y-4 mb-6">
                  <Button
                    onClick={() => openModal(packageData?.title)}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 transition-transform duration-300 hover:scale-105"
                  >
                    Reservar Agora
                  </Button>

                  <Link
                    href={`https://wa.me/5567991395384?text=${encodeURIComponent(`Olá! Vim do site Bonito ON e gostaria de mais informações sobre o pacote ${packageData.title}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Fale Com um Especialista
                  </Link>
                </div>
```

Replace with:

```tsx
                <div className="space-y-4 mb-6">
                  {/*
                  SUSPENDED:
                  <Button
                    onClick={() => openModal(packageData?.title)}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 transition-transform duration-300 hover:scale-105"
                  >
                    Reservar Agora
                  </Button>
                  */}
                  {/*
                  SUSPENDED:
                  <Link
                    href={`https://wa.me/5567991395384?text=...`}
                    className="...bg-orange-500..."
                  >
                    Fale Com um Especialista
                  </Link>
                  */}
                  <WhatsAppCtaButton
                    message={`Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${packageData.title}.`}
                    label="Reservar pelo WhatsApp"
                    className="text-lg py-3"
                  />
                </div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add "app/pacotes/[slug]/index.tsx"
git commit -m "feat: replace pacote detail modal button with WhatsApp CTA"
```

---

## Task 10: Update `components/TourDetailPage.tsx` (legacy)

**Files:**
- Modify: `components/TourDetailPage.tsx`

- [ ] **Step 1: Apply changes**

Add `import React from "react"` at the top (fixes pre-existing missing import for `React.FC`) and add `WhatsAppCtaButton` import:

```tsx
"use client";

import React from "react";
import { Tour } from "@/types";
import { SiteLayout } from "@/components/site-layout";
import Image from "next/image";
import { Star } from "lucide-react";
import { WhatsAppCtaButton } from "@/components/whatsapp-cta-button"
```

Replace the two inert buttons in the "Reserve Button" section with `WhatsAppCtaButton`:

```tsx
        {/* Reserve Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/*
          SUSPENDED (no action):
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow hover:shadow-md text-lg">
            Reservar Agora
          </button>
          <button className="bg-white border border-green-600 text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-lg transition-all shadow-sm text-lg">
            Falar com um agente
          </button>
          */}
          <WhatsAppCtaButton
            message={`Olá! Vim do site Bonito ON e gostaria de reservar o passeio ${tour.title}.`}
            label="Reservar pelo WhatsApp"
          />
        </div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/TourDetailPage.tsx
git commit -m "feat: replace legacy TourDetailPage buttons with WhatsApp CTA"
```

---

## Task 11: Update `components/footer.tsx`

**Files:**
- Modify: `components/footer.tsx`

- [ ] **Step 1: Apply changes**

Add `FaWhatsapp` import at the top of the file (after existing imports):

```tsx
import { FaWhatsapp } from "react-icons/fa"
```

Remove `MessageCircle` from the Lucide import (line 4). Change:

```tsx
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle, Star, Award } from "lucide-react"
```

to:

```tsx
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Star, Award } from "lucide-react"
```

Replace the WhatsApp social button (uses `MessageCircle`) with `FaWhatsapp`:

```tsx
                {/*
                SUSPENDED:
                <Button
                  size="sm"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 p-2"
                  onClick={() => window.open("https://wa.me/5567991395384", "_blank")}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                */}
                <Button
                  size="sm"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10 p-2"
                  onClick={() => window.open("https://wa.me/5567991395384", "_blank")}
                >
                  <FaWhatsapp className="w-4 h-4" />
                </Button>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/footer.tsx
git commit -m "feat: update footer WhatsApp button to use official FaWhatsapp icon"
```

---

## Task 12: Final verification

- [ ] **Step 1: Run TypeScript check**

```bash
pnpm tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 2: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 3: Verify each page**

Open browser and check:
- `/` (home) — Hero button shows green WhatsApp CTA with FaWhatsapp icon, no modal appears
- `/tarifario` — Tour cards show "Reservar pelo WhatsApp" button (green, FaWhatsapp icon)
- `/pacotes` — Package cards show WhatsApp CTA
- `/passeios/[any-slug]` — Sidebar shows single WhatsApp CTA, no modal
- `/pacotes/[any-slug]` — Sidebar shows single WhatsApp CTA, no modal
- `/atracoes/[any-slug]` — Sidebar shows WhatsApp CTA, no modal
- Footer — WhatsApp social button uses FaWhatsapp icon (not generic chat bubble)
- Click any WhatsApp button — Opens `wa.me/5567991395384` with correct pre-filled message

- [ ] **Step 4: Verify modal is gone**

Confirm that no modal appears anywhere on the site. The floating `WhatsAppButton` (bottom-right) remains unchanged.
