import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { resolveImageUrl } from "@/lib/image-url"

const defaultClient = createClient()

export interface Attraction {
  id: string
  title: string
  description: string
  title_en?: string
  description_en?: string
  title_es?: string
  description_es?: string
  image: string
  category: "gastronomy" | "accommodation" | "transport" | "events"
  location: string
  duration?: string
  capacity?: string
  groupSize?: string
  price?: string
  rating: number
  slug: string
  highlights: string[]
}

export async function getAllAttractions(supabase: SupabaseClient = defaultClient): Promise<Attraction[]> {
  try {
    const { data: attractions, error } = await supabase
      .from("attractions")
      .select(`
        *,
        attraction_highlights(highlight)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching attractions:", error)
      return getFallbackAttractions()
    }

    return transformDatabaseAttractions(attractions || [])
  } catch (error) {
    console.error("Error in getAllAttractions:", error)
    return getFallbackAttractions()
  }
}

export async function getAttractionsByCategory(category: Attraction["category"], supabase: SupabaseClient = defaultClient): Promise<Attraction[]> {
  try {
    const { data: attractions, error } = await supabase
      .from("attractions")
      .select(`
        *,
        attraction_highlights(highlight)
      `)
      .eq("category", category)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching attractions by category:", error)
      return getFallbackAttractions().filter((a) => a.category === category)
    }

    return transformDatabaseAttractions(attractions || [])
  } catch (error) {
    console.error("Error in getAttractionsByCategory:", error)
    return getFallbackAttractions().filter((a) => a.category === category)
  }
}

export async function getAttractionBySlug(slug: string, supabase: SupabaseClient = defaultClient): Promise<Attraction | null> {
  try {
    const { data: attraction, error } = await supabase
      .from("attractions")
      .select(`
        *,
        attraction_highlights(highlight)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching attraction by slug:", error)
      return getFallbackAttractions().find((a) => a.slug === slug) || null
    }

    return transformDatabaseAttraction(attraction)
  } catch (error) {
    console.error("Error in getAttractionBySlug:", error)
    return getFallbackAttractions().find((a) => a.slug === slug) || null
  }
}

function transformDatabaseAttractions(dbAttractions: any[]): Attraction[] {
  return dbAttractions.map(transformDatabaseAttraction)
}

function transformDatabaseAttraction(dbAttraction: any): Attraction {
  return {
    id: dbAttraction.id,
    title: dbAttraction.title,
    description: dbAttraction.description,
    title_en: dbAttraction.title_en || "",
    description_en: dbAttraction.description_en || "",
    title_es: dbAttraction.title_es || "",
    description_es: dbAttraction.description_es || "",
    image: resolveImageUrl(dbAttraction.image),
    category: dbAttraction.category,
    location: dbAttraction.location,
    duration: dbAttraction.duration,
    capacity: dbAttraction.capacity,
    groupSize: dbAttraction.groupSize,
    price: dbAttraction.price,
    rating: dbAttraction.rating,
    slug: dbAttraction.slug,
    highlights: Array.isArray(dbAttraction.attraction_highlights)
      ? dbAttraction.attraction_highlights.map((h: any) => (typeof h === "string" ? h : h?.highlight)).filter(Boolean)
      : [],
  }
}

function getFallbackAttractions(): Attraction[] {
  return [
    {
      id: "1",
      title: "Restaurante Casa do João",
      description: "Culinária regional com pratos típicos do Pantanal e Cerrado",
      image: "/images/placeholder.svg",
      category: "gastronomy",
      location: "Centro de Bonito",
      duration: "2 horas",
      capacity: "80 pessoas",
      groupSize: "80 pessoas",
      price: "R$ 45-85",
      rating: 4.7,
      slug: "restaurante-casa-do-joao",
      highlights: ["Pacu assado na telha", "Farofa de banana", "Sobremesa de pequi"],
    },
    {
      id: "2",
      title: "Churrascaria Pantanal",
      description: "Rodízio de carnes nobres com buffet de saladas",
      image: "/images/placeholder.svg",
      category: "gastronomy",
      location: "Av. Pilad Rebuá",
      duration: "2 horas",
      capacity: "120 pessoas",
      groupSize: "120 pessoas",
      price: "R$ 65-95",
      rating: 4.8,
      slug: "churrascaria-pantanal",
      highlights: ["Picanha premium", "Buffet completo", "Ambiente climatizado"],
    },
  ]
}
