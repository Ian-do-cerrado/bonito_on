import { createClient } from "@/lib/supabase/client"

interface Tour {
  id: string
  title: string
  description: string
  price: number
  chd_price?: number | null
  hs_price?: number | null
  senior_price?: number | null
  ms_price?: number | null
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
      price: Number.parseFloat(tour.price) || 0,
      chd_price: tour.chd_price ? Number.parseFloat(tour.chd_price) : null,
      hs_price: tour.hs_price ? Number.parseFloat(tour.hs_price) : null,
      senior_price: tour.senior_price ? Number.parseFloat(tour.senior_price) : null,
      ms_price: tour.ms_price ? Number.parseFloat(tour.ms_price) : null,
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
      price: Number.parseFloat(data.price) || 0,
      chd_price: data.chd_price ? Number.parseFloat(data.chd_price) : null,
      hs_price: data.hs_price ? Number.parseFloat(data.hs_price) : null,
      senior_price: data.senior_price ? Number.parseFloat(data.senior_price) : null,
      ms_price: data.ms_price ? Number.parseFloat(data.ms_price) : null,
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
      price: Number.parseFloat(data.price) || 0,
      chd_price: data.chd_price ? Number.parseFloat(data.chd_price) : null,
      hs_price: data.hs_price ? Number.parseFloat(data.hs_price) : null,
      senior_price: data.senior_price ? Number.parseFloat(data.senior_price) : null,
      ms_price: data.ms_price ? Number.parseFloat(data.ms_price) : null,
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
