import { createClient } from "@/lib/supabase/client"

interface Tour {
  id: string
  title: string
  description: string
  price: number
  price_child?: number | null
  price_high_season?: number | null
  price_senior?: number | null
  price_ms?: number | null
  price_child_high_season?: number | null
  price_child_low_season?: number | null
  price_senior_high_season?: number | null
  price_senior_low_season?: number | null
  price_ms_high_season?: number | null
  price_ms_low_season?: number | null
  min_child_age?: number | null
  image: string
  gallery?: string[]
  category: string
  rating: number
  slug?: string
  created_at?: string
  updated_at?: string
}



export type { Tour }

const supabase = createClient()

export async function getAllTours(): Promise<Tour[]> {
  try {
    console.log("🚀 Carregando tours do Supabase...")

    const { data, error } = await supabase.from("tours").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar tours:", error)
      return []
    }

    console.log("📊 Tours carregados:", data?.length || 0)

    if (!data || data.length === 0) {
      console.log("⚠️ Nenhum tour encontrado no Supabase")
      return []
    }

    // Transformar os dados para o formato esperado
    const tours: Tour[] = data.map((tour: any) => ({
      id: tour.id,
      title: tour.title || "",
      description: tour.description || "",
      price: !isNaN(parseFloat(tour.price)) ? parseFloat(tour.price) : 0,
      price_child: !isNaN(parseFloat(tour.price_child)) ? parseFloat(tour.price_child) : null,
      price_high_season: !isNaN(parseFloat(tour.price_high_season)) ? parseFloat(tour.price_high_season) : null,
      price_senior: !isNaN(parseFloat(tour.price_senior)) ? parseFloat(tour.price_senior) : null,
      price_ms: !isNaN(parseFloat(tour.price_ms)) ? parseFloat(tour.price_ms) : null,
      price_child_high_season: !isNaN(parseFloat(tour.price_child_high_season))
        ? parseFloat(tour.price_child_high_season)
        : null,
      price_child_low_season: !isNaN(parseFloat(tour.price_child_low_season))
        ? parseFloat(tour.price_child_low_season)
        : null,
      price_senior_high_season: !isNaN(parseFloat(tour.price_senior_high_season))
        ? parseFloat(tour.price_senior_high_season)
        : null,
      price_senior_low_season: !isNaN(parseFloat(tour.price_senior_low_season))
        ? parseFloat(tour.price_senior_low_season)
        : null,
      price_ms_high_season: !isNaN(parseFloat(tour.price_ms_high_season)) ? parseFloat(tour.price_ms_high_season) : null,
      price_ms_low_season: !isNaN(parseFloat(tour.price_ms_low_season)) ? parseFloat(tour.price_ms_low_season) : null,
      min_child_age: !isNaN(parseInt(tour.min_child_age)) ? parseInt(tour.min_child_age) : null,
      image: tour.image || "/placeholder.svg?height=400&width=600",
      gallery: tour.gallery || [],
      category: tour.category || "passeios",
      rating: tour.rating || 5,
      slug: tour.slug || createSlug(tour.title || ""),
      created_at: tour.created_at,
      updated_at: tour.updated_at,
    }))

    return tours
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tours:", error)
    return []
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    console.log("🔍 Buscando tour por slug:", slug)

    const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).single()

    if (error) {
      console.error("❌ Erro ao buscar tour por slug:", error)
      return null
    }

    if (!data) {
      console.log("⚠️ Tour não encontrado para slug:", slug)
      return null
    }

    // Transformar os dados para o formato esperado
    const tour: Tour = {
      id: data.id,
      title: data.title || "",
      description: data.description || "",
      price: !isNaN(parseFloat(data.price)) ? parseFloat(data.price) : 0,
      price_child: !isNaN(parseFloat(data.price_child)) ? parseFloat(data.price_child) : null,
      price_high_season: !isNaN(parseFloat(data.price_high_season)) ? parseFloat(data.price_high_season) : null,
      price_senior: !isNaN(parseFloat(data.price_senior)) ? parseFloat(data.price_senior) : null,
      price_ms: !isNaN(parseFloat(data.price_ms)) ? parseFloat(data.price_ms) : null,
      price_child_high_season: !isNaN(parseFloat(data.price_child_high_season))
        ? parseFloat(data.price_child_high_season)
        : null,
      price_child_low_season: !isNaN(parseFloat(data.price_child_low_season))
        ? parseFloat(data.price_child_low_season)
        : null,
      price_senior_high_season: !isNaN(parseFloat(data.price_senior_high_season))
        ? parseFloat(data.price_senior_high_season)
        : null,
      price_senior_low_season: !isNaN(parseFloat(data.price_senior_low_season))
        ? parseFloat(data.price_senior_low_season)
        : null,
      price_ms_high_season: !isNaN(parseFloat(data.price_ms_high_season)) ? parseFloat(data.price_ms_high_season) : null,
      price_ms_low_season: !isNaN(parseFloat(data.price_ms_low_season)) ? parseFloat(data.price_ms_low_season) : null,
      min_child_age: !isNaN(parseInt(data.min_child_age)) ? parseInt(data.min_child_age) : null,
      image: data.image || "/placeholder.svg?height=400&width=600",
      gallery: data.gallery || [],
      category: data.category || "passeios",
      rating: data.rating || 5,
      slug: data.slug || createSlug(data.title || ""),
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    console.log("✅ Tour encontrado:", tour.title)
    return tour
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tour por slug:", error)
    return null
  }
}

// Função para criar slug a partir do título
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const { data, error } = await supabase.from("tours").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar tour por ID:", error)
      return null
    }

    if (!data) {
      return null
    }

    // Transformar os dados para o formato esperado
    const tour: Tour = {
      id: data.id,
      title: data.title || "",
      description: data.description || "",
      price: !isNaN(parseFloat(data.price)) ? parseFloat(data.price) : 0,
      price_child: !isNaN(parseFloat(data.price_child)) ? parseFloat(data.price_child) : null,
      price_high_season: !isNaN(parseFloat(data.price_high_season)) ? parseFloat(data.price_high_season) : null,
      price_senior: !isNaN(parseFloat(data.price_senior)) ? parseFloat(data.price_senior) : null,
      price_ms: !isNaN(parseFloat(data.price_ms)) ? parseFloat(data.price_ms) : null,
      price_child_high_season: !isNaN(parseFloat(data.price_child_high_season))
        ? parseFloat(data.price_child_high_season)
        : null,
      price_child_low_season: !isNaN(parseFloat(data.price_child_low_season))
        ? parseFloat(data.price_child_low_season)
        : null,
      price_senior_high_season: !isNaN(parseFloat(data.price_senior_high_season))
        ? parseFloat(data.price_senior_high_season)
        : null,
      price_senior_low_season: !isNaN(parseFloat(data.price_senior_low_season))
        ? parseFloat(data.price_senior_low_season)
        : null,
      price_ms_high_season: !isNaN(parseFloat(data.price_ms_high_season)) ? parseFloat(data.price_ms_high_season) : null,
      price_ms_low_season: !isNaN(parseFloat(data.price_ms_low_season)) ? parseFloat(data.price_ms_low_season) : null,
      min_child_age: !isNaN(parseInt(data.min_child_age)) ? parseInt(data.min_child_age) : null,
      image: data.image || "/placeholder.svg?height=400&width=600",
      gallery: data.gallery || [],
      category: data.category || "passeios",
      rating: data.rating || 5,
      slug: data.slug || createSlug(data.title || ""),
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return tour
  } catch (error) {
    console.error("Erro inesperado ao buscar tour por ID:", error)
    return null
  }
}
