import { DatabaseTour, TourData, DatabaseTour2, Tour2Data } from "@/lib/supabase/types"

// Função para criar slug a partir do título
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Function to map raw DatabaseTour to TourData
export function mapDatabaseTourToTourData(data: DatabaseTour): TourData {
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    price: data.price,
    duration: data.duration,
    price_child: data.price_child,
    price_high_season: data.price_high_season,
    price_senior: data.price_senior,
    price_ms_high_season: data.price_ms_high_season,
    price_ms_low_season: data.price_ms_low_season,
    min_child_age: data.min_child_age,
    image: data.image || "/placeholder.svg?height=400&width=600",
    category: data.category || "passeios",
    rating: data.rating || 5,
    slug: data.slug || createSlug(data.title || ""),
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Function to map raw DatabaseTour2 to Tour2Data
export function mapDatabaseTour2ToTourData(data: DatabaseTour2): Tour2Data {
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    price: data.price || 0,
    chd_price: data.chd_price,
    hs_price: data.hs_price,
    senior_price: data.senior_price,
    ms_price: data.ms_price,
    min_child_age: data.min_child_age,
    image: data.image || "/placeholder.svg?height=400&width=600",
    gallery: data.gallery || [],
    category: data.category || "passeios",
    rating: data.rating || 5,
    slug: data.slug || createSlug(data.title || ""),
    created_at: data.created_at,
    updated_at: data.updated_at,
    duration: data.duration || null,
  }
}