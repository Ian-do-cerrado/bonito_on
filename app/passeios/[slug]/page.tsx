import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllTours, getTourBySlug, Tour } from "@/services/supabase-tours"
import TourDetailPageClient from "./index"

interface TourPageProps {
  params: {
    slug: string
  }
}

// export async function generateStaticParams() {
//   const tours = await getAllTours()

//   const paths = tours.filter((tour) => tour.slug).map((tour: Tour) => ({
//     slug: tour.slug,
//   }))
//   console.log("Generated paths for tours:", JSON.stringify(paths, null, 2))
//   return paths
// }

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const tour = await getTourBySlug(params.slug)

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
      images: [
        {
          url: tour.image,
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
    },
  }
}

export default async function TourPage({ params }: TourPageProps) {
  const tour = await getTourBySlug(params.slug)

  if (!tour) {
    notFound()
  }

  return <TourDetailPageClient initialTour={tour} />
}
