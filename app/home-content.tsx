"use client"

import { HeroSection } from "@/components/hero-section"
import { PackagesSection } from "@/components/packages-section"
import { ToursSection } from "@/components/tours-section"
import { AttractionsSection } from "@/components/attractions-section"
import { BlogSection } from "@/components/blog-section"
import { ReviewsSection } from "@/components/reviews-section"
import { SiteLayout } from "@/components/site-layout"
import { SeasonSection } from "@/components/season-section"
import type { Tour } from "@/services/supabase-tours"
import type { Package } from "@/types/package"
import type { Attraction } from "@/services/supabase-attractions"

interface HomeContentProps {
  initialTours?: Tour[]
  initialPackages?: Package[]
  initialAttractions?: Attraction[]
}

export function HomeContent({
  initialTours,
  initialPackages,
  initialAttractions,
}: HomeContentProps) {
  return (
    <SiteLayout>
      <div id="home">
        <HeroSection />
      </div>
      <PackagesSection initialPackages={initialPackages ?? undefined} />
      <ToursSection initialTours={initialTours ?? undefined} />
      <AttractionsSection initialAttractions={initialAttractions ?? undefined} />
      <SeasonSection />
      <BlogSection />
      <ReviewsSection />
    </SiteLayout>
  )
}
