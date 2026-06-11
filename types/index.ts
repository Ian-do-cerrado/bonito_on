export interface Tour {
  id: string
  title: string
  description: string
  title_en?: string
  description_en?: string
  title_es?: string
  description_es?: string
  price: number
  duration: string
  difficulty: "easy" | "medium" | "hard"
  category: "adventure" | "contemplation" | "cultural" | "family" | "cave" | "waterfall" | "rappelling" | "horseback" | "biking" | "scubaDiving" | "resort" | "floating" | "pantanal"
  image: string
  gallery?: string[]
  highlights: string[]
  included: string[]
  notIncluded?: string[]
  requirements?: string[]
  bestSeason: string
  maxGroupSize: number
  location: string
  slug: string
  rating?: number
  reviewsCount?: number
  prices?: any
  preferred_price_atividade?: string
  preferred_price_tabela?: string
  preferred_baixa_tabela?: string
  preferred_ms_tabela?: string
  preferred_bonitense_tabela?: string
  /** Categorias de preço visíveis no site. undefined = todas. Ex: ['adulto','crianca','ms'] */
  visible_prices?: string[]
  btms_atrativo_override?: string
  /** Preço manual (override absoluto). Quando definido, ignora toda lógica BTMS/automática. */
  manual_price?: number | null
  /** Preço manual do 2o semestre (override absoluto S2). */
  manual_price_2o_semester?: number | null
  price_2o_semester?: number | null
  /** Overrides de metadados exibidos na tabela de preços (labels, validade, idades) */
  price_display_overrides?: {
    s1?: {
      validityEnd?: string
      labels?: Partial<Record<"adulto" | "crianca" | "senior" | "ms" | "bonitense", string>>
      ages?: {
        childMin?: number
        childMax?: number | null
        seniorMin?: number
      }
    }
    s2?: {
      validityEnd?: string
      labels?: Partial<Record<"adulto" | "crianca" | "senior" | "ms" | "bonitense", string>>
      ages?: {
        childMin?: number
        childMax?: number | null
        seniorMin?: number
      }
    }
  } | null
}


export interface Attraction {
  id: string
  title: string
  description: string
  title_en?: string
  description_en?: string
  title_es?: string
  description_es?: string
  category: "gastronomy" | "accommodation" | "transport" | "events"
  image: string
  location: string
  contact?: string
  website?: string
  rating?: number
  priceRange?: string
  features?: string[]
  slug: string
  highlights?: string[]
  duration?: string
  capacity?: string
  price?: string | number
  groupSize?: string
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
  slug?: string
  readTime: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  title_en?: string
  excerpt_en?: string
  content_en?: string
  title_es?: string
  excerpt_es?: string
  content_es?: string
  gallery?: string[]
}

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
  meals?: string[]
  accommodation?: string
}

export interface Package {
  id: string
  title: string
  subtitle: string
  description: string
  title_en?: string
  subtitle_en?: string
  description_en?: string
  title_es?: string
  subtitle_es?: string
  description_es?: string
  price: number
  originalPrice?: number
  duration: string
  category: "adventure" | "family" | "romantic" | "cultural" | "economico" | "premium" | "luxo"
  image: string
  gallery?: string[]
  highlights: string[]
  included: string[]
  itinerary: ItineraryDay[]
  bestSeason: string[] | string
  maxPeople?: number
  maxGroupSize?: number
  slug: string
  rating?: number
  reviewsCount?: number
  difficulty?: "easy" | "medium" | "hard" | string
}

export type Language = "pt" | "en" | "es"

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  tourInterest?: string
}
