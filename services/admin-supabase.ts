"use server"

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { BlogPost, Tour, Package, Attraction } from "@/types"

export type AdminSaveResult = {
  success: boolean
  error?: string
  /** Campos de 2º semestre não foram gravados — migração pendente no Supabase */
  governanceSkipped?: boolean
}

function formatDbError(error: PostgrestError): string {
  return error.message || error.code || "Erro desconhecido no banco"
}

function isMissingColumnError(error: PostgrestError): boolean {
  return (
    error.code === "PGRST204" ||
    /Could not find the '([^']+)' column/.test(error.message ?? "")
  )
}

function buildTourCoreRow(tour: Tour | Omit<Tour, "id">) {
  return {
    title: tour.title,
    description: tour.description,
    title_en: tour.title_en,
    description_en: tour.description_en,
    title_es: tour.title_es,
    description_es: tour.description_es,
    price: tour.price,
    duration: tour.duration,
    difficulty: tour.difficulty,
    category: tour.category,
    image: tour.image,
    gallery: tour.gallery,
    highlights: tour.highlights,
    included: tour.included,
    not_included: tour.notIncluded,
    requirements: tour.requirements,
    best_season: tour.bestSeason,
    max_group_size: tour.maxGroupSize,
    location: tour.location,
    slug: tour.slug,
    rating: tour.rating,
    reviews_count: tour.reviewsCount,
    preferred_price_atividade: tour.preferred_price_atividade,
    preferred_price_tabela: tour.preferred_price_tabela,
    preferred_baixa_tabela: tour.preferred_baixa_tabela ?? null,
    preferred_ms_tabela: tour.preferred_ms_tabela ?? null,
    preferred_bonitense_tabela: tour.preferred_bonitense_tabela ?? null,
    visible_prices: tour.visible_prices ?? null,
    btms_atrativo_override: tour.btms_atrativo_override ?? null,
    manual_price: tour.manual_price ?? null,
    price_2o_semester: tour.price_2o_semester ?? null,
  }
}

function buildTourGovernanceRow(tour: Tour | Omit<Tour, "id">) {
  return {
    manual_price_2o_semester: tour.manual_price_2o_semester ?? null,
    price_display_overrides: tour.price_display_overrides ?? null,
  }
}

async function applyTourGovernanceFields(
  supabase: SupabaseClient,
  tourId: string,
  tour: Tour | Omit<Tour, "id">
): Promise<Pick<AdminSaveResult, "governanceSkipped">> {
  const { error } = await supabase
    .from("tours")
    .update(buildTourGovernanceRow(tour))
    .eq("id", tourId)

  if (!error) return {}

  if (isMissingColumnError(error)) {
    console.warn(
      "Colunas de governança de semestre ausentes em tours. Execute migrations/add_semester_pricing_governance.sql no Supabase.",
      error.message
    )
    return { governanceSkipped: true }
  }

  throw error
}

// TOURS CRUD
export async function createTour(tour: Omit<Tour, "id">): Promise<Tour | null> {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("tours")
      .insert(buildTourCoreRow(tour))
      .select()
      .single()

    if (error) {
      console.error("Error creating tour:", error)
      return null
    }

    try {
      await applyTourGovernanceFields(supabase, data.id, tour)
    } catch (govError) {
      console.error("Error applying tour governance fields:", govError)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createTour:", error)
    return null
  }
}

export async function updateTour(tour: Tour): Promise<AdminSaveResult> {
  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("tours")
      .update(buildTourCoreRow(tour))
      .eq("id", tour.id)

    if (error) {
      console.error("Error updating tour:", error)
      return { success: false, error: formatDbError(error) }
    }

    try {
      const { governanceSkipped } = await applyTourGovernanceFields(supabase, tour.id, tour)
      return { success: true, governanceSkipped }
    } catch (govError) {
      const err = govError as PostgrestError
      console.error("Error updating tour governance fields:", govError)
      return { success: false, error: formatDbError(err) }
    }
  } catch (error) {
    console.error("Error in updateTour:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar passeio",
    }
  }
}

