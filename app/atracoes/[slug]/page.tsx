import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAttractionBySlug } from "@/services/supabase-attractions"
import { AttractionDetailPage } from "@/components/attraction-detail-page"

interface AttractionPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: AttractionPageProps): Promise<Metadata> {
  const attraction = await getAttractionBySlug(params.slug)

  if (!attraction) {
    return {
      title: "Atração não encontrada - Bonito Ecoturismo",
      description: "A atração solicitada não foi encontrada.",
    }
  }

  return {
    title: `${attraction.title} - Bonito Ecoturismo`,
    description: attraction.description,
    openGraph: {
      title: `${attraction.title} - Bonito Ecoturismo`,
      description: attraction.description,
      images: [
        {
          url: attraction.image,
          width: 1200,
          height: 630,
          alt: attraction.title,
        },
      ],
    },
  }
}

export default async function AttractionPage({ params }: AttractionPageProps) {
  const attraction = await getAttractionBySlug(params.slug)

  if (!attraction) {
    notFound()
  }

  return <AttractionDetailPage attraction={attraction} />
}
