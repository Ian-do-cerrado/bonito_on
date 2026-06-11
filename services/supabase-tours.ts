/**
 * Serviço de tours. tour.prices é obtido via findPricesForTour (supabase-prices)
 * a partir da view atrativo_atividade_precos. tour.price é fallback quando não houver match.
 */
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { resolveImageUrl } from "@/lib/image-url"
import { createSlug } from "@/lib/utils"
import type { TourPriceInfo } from "@/lib/supabase/price-columns"
import { getPricesForTours, getPricesByTourSlug } from "@/services/supabase-prices"

const defaultClient = createClient()

/** Tours ocultos (não exibidos - descontinuados) */
const HIDDEN_TOUR_SLUGS = [
  "cavalgada-estancia-mimosa",
  "observacao-de-aves-balneario-no-estrela-do-formoso",
  "bonito-passeio-de-bote-no-ilha-bonita",
  "mergulho-com-cilindro-discovery-porto-da-ilha",
  "cavalgada-parque-ecologico-rio-formoso",
  "balneario-cachoeiras-serra-da-bodoquena-com-almoco",
  "lobo-guara-bike-adventure-bike-tour-no-rio-da-prata"
]

import { Tour } from "@/types/index"
export type { Tour }

export async function getAllTours(supabase: SupabaseClient = defaultClient, preferNextSemester?: boolean): Promise<Tour[]> {
  try {
    const { data: tours, error } = await supabase.from("tours").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tours:", error)
      return getFallbackTours()
    }

    const transformed = transformDatabaseTours(tours || [])
    const visible = transformed.filter(
      (t) => !HIDDEN_TOUR_SLUGS.includes(t.slug ?? createSlug(t.title))
    )
    const priceMap = await getPricesForTours(
      visible.map((t) => ({
        slug: t.slug ?? createSlug(t.title),
        title: t.title,
        btmsAtativoOverride: t.btms_atrativo_override,
        preferredAtividade: t.preferred_price_atividade,
        preferredTabela: t.preferred_price_tabela,
        preferredBaixaTabela: t.preferred_baixa_tabela,
        preferredMsTabela: t.preferred_ms_tabela,
        preferredBonitenseTabela: t.preferred_bonitense_tabela,
        visiblePrices: t.visible_prices,
      })),
      supabase,
      undefined,
      preferNextSemester
    )

    return visible.map((t) => {
      const slug = t.slug ?? createSlug(t.title)
      const prices = priceMap.get(slug)
      return { ...t, prices: prices ?? undefined }
    })
  } catch (error) {
    console.error("Error in getAllTours:", error)
    return getFallbackTours()
  }
}

// Modificar a função getTourBySlug para buscar por slug gerado se necessário
export async function getTourBySlug(slug: string, supabase: SupabaseClient = defaultClient, preferNextSemester?: boolean): Promise<Tour | null> {
  if (HIDDEN_TOUR_SLUGS.includes(slug)) return null

  try {
    // Primeiro tenta buscar pelo slug exato
    let { data: tour, error } = await supabase.from("tours").select("*").eq("slug", slug).single()

    // Se não encontrar, tenta buscar todos os tours e comparar os slugs gerados
    if (error || !tour) {
      const { data: allTours } = await supabase.from("tours").select("*")
      if (allTours) {
        // Encontra o tour cujo título gera o slug correspondente
        tour = allTours.find((t) => createSlug(t.title) === slug)
      }
    }

    if (!tour) {
      console.error("Tour not found with slug:", slug)
      return null
    }

    const transformed = transformDatabaseTour(tour)
    const prices = await getPricesByTourSlug(
      slug, transformed.title, supabase,
      undefined,
      transformed.btms_atrativo_override,
      transformed.preferred_price_atividade,
      transformed.preferred_price_tabela,
      transformed.preferred_baixa_tabela,
      transformed.preferred_ms_tabela,
      transformed.preferred_bonitense_tabela,
      preferNextSemester,
      transformed.visible_prices
    )
    return { ...transformed, prices: prices ?? undefined }
  } catch (error) {
    console.error("Error in getTourBySlug:", error)
    return null
  }
}