export async function deleteTour(tourId: string): Promise<boolean> {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from("tours").delete().eq("id", tourId)

    if (error) {
      console.error("Error deleting tour:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteTour:", error)
    return false
  }
}

// PACKAGES CRUD
export async function createPackage(pkg: Omit<Package, "id">): Promise<Package | null> {
  const supabase = await createClient()
  try {
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .insert({
        title: pkg.title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        title_en: pkg.title_en,
        subtitle_en: pkg.subtitle_en,
        description_en: pkg.description_en,
        title_es: pkg.title_es,
        subtitle_es: pkg.subtitle_es,
        description_es: pkg.description_es,
        price: pkg.price,
        original_price: pkg.originalPrice,
        duration: pkg.duration,
        category: pkg.category,
        image: pkg.image,
        slug: pkg.slug,
        rating: pkg.rating,
        reviews_count: pkg.reviewsCount,
        max_people: pkg.maxPeople,
        difficulty: pkg.difficulty,
      })
      .select()
      .single()

    if (packageError) {
      console.error("Error creating package:", packageError)
      return null
    }

    const packageId = packageData.id

    // Insert relations
    if (pkg.highlights && pkg.highlights.length > 0) {
      const highlightsData = pkg.highlights.map((h) => ({ package_id: packageId, highlight: h }))
      await supabase.from("package_highlights").insert(highlightsData)
    }

    if (pkg.included && pkg.included.length > 0) {
      const includedData = pkg.included.map((i) => ({ package_id: packageId, item: i }))
      await supabase.from("package_included").insert(includedData)
    }

    if (pkg.bestSeason) {
      const seasons = Array.isArray(pkg.bestSeason) ? pkg.bestSeason : [pkg.bestSeason]
      const seasonsData = seasons.map((s) => ({ package_id: packageId, season: s }))
      await supabase.from("package_best_seasons").insert(seasonsData)
    }

    if (pkg.itinerary && pkg.itinerary.length > 0) {
      for (const day of pkg.itinerary) {
        const { data: dayData, error: dayError } = await supabase
          .from("package_itinerary")
          .insert({
            package_id: packageId,
            day: day.day,
            title: day.title,
            accommodation: day.accommodation,
          })
          .select()
          .single()

        if (dayError) continue

        if (day.activities && day.activities.length > 0) {
          const activitiesData = day.activities.map((a) => ({ itinerary_id: dayData.id, activity: a }))
          await supabase.from("itinerary_activities").insert(activitiesData)
        }

        if (day.meals && day.meals.length > 0) {
          const mealsData = day.meals.map((m) => ({ itinerary_id: dayData.id, meal: m }))
          await supabase.from("itinerary_meals").insert(mealsData)
        }
      }
    }

    return {
      ...pkg,
      id: packageId,
      originalPrice: pkg.originalPrice,
      maxPeople: pkg.maxPeople,
      reviewsCount: pkg.reviewsCount,
    } as Package
  } catch (error) {
    console.error("Error in createPackage:", error)
    return null
  }
}

