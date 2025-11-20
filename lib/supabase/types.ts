export interface DatabaseTour {
  id: string
  title: string
  description: string
  price: number
  price_ms_low_season?: number | null
  price_ms_high_season?: number | null
  price_child?: number | null
  price_high_season?: number | null
  price_senior?: number | null
  price_ms?: number | null // Added from SegundoSemestre
  price_child_high_season?: number | null // Added from SegundoSemestre
  price_child_low_season?: number | null // Added from SegundoSemestre
  price_senior_high_season?: number | null // Added from SegundoSemestre
  price_senior_low_season?: number | null // Added from SegundoSemestre
  min_child_age?: number | null // Added from SegundoSemestre
  image: string | null
  gallery?: string[] | null // Added from SegundoSemestre
  rating: number
  category: string
  slug: string | null
  created_at: string
  updated_at: string
  duration?: string | null
}

export interface DatabaseTour2 {
  id: string
  title: string | null
  description: string | null
  price: number | null // Corresponds to 'price' in the UI
  chd_price: number | null // Corresponds to 'price_child' in the UI
  hs_price: number | null // Corresponds to 'price_high_season' in the UI
  senior_price: number | null // Corresponds to 'price_senior' in the UI
  ms_price: number | null // Corresponds to 'price_ms' in the UI
  min_child_age: number | null
  image: string | null
  gallery: string[] | null
  rating: number | null
  category: string | null
  slug: string | null
  created_at: string
  updated_at: string
  duration: string | null
}

export interface DatabasePackage {
  id: string
  title: string
  subtitle: string | null
  description: string
  duration: string
  price: number
  original_price: number | null
  image: string | null
  category: string
  rating: number
  reviews_count: number
  max_people: number
  difficulty: string
  slug: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseAttraction {
  id: string
  title: string
  description: string
  image: string | null
  category: string
  location: string
  duration: string | null
  capacity: string | null
  price: string | null
  rating: number
  slug: string | null
  created_at: string
  updated_at: string
}

export interface PackageHighlight {
  id: string
  package_id: string
  highlight: string
}

export interface PackageIncluded {
  id: string
  package_id: string
  item: string
}

export interface PackageBestSeason {
  id: string
  package_id: string
  season: string
}

export interface PackageItinerary {
  id: string
  package_id: string
  day: number
  title: string
  accommodation: string | null
}

export interface ItineraryActivity {
  id: string
  itinerary_id: string
  activity: string
}

export interface ItineraryMeal {
  id: string
  itinerary_id: string
  meal: string
}

export interface AttractionHighlight {
  id: string
  attraction_id: string
  highlight: string
}

export interface Tour2Data { // Interface for the transformed tour data from 'tours_2' table, matching UI component needs
  id: string
  title: string
  description: string
  price: number // Corresponds to price in UI (Baixa Temporada - Adulto)
  chd_price?: number | null // Corresponds to price_child in UI (Criança - qualquer temporada)
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


