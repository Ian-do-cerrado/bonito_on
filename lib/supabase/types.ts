export interface DatabaseTour {
  id: string
  title: string
  description: string
  price: number // Baixa Temporada
  price_high_season: number | null
  price_child_ls: number | null
  price_child_hs: number | null
  price_senior_low_season: number | null
  price_senior_hs: number | null
  price_ms_low_season: number | null
  price_ms_hs: number | null
  min_child_age: number | null
  image: string | null
  gallery: string[] | null
  category: string
  rating: number
  slug: string | null
  created_at: string
  updated_at: string
  duration: string | null
}

export interface DatabaseTour2 {
  id: string
  title: string
  description: string
  price: number // Baixa Temporada
  hs_price: number | null
  chd_price_ls: number | null
  price_child_hs: number | null
  senior_price: number | null
  price_senior_hs: number | null
  ms_price: number | null
  price_ms_hs: number | null
  min_child_age: number | null
  image: string | null
  gallery: string[] | null
  category: string
  rating: number
  slug: string | null
  created_at: string
  updated_at: string
  duration: string | null
  is_visible: boolean
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

export interface Tour2Data {
  id: string
  title: string
  description: string
  price: number
  hs_price: number | null
  chd_price_ls: number | null
  price_chd_hs: number | null
  senior_price_ls: number | null
  price_senior_hs: number | null
  ms_price_ls: number | null
  price_ms_hs: number | null
  min_child_age: number | null
  image: string | null
  gallery: string[] | null
  category: "adventure" | "contemplation" | "cave" | "waterfall" | "rappelling" | "horseback" | "biking" | "scubaDiving" | "resort" | "floating" | "pantanal"
  rating: number
  slug: string | null
  created_at: string
  updated_at: string
  duration: string | null
  is_visible: boolean
}