export async function updatePackage(pkg: Package): Promise<boolean> {
  const supabase = await createClient()
  try {
    // Update main package
    const { error: packageError } = await supabase
      .from("packages")
      .update({
        title: pkg.title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        title_en: pkg.title_en,
        subtitle_en: pkg.subtitle_en,
        description_en: pkg.description_en,
        title_es: pkg.title_es,
        subtitle_es: pkg.subtitle_es,
        description_es: pkg.description_es,
        price: pkg.price,
        original_price: pkg.originalPrice,
        duration: pkg.duration,
        category: pkg.category,
        image: pkg.image,
        slug: pkg.slug,
        rating: pkg.rating,
        reviews_count: pkg.reviewsCount,
        max_people: pkg.maxPeople,
        difficulty: pkg.difficulty,
      })
      .eq("id", pkg.id)

    if (packageError) {
      console.error("Error updating package:", packageError)
      return false
    }

    // Delete existing relations
    await Promise.all([
      supabase.from("package_highlights").delete().eq("package_id", pkg.id),
      supabase.from("package_included").delete().eq("package_id", pkg.id),
      supabase.from("package_best_seasons").delete().eq("package_id", pkg.id),
      supabase.from("package_itinerary").delete().eq("package_id", pkg.id),
    ])

    // Re-insert relations
    if (pkg.highlights && pkg.highlights.length > 0) {
      const highlightsData = pkg.highlights.map((h) => ({ package_id: pkg.id, highlight: h }))
      await supabase.from("package_highlights").insert(highlightsData)
    }

    if (pkg.included && pkg.included.length > 0) {
      const includedData = pkg.included.map((i) => ({ package_id: pkg.id, item: i }))
      await supabase.from("package_included").insert(includedData)
    }

    if (pkg.bestSeason) {
      const seasons = Array.isArray(pkg.bestSeason) ? pkg.bestSeason : [pkg.bestSeason]
      const seasonsData = seasons.map((s) => ({ package_id: pkg.id, season: s }))
      await supabase.from("package_best_seasons").insert(seasonsData)
    }

    if (pkg.itinerary && pkg.itinerary.length > 0) {
      for (const day of pkg.itinerary) {
        const { data: dayData, error: dayError } = await supabase
          .from("package_itinerary")
          .insert({
            package_id: pkg.id,
            day: day.day,
            title: day.title,
            accommodation: day.accommodation,
          })
          .select()
          .single()

        if (dayError) continue

        if (day.activities && day.activities.length > 0) {
          const activitiesData = day.activities.map((a) => ({ itinerary_id: dayData.id, activity: a }))
          await supabase.from("itinerary_activities").insert(activitiesData)
        }

        if (day.meals && day.meals.length > 0) {
          const mealsData = day.meals.map((m) => ({ itinerary_id: dayData.id, meal: m }))
          await supabase.from("itinerary_meals").insert(mealsData)
        }
      }
    }

    return true
  } catch (error) {
    console.error("Error in updatePackage:", error)
    return false
  }
}

export async function deletePackage(packageId: string): Promise<boolean> {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from("packages").delete().eq("id", packageId)

    if (error) {
      console.error("Error deleting package:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deletePackage:", error)
    return false
  }
}

