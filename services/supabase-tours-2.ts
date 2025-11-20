import { createClient } from "@/lib/supabase/client"
import { DatabaseTour2 } from "@/lib/supabase/types"

// Interface for the transformed tour data from 'tours_2' table
// Interface for the transformed tour data from 'tours_2' table, matching UI component needs
interface Tour2Data {
  id: string
  title: string
  description: string
  price: number // Corresponds to price in UI (Baixa Temporada - Adulto)
  chd_price_ls?: number | null
  price_child_hs?: number | null
  hs_price?: number | null // Corresponds to price_high_season in UI (Alta Temporada - Adulto)
  senior_price?: number | null // Corresponds to price_senior in UI (Melhor Idade - qualquer temporada)
  ms_price?: number | null // Corresponds to price_ms in UI (Morador MS - qualquer temporada)
  min_child_age?: number | null
  image: string
  gallery?: string[]
  category: string
  rating: number
  slug?: string
  created_at?: string
  updated_at?: string
  duration?: string | null
}

export type { Tour2Data }

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
export function mapDatabaseTour2ToTour2Data(data: DatabaseTour2): Tour2Data {
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    price: data.price || 0, // Map to new field name
    chd_price_ls: data.chd_price_ls,
    price_child_hs: data.price_child_hs,
    hs_price: data.hs_price, // Map to new field name
    senior_price: data.senior_price, // Map to new field name
    ms_price: data.ms_price, // Map to new field name
    min_child_age: data.min_child_age,
    image: data.image || "/placeholder.svg?height=400&width=600",
    gallery: data.gallery || [],
    category: data.category || "adventure", // Default to "adventure" if null
    rating: data.rating || 5,
    slug: data.slug || createSlug(data.title || ""),
    created_at: data.created_at,
    updated_at: data.updated_at,
    duration: data.duration,
  }
}

// Function to map Tour2Data back to DatabaseTour2 for updates/inserts
export function mapTour2DataToDatabaseTour2(data: Tour2Data): DatabaseTour2 {
  const slugValue = data.slug === undefined ? null : data.slug;
  const imageValue = data.image === undefined ? null : data.image;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price, // Map to new field name
    chd_price_ls: data.chd_price_ls || null,
    price_child_hs: data.price_child_hs || null,
    hs_price: data.hs_price || null, // Map to new field name
    senior_price: data.senior_price || null, // Map to new field name
    ms_price: data.ms_price || null, // Map to new field name
    min_child_age: data.min_child_age || null,
    gallery: data.gallery || null,
    image: imageValue,
    category: data.category,
    rating: data.rating,
    slug: slugValue,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    duration: data.duration || null,
  };
}

export async function getAllTours2(): Promise<Tour2Data[]> {
  try {
    console.log("🚀 Carregando tours do Supabase (tours_2)...")

    const { data, error } = await supabase.from("tours_2").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar tours da tabela tours_2:", error)
      return []
    }

    console.log("📊 Tours carregados (tours_2):", data?.length || 0)

    if (!data || data.length === 0) {
      console.log("⚠️ Nenhum tour encontrado na tabela tours_2 do Supabase")
      return []
    }

    const tours: Tour2Data[] = data.reduce((acc: Tour2Data[], tour: DatabaseTour2) => {
      try {
        const mappedTour: Tour2Data = mapDatabaseTour2ToTour2Data(tour)
        acc.push(mappedTour)
      } catch (e) {
        console.error("❌ Erro ao processar o tour da tabela tours_2:", tour.id, e)
      }
      return acc
    }, [])

    return tours
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tours da tabela tours_2:", error)
    return []
  }
}

export async function createTour2(tour: Omit<Tour2Data, "id">): Promise<Tour2Data | null> {
  try {
    const { data, error } = await supabase
      .from("tours_2")
      .insert({
        title: tour.title,
        description: tour.description,
        price: tour.price,
        chd_price_ls: tour.chd_price_ls || null,
        price_child_hs: tour.price_child_hs || null,
        hs_price: tour.hs_price || null,
        senior_price: tour.senior_price || null,
        ms_price: tour.ms_price || null,
        min_child_age: tour.min_child_age || null,
        image: tour.image,
        gallery: tour.gallery || null,
        rating: tour.rating,
        category: tour.category,
        slug: createSlug(tour.title),
        duration: tour.duration,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating tour in tours_2:", error)
      return null
    }

    return mapDatabaseTour2ToTour2Data(data);
  } catch (error: any) {
    console.error("Error creating tour in tours_2:", error.message, (error as any).details || error);
    return null;
  }
}

export async function updateTour2(tour: Tour2Data): Promise<boolean> {
  try {
    console.log("Attempting to update tour in tours_2 with data:", tour); // Added logging
    const { error } = await supabase
      .from("tours_2")
      .update({
        title: tour.title,
        description: tour.description,
        price: tour.price,
        chd_price_ls: tour.chd_price_ls || null,
        price_child_hs: tour.price_child_hs || null,
        hs_price: tour.hs_price || null,
        senior_price: tour.senior_price || null,
        ms_price: tour.ms_price || null,
        min_child_age: tour.min_child_age || null,
        gallery: tour.gallery || null,
        image: tour.image,
        category: tour.category,
        rating: tour.rating,
        slug: tour.slug,
        duration: tour.duration,
      })
      .eq("id", tour.id)

    if (error) {
      console.error("Error updating tour in tours_2:", JSON.stringify(error, null, 2));
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Error in updateTour2:", error.message, error.stack, error);
    return false;
  }
}

export async function deleteTour2(tourId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("tours_2").delete().eq("id", tourId)

    if (error) {
      console.error("Error deleting tour from tours_2:", error.message, (error as any).details || error);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Error in deleteTour2:", error.message, error.stack, error);
    return false;
  }
}

export async function getTour2ById(id: string): Promise<Tour2Data | null> {
  try {
    const { data, error } = await supabase.from("tours_2").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar tour por ID na tabela tours_2:", error)
      return null
    }

    if (!data) {
      return null
    }

    const tour: Tour2Data = mapDatabaseTour2ToTour2Data(data)

    return tour
  } catch (error: any) {
    console.error("Erro inesperado ao buscar tour por ID na tabela tours_2:", error.message, error.stack, error);
    return null;
  }
}