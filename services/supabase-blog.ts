import { createClient } from "@/lib/supabase/client"
import type { BlogPost } from "@/types/index"
export type { BlogPost } from "@/types/index"
import { v4 as uuidv4 } from "uuid"

const supabase = createClient()

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        blog_post_tags(tag),
        blog_post_seo_keywords(keyword),
        blog_post_gallery(image_url, image_order)
        `,
      )
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    return transformDatabaseBlogPosts(blogPosts || [])
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data: blogPost, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        blog_post_tags(tag),
        blog_post_seo_keywords(keyword),
        blog_post_gallery(image_url, image_order)
        `,
      )
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching blog post by slug:", error)
      return null
    }

    return transformDatabaseBlogPost(blogPost)
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error)
    return null
  }
}

function transformDatabaseBlogPosts(dbBlogPosts: any[]): BlogPost[] {
  return dbBlogPosts.map(transformDatabaseBlogPost)
}

function transformDatabaseBlogPost(dbBlogPost: any): BlogPost {
  return {
    id: dbBlogPost.id,
    title: dbBlogPost.title,
    excerpt: dbBlogPost.excerpt,
    content: dbBlogPost.content,
    image: dbBlogPost.image || "/placeholder.svg?height=400&width=600",
    author: dbBlogPost.author,
    publishedAt: dbBlogPost.published_at,
    tags: dbBlogPost.blog_post_tags?.map((t: any) => t.tag) || [],
    slug: dbBlogPost.slug,
    readTime: dbBlogPost.read_time,
    seoTitle: dbBlogPost.seo_title,
    seoDescription: dbBlogPost.seo_description,
    seoKeywords: dbBlogPost.blog_post_seo_keywords?.map((k: any) => k.keyword) || [],
    gallery: dbBlogPost.blog_post_gallery?.sort((a: any, b: any) => a.image_order - b.image_order).map((g: any) => g.image_url) || [],
  }
}

export async function insertBlogPost(post: BlogPost): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        published_at: post.publishedAt,
        slug: post.slug,
        read_time: post.readTime,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting blog post:", error)
      return null
    }

    if (post.tags && post.tags.length > 0) {
      const tagInserts = post.tags.map((tag) => ({ blog_post_id: data.id, tag }))
      const { error: tagsError } = await supabase.from("blog_post_tags").insert(tagInserts)
      if (tagsError) {
        console.error("Error inserting blog post tags:", tagsError)
      }
    }

    if (post.seoKeywords && post.seoKeywords.length > 0) {
      const keywordInserts = post.seoKeywords.map((keyword) => ({ blog_post_id: data.id, keyword }))
      const { error: keywordsError } = await supabase.from("blog_post_seo_keywords").insert(keywordInserts)
      if (keywordsError) {
        console.error("Error inserting blog post SEO keywords:", keywordsError)
      }
    }

    if (post.gallery && post.gallery.length > 0) {
      const galleryInserts = post.gallery.map((imageUrl, index) => ({
        blog_post_id: data.id,
        image_url: imageUrl,
        image_order: index,
      }))
      const { error: galleryError } = await supabase.from("blog_post_gallery").insert(galleryInserts)
      if (galleryError) {
        console.error("Error inserting blog post gallery images:", galleryError)
      }
    }

    return transformDatabaseBlogPost(data)
  } catch (error) {
    console.error("Error in insertBlogPost:", error)
    return null
  }
}
