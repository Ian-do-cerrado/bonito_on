import { createClient } from "@/lib/supabase/client"
import { DatabaseTour, TourData } from "@/lib/supabase/types"
import { createSlug, mapDatabaseTourToTourData } from "@/lib/supabase/server-utils"

export type Tour = TourData

const supabase = createClient()

export function mapTourDataToDatabaseTour(data: TourData): DatabaseTour {
  // Ensure slug is not undefined, fall back to null if necessary for DatabaseTour
  const slugValue = data.slug === undefined ? null : data.slug;
  const imageValue = data.image === undefined ? null : data.image;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    price_child: data.price_child || null,
    price_high_season: data.price_high_season || null,
    price_senior: data.price_senior || null,
    price_ms_low_season: data.price_ms_low_season || null,
    price_ms_high_season: data.price_ms_high_season || null,
    min_child_age: data.min_child_age || null,
    gallery: data.gallery || null, // Assuming gallery is optional and can be null
    duration: data.duration || null,
    image: imageValue,
    category: data.category,
    rating: data.rating,
    slug: slugValue,
    created_at: data.created_at || new Date().toISOString(), // Fallback for created_at
    updated_at: data.updated_at || new Date().toISOString(), // Fallback for updated_at
  };
}


export async function getAllTours(): Promise<TourData[]> {
  try {
    console.log("🚀 Carregando tours do Supabase...")

    const { data, error } = await supabase.from("tours").select("*, duration").order("created_at", { ascending: false })

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
    const tours: TourData[] = data.reduce((acc: TourData[], tour: DatabaseTour) => {
      try {
        const mappedTour: TourData = mapDatabaseTourToTourData(tour)
        acc.push(mappedTour)
      } catch (e) {
        console.error("❌ Erro ao processar o tour:", tour.id, e)
      }
      return acc
    }, [])

    return tours
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tours:", error)
    return []
  }
}

export async function getTourBySlug(slug: string): Promise<TourData | null> {
  try {
    console.log("🔍 Buscando tour por slug:", slug)

    const { data, error } = await supabase.from("tours").select("*, duration").eq("slug", slug).single()

    if (error) {
      console.error("❌ Erro ao buscar tour por slug:", error)
      return null
    }

    if (!data) {
      console.log("⚠️ Tour não encontrado para slug:", slug)
      return null
    }

    // Transformar os dados para o formato esperado
    const tour: TourData = mapDatabaseTourToTourData(data)

    console.log("✅ Tour encontrado:", tour.title)
    return tour
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tour por slug:", error)
    return null
  }
}


export async function getTourById(id: string): Promise<TourData | null> {
  try {
    const { data, error } = await supabase.from("tours").select("*, duration").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar tour por ID:", error)
      return null
    }

    if (!data) {
      return null
    }

    // Transformar os dados para o formato esperado
    const tour: TourData = mapDatabaseTourToTourData(data)

    return tour
  } catch (error) {
    console.error("Erro inesperado ao buscar tour por ID:", error)
    return null
  }
}

