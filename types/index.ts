export interface Tour {
  id: string
  chd_price?: number;
  hs_price?: number;
  title: string
  description: string
  price: number
  duration: string
  difficulty: "easy" | "medium" | "hard"
  category: "adventure" | "contemplation" | "cultural" | "family"
  image: string
  gallery?: string[] // Array de URLs de imagens para a galeria
  highlights: string[]
  included: string[]
  notIncluded: string[]
  requirements: string[]
  bestSeason: string
  maxGroupSize: number
  location: string
  slug: string
}

export interface Attraction {
  id: string
  title: string
  description: string
  category: "gastronomy" | "accommodation" | "transport" | "events"
  image: string
  location: string
  contact?: string
  website?: string
  rating?: number
  priceRange?: string
  features: string[]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  tags: string[]
  slug: string
  readTime: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  gallery?: string[]
}

export interface Package {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  duration: string
  category: "adventure" | "family" | "romantic" | "cultural"
  image: string
  gallery?: string[] // Array de URLs de imagens para a galeria
  highlights: string[]
  included: string[]
  itinerary: Array<{
    day: number
    title: string
    activities: string[]
  }>
  bestSeason: string
  maxGroupSize: number
  slug: string
}

export type Language = "pt" | "en" | "es"

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  tourInterest?: string
}
