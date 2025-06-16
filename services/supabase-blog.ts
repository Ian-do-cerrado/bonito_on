import { createClient } from "@/lib/supabase/client"
import type { BlogPost } from "@/components/blog-section"

const supabase = createClient()

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    // Buscar posts principais
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false })

    if (postsError) {
      console.error("Error fetching blog posts:", postsError)
      return []
    }

    if (!posts || posts.length === 0) {
      return []
    }

    // Buscar dados relacionados para todos os posts
    const postIds = posts.map((post) => post.id)

    const [tagsResult, keywordsResult, galleryResult] = await Promise.all([
      supabase.from("blog_post_tags").select("post_id, tag").in("post_id", postIds),
      supabase.from("blog_post_seo_keywords").select("post_id, keyword").in("post_id", postIds),
      supabase
        .from("blog_post_gallery")
        .select("post_id, image_url, image_order")
        .in("post_id", postIds)
        .order("image_order", { ascending: true }),
    ])

    // Organizar dados relacionados por post_id
    const tagsByPost = new Map<string, string[]>()
    const keywordsByPost = new Map<string, string[]>()
    const galleryByPost = new Map<string, string[]>()

    tagsResult.data?.forEach((tag) => {
      if (!tagsByPost.has(tag.post_id)) {
        tagsByPost.set(tag.post_id, [])
      }
      tagsByPost.get(tag.post_id)?.push(tag.tag)
    })

    keywordsResult.data?.forEach((keyword) => {
      if (!keywordsByPost.has(keyword.post_id)) {
        keywordsByPost.set(keyword.post_id, [])
      }
      keywordsByPost.get(keyword.post_id)?.push(keyword.keyword)
    })

    galleryResult.data?.forEach((image) => {
      if (!galleryByPost.has(image.post_id)) {
        galleryByPost.set(image.post_id, [])
      }
      galleryByPost.get(image.post_id)?.push(image.image_url)
    })

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image || "/placeholder.svg?height=300&width=400",
      author: post.author,
      publishedAt: post.published_at,
      readTime: post.read_time,
      tags: tagsByPost.get(post.id) || [],
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      seoKeywords: keywordsByPost.get(post.id) || [],
      gallery: galleryByPost.get(post.id) || [],
    }))
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Buscar post principal
    const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    if (postError || !post) {
      console.error("Error fetching blog post:", postError)
      return null
    }

    // Buscar dados relacionados
    const [tagsResult, keywordsResult, galleryResult] = await Promise.all([
      supabase.from("blog_post_tags").select("tag").eq("post_id", post.id),
      supabase.from("blog_post_seo_keywords").select("keyword").eq("post_id", post.id),
      supabase
        .from("blog_post_gallery")
        .select("image_url")
        .eq("post_id", post.id)
        .order("image_order", { ascending: true }),
    ])

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image || "/placeholder.svg?height=300&width=400",
      author: post.author,
      publishedAt: post.published_at,
      readTime: post.read_time,
      tags: tagsResult.data?.map((tag) => tag.tag) || [],
      seoTitle: post.seo_title,
      seoDescription: post.seo_description,
      seoKeywords: keywordsResult.data?.map((keyword) => keyword.keyword) || [],
      gallery: galleryResult.data?.map((image) => image.image_url) || [],
    }
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error)
    return null
  }
}

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
      const { error: tagsError } = await supabase.from("blog_post_tags").insert(tagsData)

      if (tagsError) {
        console.error("Error inserting tags:", tagsError)
      }
    }

    // Insert SEO keywords
    if (post.seoKeywords && post.seoKeywords.length > 0) {
      const keywordsData = post.seoKeywords.map((keyword) => ({
        post_id: postId,
        keyword,
      }))
      const { error: keywordsError } = await supabase.from("blog_post_seo_keywords").insert(keywordsData)

      if (keywordsError) {
        console.error("Error inserting keywords:", keywordsError)
      }
    }

    // Insert gallery images
    if (post.gallery && post.gallery.length > 0) {
      const galleryData = post.gallery.map((imageUrl, index) => ({
        post_id: postId,
        image_url: imageUrl,
        image_order: index,
      }))
      const { error: galleryError } = await supabase.from("blog_post_gallery").insert(galleryData)

      if (galleryError) {
        console.error("Error inserting gallery:", galleryError)
      }
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
    await Promise.all([
      supabase.from("blog_post_tags").delete().eq("post_id", post.id),
      supabase.from("blog_post_seo_keywords").delete().eq("post_id", post.id),
      supabase.from("blog_post_gallery").delete().eq("post_id", post.id),
    ])

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
