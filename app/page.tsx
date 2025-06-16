"use client"

import { HeroSection } from "@/components/hero-section"
import { PackagesSection } from "@/components/packages-section"
import { ToursSection } from "@/components/tours-section"
import { AttractionsSection } from "@/components/attractions-section"
import { BlogSection } from "@/components/blog-section"
import { ReviewsSection } from "@/components/reviews-section"
import { SiteLayout } from "@/components/site-layout"
import { SeasonSection } from "@/components/season-section"

export default function HomePage() {
  return (
    <SiteLayout>
      <div id="home">
        <HeroSection />
      </div>
      <PackagesSection />
      <ToursSection />
      <AttractionsSection />
      <SeasonSection />
      <BlogSection />
      <ReviewsSection />
    </SiteLayout>
  )
}