function transformDatabaseTours(dbTours: any[]): Tour[] {
  return dbTours.map(transformDatabaseTour)
}

// Modificar a função transformDatabaseTour para incluir gallery
function transformDatabaseTour(dbTour: any): Tour {
  return {
    id: dbTour.id,
    title: dbTour.title,
    description: dbTour.description,
    title_en: dbTour.title_en || "",
    description_en: dbTour.description_en || "",
    title_es: dbTour.title_es || "",
    description_es: dbTour.description_es || "",
    price: dbTour.price,
    image: resolveImageUrl(dbTour.image),
    gallery: (dbTour.gallery || []).map((g: string) => resolveImageUrl(g)),
    rating: dbTour.rating,
    category: dbTour.category as Tour["category"],
    slug: dbTour.slug || createSlug(dbTour.title),
    duration: dbTour.duration || "",
    difficulty: dbTour.difficulty || "medium",
    highlights: dbTour.highlights || [],
    included: dbTour.included || [],
    notIncluded: dbTour.not_included || [],
    requirements: dbTour.requirements || [],
    reviewsCount: dbTour.reviews_count ?? undefined,
    location: dbTour.location || "",
    bestSeason: dbTour.best_season || "",
    maxGroupSize: dbTour.max_group_size || 0,
    preferred_price_atividade: dbTour.preferred_price_atividade,
    preferred_price_tabela: dbTour.preferred_price_tabela,
    preferred_baixa_tabela: dbTour.preferred_baixa_tabela ?? undefined,
    preferred_ms_tabela: dbTour.preferred_ms_tabela ?? undefined,
    preferred_bonitense_tabela: dbTour.preferred_bonitense_tabela ?? undefined,
    visible_prices: dbTour.visible_prices ?? undefined,
    btms_atrativo_override: dbTour.btms_atrativo_override ?? undefined,
    manual_price: dbTour.manual_price ?? undefined,
    manual_price_2o_semester: dbTour.manual_price_2o_semester ?? undefined,
    price_2o_semester: dbTour.price_2o_semester ?? undefined,
    price_display_overrides: dbTour.price_display_overrides ?? undefined,
  }
}

function getFallbackTours(): Tour[] {
  return [
    {
      id: "1",
      title: "Gruta do Lago Azul",
      description: "Explore a famosa gruta com lago de águas cristalinas azuis",
      price: 85,
      image: "/images/placeholder.svg",
      gallery: [
        "/images/placeholder.svg",
        "/images/placeholder.svg",
        "/images/placeholder.svg",
      ],
      rating: 4.8,
      category: "contemplation",
      slug: "gruta-do-lago-azul",
      duration: "2h",
      difficulty: "medium",
      highlights: ["Gruta", "Lago"],
      included: ["Guia"],
      location: "Bonito",
      bestSeason: "Ano todo",
      maxGroupSize: 15,
    },
    {
      id: "2",
      title: "Aquário Natural",
      description: "Mergulho com snorkel em águas cristalinas com peixes coloridos",
      price: 120,
      image: "/images/placeholder.svg",
      gallery: [
        "/images/placeholder.svg",
        "/images/placeholder.svg",
        "/images/placeholder.svg",
      ],
      rating: 4.9,
      category: "floating",
      slug: "aquario-natural",
      duration: "3h",
      difficulty: "easy",
      highlights: ["Snorkel", "Peixes"],
      included: ["Equipamento"],
      location: "Bonito",
      bestSeason: "Ano todo",
      maxGroupSize: 12,
    },
    // Outros tours com o mesmo padrão...
  ]
}

// Export as default object for backward compatibility
export const tourService = {
  getAllTours,
  getTourBySlug,
}
