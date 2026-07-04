"use client";

import { Sora, Inter } from "next/font/google";
import "./promo.css";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { WhyUs } from "./components/why-us";
import { Packages } from "./components/packages";
import { Comparison } from "./components/comparison";
import { HowItWorks } from "./components/how-it-works";
import { IncludedSection } from "./components/included-section";
import { Differentials } from "./components/differentials";
import { Gallery } from "./components/gallery";
import { FAQ } from "./components/faq";
import { FinalCTA } from "./components/final-cta";
import { Footer } from "./components/footer";
import { WhatsAppFloat } from "./components/whatsapp-float";

const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700", "800"], display: "swap", variable: "--promo-font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--promo-font-sans" });

export default function PacotesPromoPage() {
  return (
    <div className={`promo-scope min-h-screen ${sora.variable} ${inter.variable}`}>
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Packages />
        <Comparison />
        <HowItWorks />
        <IncludedSection />
        <Differentials />
        <Gallery />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
