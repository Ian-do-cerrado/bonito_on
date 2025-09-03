import { createClient } from "@/lib/supabase/client"
import type { BlogPost } from "@/types/index"

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
