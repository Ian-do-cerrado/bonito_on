"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, User, Calendar, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import type { BlogPost } from "@/types/index"
import { getBlogPostBySlug } from "@/services/supabase-blog"
import he from "he"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const blogPost = await getBlogPostBySlug(slug)
        setPost(blogPost)
        if (blogPost) {
          console.log("Raw post content from Supabase:", blogPost.content)
        }
      } catch (error) {
        console.error("Error loading blog post:", error)
        const savedPosts = localStorage.getItem("blogPosts")
        if (savedPosts) {
          const posts: BlogPost[] = JSON.parse(savedPosts)
          const foundPost = posts.find((p) => createSlug(p.title) === slug)
          setPost(foundPost || null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadBlogPost()
    }
  }, [slug])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const nextGalleryImage = () => {
    if (post?.gallery?.length) {
      setCurrentGalleryIndex((prev) => (prev + 1) % post.gallery!.length)
    }
  }

  const prevGalleryImage = () => {
    if (post?.gallery?.length) {
      setCurrentGalleryIndex((prev) => (prev - 1 + post.gallery!.length) % post.gallery!.length)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="relative h-96 pt-16">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8">
          <Badge className="bg-green-600 text-white mb-4">{post.tags[0]}</Badge>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min de leitura</span>
              </div>

              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {post.gallery && post.gallery.length > 0 && (
            <div className="my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria de Imagens</h2>

              <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={post.gallery[currentGalleryIndex] || "/placeholder.svg"}
                  alt={`Galeria ${currentGalleryIndex + 1}`}
                  fill
                  className="object-cover"
                />

                {post.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevGalleryImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextGalleryImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentGalleryIndex + 1} / {post.gallery.length}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {post.gallery.map((imageUrl: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentGalleryIndex ? "border-green-600" : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <div className="text-xl text-gray-700 mb-8 font-medium" dangerouslySetInnerHTML={{ __html: he.decode(post.excerpt || "") }} />
            {/* console.log("Raw post content:", post.content) */}
            <div dangerouslySetInnerHTML={{ __html: he.decode(post.content || "Conteúdo indisponível.") }} />


            </div>
        </article>
      </div>
    </div>
  )
}
