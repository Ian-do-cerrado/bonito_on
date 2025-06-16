import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface Tour {
  id: string
  title: string
  description: string
  price: number
  image: string
  gallery?: string[] // Array de URLs de imagens para a galeria
  rating: number
  category: string
  slug?: string
}

// Adicionar a função para criar slug consistente
function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
}

export async function getAllTours(): Promise<Tour[]> {
  try {
    const { data: tours, error } = await supabase.from("tours").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tours:", error)
      return getFallbackTours()
    }

    return transformDatabaseTours(tours || [])
  } catch (error) {
    console.error("Error in getAllTours:", error)
    return getFallbackTours()
  }
}

// Modificar a função getTourBySlug para buscar por slug gerado se necessário
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    // Primeiro tenta buscar pelo slug exato
    let { data: tour, error } = await supabase.from("tours").select("*").eq("slug", slug).single()

    // Se não encontrar, tenta buscar todos os tours e comparar os slugs gerados
    if (error || !tour) {
      const { data: allTours } = await supabase.from("tours").select("*")
      if (allTours) {
        // Encontra o tour cujo título gera o slug correspondente
        tour = allTours.find((t) => createSlug(t.title) === slug)
      }
    }

    if (!tour) {
      console.error("Tour not found with slug:", slug)
      return null
    }

    return transformDatabaseTour(tour)
  } catch (error) {
    console.error("Error in getTourBySlug:", error)
    return null
  }
}

function transformDatabaseTours(dbTours: any[]): Tour[] {
  return dbTours.map(transformDatabaseTour)
}

// Modificar a função transformDatabaseTour para incluir gallery
function transformDatabaseTour(dbTour: any): Tour {
  return {
    id: dbTour.id,
    title: dbTour.title,
    description: dbTour.description,
    price: dbTour.price,
    image: dbTour.image || "/placeholder.svg?height=300&width=400",
    gallery: dbTour.gallery || [], // Incluir o array de galeria
    rating: dbTour.rating,
    category: dbTour.category,
    // Use o slug do banco de dados se existir, caso contrário, crie um a partir do título
    slug: dbTour.slug || createSlug(dbTour.title),
  }
}

function getFallbackTours(): Tour[] {
  return [
    {
      id: "1",
      title: "Gruta do Lago Azul",
      description: "Explore a famosa gruta com lago de águas cristalinas azuis",
      price: 85,
      image: "/placeholder.svg?height=300&width=400",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      rating: 4.8,
      category: "contemplation",
      slug: "gruta-do-lago-azul",
    },
    {
      id: "2",
      title: "Aquário Natural",
      description: "Mergulho com snorkel em águas cristalinas com peixes coloridos",
      price: 120,
      image: "/placeholder.svg?height=300&width=400",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      rating: 4.9,
      category: "floating",
      slug: "aquario-natural",
    },
    // Outros tours com o mesmo padrão...
  ]
}

// Export as default object for backward compatibility
export const tourService = {
  getAllTours,
  getTourBySlug,
}
