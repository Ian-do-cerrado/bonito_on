import { createClient } from "@/lib/supabase/client"
import type { Tour } from "@/components/tours-section"
import type { Package } from "@/types/package"
import type { Attraction } from "@/components/attractions-section"
import type { BlogPost } from "@/types/blog-post" // Declare BlogPost variable

const supabase = createClient()

// TOURS CRUD
export async function createTour(tour: Omit<Tour, "id">): Promise<Tour | null> {
  try {
    const { data, error } = await supabase
      .from("tours")
      .insert({
        title: tour.title,
        description: tour.description,
        price: tour.price,
        image: tour.image,
        rating: tour.rating,
        category: tour.category,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating tour:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image,
      rating: data.rating,
      category: data.category,
    }
  } catch (error) {
    console.error("Error in createTour:", error)
    return null
  }
}

export async function updateTour(tour: Tour): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("tours")
      .update({
        title: tour.title,
        description: tour.description,
        price: tour.price,
        image: tour.image,
        rating: tour.rating,
        category: tour.category,
      })
      .eq("id", tour.id)

    if (error) {
      console.error("Error updating tour:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateTour:", error)
    return false
  }
}

export async function deleteTour(tourId: string): Promise<boolean> {
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
  try {
    // Insert main package
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .insert({
        title: pkg.title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        duration: pkg.duration,
        price: pkg.price,
        original_price: pkg.originalPrice,
        image: pkg.image,
        category: pkg.category,
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

    // Insert highlights
    if (pkg.highlights.length > 0) {
      const highlightsData = pkg.highlights.map((highlight) => ({
        package_id: packageId,
        highlight,
      }))
      await supabase.from("package_highlights").insert(highlightsData)
    }

    // Insert included items
    if (pkg.included.length > 0) {
      const includedData = pkg.included.map((item) => ({
        package_id: packageId,
        item,
      }))
      await supabase.from("package_included").insert(includedData)
    }

    // Insert best seasons
    if (pkg.bestSeason.length > 0) {
      const seasonsData = pkg.bestSeason.map((season) => ({
        package_id: packageId,
        season,
      }))
      await supabase.from("package_best_seasons").insert(seasonsData)
    }

    // Insert itinerary
    if (pkg.itinerary.length > 0) {
      for (const day of pkg.itinerary) {
        const { data: itineraryData } = await supabase
          .from("package_itinerary")
          .insert({
            package_id: packageId,
            day: day.day,
            title: day.title,
            accommodation: day.accommodation,
          })
          .select()
          .single()

        if (itineraryData && day.activities.length > 0) {
          const activitiesData = day.activities.map((activity) => ({
            itinerary_id: itineraryData.id,
            activity,
          }))
          await supabase.from("itinerary_activities").insert(activitiesData)
        }

        if (itineraryData && day.meals.length > 0) {
          const mealsData = day.meals.map((meal) => ({
            itinerary_id: itineraryData.id,
            meal,
          }))
          await supabase.from("itinerary_meals").insert(mealsData)
        }
      }
    }

    return {
      id: packageData.id,
      title: packageData.title,
      subtitle: packageData.subtitle,
      description: packageData.description,
      duration: packageData.duration,
      price: packageData.price,
      originalPrice: packageData.original_price,
      image: packageData.image,
      category: packageData.category,
      rating: packageData.rating,
      reviewsCount: packageData.reviews_count,
      maxPeople: packageData.max_people,
      difficulty: packageData.difficulty,
      highlights: pkg.highlights,
      included: pkg.included,
      bestSeason: pkg.bestSeason,
      itinerary: pkg.itinerary,
    }
  } catch (error) {
    console.error("Error in createPackage:", error)
    return null
  }
}

export async function updatePackage(pkg: Package): Promise<boolean> {
  try {
    // Update main package
    const { error: packageError } = await supabase
      .from("packages")
      .update({
        title: pkg.title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        duration: pkg.duration,
        price: pkg.price,
        original_price: pkg.originalPrice,
        image: pkg.image,
        category: pkg.category,
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

    // Delete existing related data
    await supabase.from("package_highlights").delete().eq("package_id", pkg.id)
    await supabase.from("package_included").delete().eq("package_id", pkg.id)
    await supabase.from("package_best_seasons").delete().eq("package_id", pkg.id)

    // Delete itinerary (cascade will handle activities and meals)
    await supabase.from("package_itinerary").delete().eq("package_id", pkg.id)

    // Re-insert updated data
    if (pkg.highlights.length > 0) {
      const highlightsData = pkg.highlights.map((highlight) => ({
        package_id: pkg.id,
        highlight,
      }))
      await supabase.from("package_highlights").insert(highlightsData)
    }

    if (pkg.included.length > 0) {
      const includedData = pkg.included.map((item) => ({
        package_id: pkg.id,
        item,
      }))
      await supabase.from("package_included").insert(includedData)
    }

    if (pkg.bestSeason.length > 0) {
      const seasonsData = pkg.bestSeason.map((season) => ({
        package_id: pkg.id,
        season,
      }))
      await supabase.from("package_best_seasons").insert(seasonsData)
    }

    // Re-insert itinerary
    if (pkg.itinerary.length > 0) {
      for (const day of pkg.itinerary) {
        const { data: itineraryData } = await supabase
          .from("package_itinerary")
          .insert({
            package_id: pkg.id,
            day: day.day,
            title: day.title,
            accommodation: day.accommodation,
          })
          .select()
          .single()

        if (itineraryData && day.activities.length > 0) {
          const activitiesData = day.activities.map((activity) => ({
            itinerary_id: itineraryData.id,
            activity,
          }))
          await supabase.from("itinerary_activities").insert(activitiesData)
        }

        if (itineraryData && day.meals.length > 0) {
          const mealsData = day.meals.map((meal) => ({
            itinerary_id: itineraryData.id,
            meal,
          }))
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
  try {
    const { data: attractionData, error: attractionError } = await supabase
      .from("attractions")
      .insert({
        title: attraction.title,
        description: attraction.description,
        image: attraction.image,
        category: attraction.category,
        location: attraction.location,
        duration: attraction.duration,
        capacity: attraction.capacity,
        price: attraction.price,
        rating: attraction.rating,
      })
      .select()
      .single()

    if (attractionError) {
      console.error("Error creating attraction:", attractionError)
      return null
    }

    // Insert highlights - verificar se highlights existe e não é undefined
    if (attraction.highlights && Array.isArray(attraction.highlights) && attraction.highlights.length > 0) {
      const highlightsData = attraction.highlights.map((highlight) => ({
        attraction_id: attractionData.id,
        highlight,
      }))
      await supabase.from("attraction_highlights").insert(highlightsData)
    }

    return {
      id: attractionData.id,
      title: attractionData.title,
      description: attractionData.description,
      image: attractionData.image,
      category: attractionData.category,
      location: attractionData.location,
      duration: attractionData.duration,
      capacity: attractionData.capacity,
      price: attractionData.price,
      rating: attractionData.rating,
      slug: attractionData.slug,
      highlights: attraction.highlights || [], // fallback para array vazio
    }
  } catch (error) {
    console.error("Error in createAttraction:", error)
    return null
  }
}

export async function updateAttraction(attraction: Attraction): Promise<boolean> {
  try {
    const { error: attractionError } = await supabase
      .from("attractions")
      .update({
        title: attraction.title,
        description: attraction.description,
        image: attraction.image,
        category: attraction.category,
        location: attraction.location,
        duration: attraction.duration,
        capacity: attraction.capacity,
        price: attraction.price,
        rating: attraction.rating,
      })
      .eq("id", attraction.id)

    if (attractionError) {
      console.error("Error updating attraction:", attractionError)
      return false
    }

    // Delete existing highlights
    await supabase.from("attraction_highlights").delete().eq("attraction_id", attraction.id)

    // Re-insert highlights - verificar se highlights existe e não é undefined
    if (attraction.highlights && Array.isArray(attraction.highlights) && attraction.highlights.length > 0) {
      const highlightsData = attraction.highlights.map((highlight) => ({
        attraction_id: attraction.id,
        highlight,
      }))
      await supabase.from("attraction_highlights").insert(highlightsData)
    }

    return true
  } catch (error) {
    console.error("Error in updateAttraction:", error)
    return false
  }
}

export async function deleteAttraction(attractionId: string): Promise<boolean> {
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
  try {
    // Insert main blog post
    const { data: blogData, error: blogError } = await supabase
      .from("blog_posts")
      .insert({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
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

    // Insert tags
    if (post.tags && post.tags.length > 0) {
      const tagsData = post.tags.map((tag) => ({
        post_id: postId,
        tag,
      }))
      await supabase.from("blog_post_tags").insert(tagsData)
    }

    // Insert SEO keywords
    if (post.seoKeywords && post.seoKeywords.length > 0) {
      const keywordsData = post.seoKeywords.map((keyword) => ({
        post_id: postId,
        keyword,
      }))
      await supabase.from("blog_post_seo_keywords").insert(keywordsData)
    }

    // Insert gallery images
    if (post.gallery && post.gallery.length > 0) {
      const galleryData = post.gallery.map((imageUrl, index) => ({
        post_id: postId,
        image_url: imageUrl,
        image_order: index,
      }))
      await supabase.from("blog_post_gallery").insert(galleryData)
    }

    return {
      id: blogData.id,
      title: blogData.title,
      excerpt: blogData.excerpt,
      content: blogData.content,
      image: blogData.image,
      author: blogData.author,
      publishedAt: blogData.published_at,
      readTime: blogData.read_time,
      tags: post.tags || [],
      seoTitle: blogData.seo_title,
      seoDescription: blogData.seo_description,
      seoKeywords: post.seoKeywords || [],
      gallery: post.gallery || [],
    }
  } catch (error) {
    console.error("Error in createBlogPost:", error)
    return null
  }
}

export async function updateBlogPost(post: BlogPost): Promise<boolean> {
  try {
    // Update main blog post
    const { error: blogError } = await supabase
      .from("blog_posts")
      .update({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
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

    // Delete existing related data
    await supabase.from("blog_post_tags").delete().eq("post_id", post.id)
    await supabase.from("blog_post_seo_keywords").delete().eq("post_id", post.id)
    await supabase.from("blog_post_gallery").delete().eq("post_id", post.id)

    // Re-insert tags
    if (post.tags && post.tags.length > 0) {
      const tagsData = post.tags.map((tag) => ({
        post_id: post.id,
        tag,
      }))
      await supabase.from("blog_post_tags").insert(tagsData)
    }

    // Re-insert SEO keywords
    if (post.seoKeywords && post.seoKeywords.length > 0) {
      const keywordsData = post.seoKeywords.map((keyword) => ({
        post_id: post.id,
        keyword,
      }))
      await supabase.from("blog_post_seo_keywords").insert(keywordsData)
    }

    // Re-insert gallery images
    if (post.gallery && post.gallery.length > 0) {
      const galleryData = post.gallery.map((imageUrl, index) => ({
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
