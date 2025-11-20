import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllTours2, getTour2BySlug } from "@/lib/supabase/tours-2"
import { TourData } from "@/lib/supabase/types"
import ValorFuturoTourDetailPageClient from "./index"

interface ValorFuturoTourPageProps {
  params: {
    slug: string
  },
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateStaticParams() {
  const tours = await getAllTours2()

  const paths = tours.filter((tour) => tour.slug).map((tour) => ({
    slug: tour.slug,
  }))

  return paths
}

export async function generateMetadata({ params }: ValorFuturoTourPageProps): Promise<Metadata> {
  const tour = await getTour2BySlug(params.slug)

  if (!tour) {
    return {
      title: "Passeio não encontrado - Bonito Ecoturismo",
      description: "O passeio solicitado não foi encontrado.",
    }
  }

  return {
    title: `${tour.title} - Bonito Ecoturismo`,
    description: tour.description,
    openGraph: {
      title: `${tour.title} - Bonito Ecoturismo`,
      description: tour.description,
      images: tour.image
        ? [
            {
              url: tour.image,
              width: 1200,
              height: 630,
              alt: tour.title,
            },
          ]
        : [],
    },
  }
}

export default async function ValorFuturoTourPage({ params }: ValorFuturoTourPageProps) {
  const tour = await getTour2BySlug(params.slug)

  if (!tour) {
    notFound()
  }

  return <ValorFuturoTourDetailPageClient initialTour={tour as TourData} />
}