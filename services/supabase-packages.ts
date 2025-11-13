import { createClient } from "@/lib/supabase/client"
import type { Package } from "@/types/package"
export type { Package } from "@/types/package"

const supabase = createClient()

export async function getAllPackages(): Promise<Package[]> {
  try {
    const { data: packages, error } = await supabase
      .from("packages")
      .select(`
        *,
        package_highlights(highlight),
        package_included(item),
        package_best_seasons(season),
        package_itinerary(
          day,
          title,
          accommodation,
          itinerary_activities(activity),
          itinerary_meals(meal)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching packages:", error)
      return getFallbackPackages()
    }

    return transformDatabasePackages(packages || [])
  } catch (error) {
    console.error("Error in getAllPackages:", error)
    return getFallbackPackages()
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  try {
    const { data: packageData, error } = await supabase
      .from("packages")
      .select(`
        *,
        package_highlights(highlight),
        package_included(item),
        package_best_seasons(season),
        package_itinerary(
          day,
          title,
          accommodation,
          itinerary_activities(activity),
          itinerary_meals(meal)
        )
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching package by slug:", error)
      return null
    }

    return transformDatabasePackage(packageData)
  } catch (error) {
    console.error("Error in getPackageBySlug:", error)
    return null
  }
}

function transformDatabasePackages(dbPackages: any[]): Package[] {
  return dbPackages.map(transformDatabasePackage)
}

function transformDatabasePackage(dbPackage: any): Package {
  return {
    id: dbPackage.id,
    title: dbPackage.title,
    subtitle: dbPackage.subtitle || "",
    description: dbPackage.description,
    duration: dbPackage.duration,
    price: dbPackage.price,
    originalPrice: dbPackage.original_price,
    image: dbPackage.image || "/placeholder.svg?height=400&width=600",
    category: dbPackage.category,
    rating: dbPackage.rating,
    reviewsCount: dbPackage.reviews_count,
    maxPeople: dbPackage.max_people,
    difficulty: dbPackage.difficulty,
    slug: dbPackage.slug,
    highlights: dbPackage.package_highlights?.map((h: any) => h.highlight) || [],
    included: dbPackage.package_included?.map((i: any) => i.item) || [],
    bestSeason: dbPackage.package_best_seasons?.map((s: any) => s.season) || [],
    itinerary: transformItinerary(dbPackage.package_itinerary || []),
  }
}

function transformItinerary(dbItinerary: any[]): Package["itinerary"] {
  return dbItinerary
    .sort((a, b) => a.day - b.day)
    .map((day) => ({
      day: day.day,
      title: day.title,
      activities: day.itinerary_activities?.map((a: any) => a.activity) || [],
      meals: day.itinerary_meals?.map((m: any) => m.meal) || [],
      accommodation: day.accommodation,
    }))
}

function getFallbackPackages(): Package[] {
  // Return existing mock data as fallback
  return [
    {
      id: "1",
      title: "Bonito Essencial",
      subtitle: "O melhor de Bonito em 3 dias",
      description: "Pacote perfeito para quem quer conhecer os principais atrativos de Bonito com conforto e economia.",
      duration: "3 dias / 2 noites",
      price: 890,
      originalPrice: 1200,
      image: "/placeholder.svg?height=400&width=600",
      highlights: [
        "Rio da Prata - Flutuação",
        "Gruta do Lago Azul",
        "Balneário Municipal",
        "Aquário Natural",
        "Transfer aeroporto incluso",
      ],
      included: [
        "2 noites de hospedagem",
        "Café da manhã",
        "Transporte para passeios",
        "Guia especializado",
        "Seguro viagem",
      ],
      itinerary: [
        {
          day: 1,
          title: "Chegada e Aquário Natural",
          activities: ["Check-in no hotel", "Aquário Natural", "Jantar de boas-vindas"],
          meals: ["Jantar"],
        },
        {
          day: 2,
          title: "Rio da Prata e Gruta do Lago Azul",
          activities: ["Flutuação no Rio da Prata", "Almoço", "Gruta do Lago Azul"],
          meals: ["Café da manhã", "Almoço"],
        },
        {
          day: 3,
          title: "Balneário e Partida",
          activities: ["Balneário Municipal", "Check-out", "Transfer aeroporto"],
          meals: ["Café da manhã"],
        },
      ],
      category: "economico",
      rating: 5,
      reviewsCount: 127,
      maxPeople: 15,
      difficulty: "facil",
      bestSeason: ["Maio", "Junho", "Julho", "Agosto", "Setembro"],
      slug: "bonito-essencial",
    },
  ]
}

// Export packageService object for backward compatibility
export const packageService = {
  getAllPackages,
  getPackageBySlug,
}
