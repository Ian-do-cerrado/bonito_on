export interface Package {
  id: string
  title: string
  subtitle: string
  description: string
  duration: string
  price: number
  originalPrice?: number
  image: string
  highlights: string[]
  included: string[]
  itinerary: ItineraryDay[]
  category: "economico" | "premium" | "luxo"
  rating: number
  reviewsCount: number
  maxPeople: number
  difficulty: "facil" | "moderado" | "dificil"
  bestSeason: string[]
  slug: string
}

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
  meals: string[]
  accommodation?: string
}
