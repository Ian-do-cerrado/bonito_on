import { createClient } from "@/lib/supabase/client"
import { DatabaseTour2, Tour2Data } from "@/lib/supabase/types"

const supabase = createClient()

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

// Function to map raw DatabaseTour to Tour2Data
export function mapDatabaseTour2ToTourData(data: DatabaseTour2): Tour2Data {
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    price: data.price || 0,
    chd_price_ls: data.chd_price_ls,
    price_chd_hs: data.price_chd_hs,
    hs_price: data.hs_price,
    senior_price_ls: data.senior_price,
    price_senior_hs: data.price_senior_hs,
    ms_price_ls: data.ms_price,
    price_ms_hs: data.price_ms_hs,
    min_child_age: data.min_child_age,
    image: data.image || "/placeholder.svg?height=400&width=600",
    gallery: data.gallery || [],
    category: data.category || "adventure", // Default to "adventure" if null
    rating: data.rating || 5,
    slug: data.slug || createSlug(data.title || ""),
    created_at: data.created_at,
    updated_at: data.updated_at,
    duration: data.duration,
    is_visible: data.is_visible,
  }
}

// Function to map Tour2Data back to DatabaseTour2 for updates/inserts
export function mapTour2DataToDatabaseTour2(data: Tour2Data): DatabaseTour2 {
  const slugValue = data.slug === undefined ? null : data.slug
  const imageValue = data.image === undefined ? null : data.image

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    chd_price_ls: data.chd_price_ls || null,
    price_child_hs: data.price_chd_hs,
    hs_price: data.hs_price || null,
    senior_price: data.senior_price_ls || null,
    price_senior_hs: data.price_senior_hs || null,
    ms_price: data.ms_price_ls || null,
    price_ms_hs: data.price_ms_hs || null,
    min_child_age: data.min_child_age || null,
    gallery: data.gallery || null,
    image: imageValue,
    category: data.category,
    rating: data.rating,
    slug: slugValue,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    duration: data.duration || null,
    is_visible: data.is_visible,
  }
}

export async function getAllTours2(): Promise<Tour2Data[]> {
  try {
    console.log("🚀 Carregando tours 2 do Supabase...")

    const { data, error } = await supabase.from("tours_2").select("*, duration").eq("is_visible", true).order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar tours 2:", error)
      return []
    }

    console.log("📊 Tours 2 carregados:", data?.length || 0)

    if (!data || data.length === 0) {
      console.log("⚠️ Nenhum tour 2 encontrado no Supabase")
      return []
    }

    // Transformar os dados para o formato esperado
    const tours: Tour2Data[] = data.reduce((acc: Tour2Data[], tour: DatabaseTour2) => {
      try {
        const mappedTour: Tour2Data = mapDatabaseTour2ToTourData(tour)
        acc.push(mappedTour)
      } catch (e) {
        console.error("❌ Erro ao processar o tour 2:", tour.id, e)
      }
      return acc
    }, [])

    return tours
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tours 2:", error)
    return []
  }
}

export async function getAllTours2Admin(): Promise<Tour2Data[]> {
  try {
    console.log("🚀 Carregando tours 2 do Supabase para admin...")

    const { data, error } = await supabase.from("tours_2").select("*, duration").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar tours 2 para admin:", error)
      return []
    }

    console.log("📊 Tours 2 carregados para admin:", data?.length || 0)

    if (!data || data.length === 0) {
      console.log("⚠️ Nenhum tour 2 encontrado no Supabase para admin")
      return []
    }

    // Transformar os dados para o formato esperado
    const tours: Tour2Data[] = data.reduce((acc: Tour2Data[], tour: DatabaseTour2) => {
      try {
        const mappedTour: Tour2Data = mapDatabaseTour2ToTourData(tour)
        acc.push(mappedTour)
      } catch (e) {
        console.error("❌ Erro ao processar o tour 2 para admin:", tour.id, e)
      }
      return acc
    }, [])

    return tours
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tours 2 para admin:", error)
    return []
  }
}

export async function getTour2BySlug(slug: string): Promise<Tour2Data | null> {
  try {
    console.log("🔍 Buscando tour 2 por slug:", slug)

    const { data, error } = await supabase.from("tours_2").select("*, duration").eq("slug", slug).single()

    if (error) {
      console.error("❌ Erro ao buscar tour 2 por slug:", error)
      return null
    }

    if (!data) {
      console.log("⚠️ Tour 2 não encontrado para slug:", slug)
      return null
    }

    // Transformar os dados para o formato esperado
    const tour: Tour2Data = mapDatabaseTour2ToTourData(data)

    console.log("✅ Tour 2 encontrado:", tour.title)
    return tour
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tour 2 por slug:", error)
    return null
  }
}