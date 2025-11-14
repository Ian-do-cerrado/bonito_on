export interface DatabaseTour {
  id: string
  title: string
  description: string
  price: number
  price_ms?: number | null
  price_child?: number | null
  price_high_season?: number | null
  price_senior?: number | null
  image: string | null
  rating: number
  category: string
  slug: string | null
  created_at: string
  updated_at: string
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

export interface DatabaseTourSegundoSemestre {
  id: string
  title: string
  description: string
  price: number
  price_ms?: number | null
  price_child?: number | null
  price_high_season?: number | null
  price_senior?: number | null
  image: string | null
  rating: number
  category: string
  slug: string | null
  created_at: string
  updated_at: string
  visivel_no_tarifario_2o_semestre: boolean
}