// ATTRACTIONS CRUD
export async function createAttraction(attraction: Omit<Attraction, "id">): Promise<Attraction | null> {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("attractions")
      .insert({
        title: attraction.title,
        description: attraction.description,
        title_en: attraction.title_en,
        description_en: attraction.description_en,
        title_es: attraction.title_es,
        description_es: attraction.description_es,
        category: attraction.category,
        image: attraction.image,
        location: attraction.location,
        contact: attraction.contact,
        website: attraction.website,
        rating: attraction.rating,
        price_range: attraction.priceRange,
        features: attraction.features,
        slug: attraction.slug,
        highlights: attraction.highlights,
        duration: attraction.duration,
        capacity: attraction.capacity,
        price: attraction.price,
        group_size: attraction.groupSize,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating attraction:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createAttraction:", error)
    return null
  }
}

export async function updateAttraction(attraction: Attraction): Promise<boolean> {
  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("attractions")
      .update({
        title: attraction.title,
        description: attraction.description,
        title_en: attraction.title_en,
        description_en: attraction.description_en,
        title_es: attraction.title_es,
        description_es: attraction.description_es,
        category: attraction.category,
        image: attraction.image,
        location: attraction.location,
        contact: attraction.contact,
        website: attraction.website,
        rating: attraction.rating,
        price_range: attraction.priceRange,
        features: attraction.features,
        slug: attraction.slug,
        highlights: attraction.highlights,
        duration: attraction.duration,
        capacity: attraction.capacity,
        price: attraction.price,
        group_size: attraction.groupSize,
      })
      .eq("id", attraction.id)

    if (error) {
      console.error("Error updating attraction:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateAttraction:", error)
    return false
  }
}

export async function deleteAttraction(attractionId: string): Promise<boolean> {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from("attractions").delete().eq("id", attractionId)

    if (error) {
      console.error("Error deleting attraction:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteAttraction:", error)
    return false
  }
}

// BLOG POSTS CRUD
export async function createBlogPost(post: Omit<BlogPost, "id">): Promise<BlogPost | null> {
  const supabase = await createClient()
  try {
    const { data: blogData, error: blogError } = await supabase
      .from("blog_posts")
      .insert({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        title_en: post.title_en,
        excerpt_en: post.excerpt_en,
        content_en: post.content_en,
        title_es: post.title_es,
        excerpt_es: post.excerpt_es,
        content_es: post.content_es,
        image: post.image,
        author: post.author,
        published_at: post.publishedAt,
        read_time: post.readTime,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
      })
      .select()
      .single()

    if (blogError) {
      console.error("Error creating blog post:", blogError)
      return null
    }

    const postId = blogData.id

    if (post.tags && post.tags.length > 0) {
      const tagsData = post.tags.map((tag: string) => ({ post_id: postId, tag }))
      await supabase.from("blog_post_tags").insert(tagsData)
    }

    if (post.seoKeywords && post.seoKeywords.length > 0) {
      const keywordsData = post.seoKeywords.map((keyword: string) => ({ post_id: postId, keyword }))
      await supabase.from("blog_post_seo_keywords").insert(keywordsData)
    }

    if (post.gallery && post.gallery.length > 0) {
      const galleryData = post.gallery.map((imageUrl: string, index: number) => ({
        post_id: postId,
        image_url: imageUrl,
        image_order: index,
      }))
      await supabase.from("blog_post_gallery").insert(galleryData)
    }

    return {
      ...blogData,
      id: blogData.id,
      publishedAt: blogData.published_at,
      readTime: blogData.read_time,
      seoTitle: blogData.seo_title,
      seoDescription: blogData.seo_description,
      tags: post.tags || [],
      seoKeywords: post.seoKeywords || [],
      gallery: post.gallery || [],
    }
  } catch (error) {
    console.error("Error in createBlogPost:", error)
    return null
  }
}

export async function updateBlogPost(post: BlogPost): Promise<boolean> {
  const supabase = await createClient()
  try {
    const { error: blogError } = await supabase
      .from("blog_posts")
      .update({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        title_en: post.title_en,
        excerpt_en: post.excerpt_en,
        content_en: post.content_en,
        title_es: post.title_es,
        excerpt_es: post.excerpt_es,
        content_es: post.content_es,
        image: post.image,
        author: post.author,
        published_at: post.publishedAt,
        read_time: post.readTime,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
      })
      .eq("id", post.id)

    if (blogError) {
      console.error("Error updating blog post:", blogError)
      return false
    }

    await Promise.all([
      supabase.from("blog_post_tags").delete().eq("post_id", post.id),
      supabase.from("blog_post_seo_keywords").delete().eq("post_id", post.id),
      supabase.from("blog_post_gallery").delete().eq("post_id", post.id),
    ])

    if (post.tags && post.tags.length > 0) {
      const tagsData = post.tags.map((tag: string) => ({ post_id: post.id, tag }))
      await supabase.from("blog_post_tags").insert(tagsData)
    }

    if (post.seoKeywords && post.seoKeywords.length > 0) {
      const keywordsData = post.seoKeywords.map((keyword: string) => ({ post_id: post.id, keyword }))
      await supabase.from("blog_post_seo_keywords").insert(keywordsData)
    }

    if (post.gallery && post.gallery.length > 0) {
      const galleryData = post.gallery.map((imageUrl: string, index: number) => ({
        post_id: post.id,
        image_url: imageUrl,
        image_order: index,
      }))
      await supabase.from("blog_post_gallery").insert(galleryData)
    }

    return true
  } catch (error) {
    console.error("Error in updateBlogPost:", error)
    return false
  }
}

export async function deleteBlogPost(postId: string): Promise<boolean> {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", postId)
    if (error) {
      console.error("Error deleting blog post:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error in deleteBlogPost:", error)
    return false
  }
}
