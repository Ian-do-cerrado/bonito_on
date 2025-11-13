import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getAllBlogPosts, getBlogPostBySlug, BlogPost } from "@/services/supabase-blog"
import BlogPostClientPage from "./index" // Renamed to avoid conflict

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const blogPosts = await getAllBlogPosts()

  return blogPosts.map((post: BlogPost) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post não encontrado - Bonito Ecoturismo",
      description: "O post solicitado não foi encontrado.",
    }
  }

  return {
    title: `${post.title} - Bonito Ecoturismo`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: `${post.title} - Bonito Ecoturismo`,
      description: post.seoDescription || post.excerpt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

export default async function BlogPostServerPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return <BlogPostClientPage initialPost={post} />
}
