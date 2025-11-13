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

interface BlogPostPageProps {
  initialPost: BlogPost | null;
}

export default function BlogPostPage({ initialPost }: BlogPostPageProps) {
  const params = useParams()
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string | undefined)

  const [post, setPost] = useState<BlogPost | null>(initialPost)
  const [isLoading, setIsLoading] = useState(false) // No longer loading on client if initialPost is provided
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  const createSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

  useEffect(() => {
    // If initialPost is not provided, or if the slug changes, fetch the post on the client
    if (!initialPost || (slug && initialPost.slug !== slug)) {
      setIsLoading(true);
      const loadBlogPost = async () => {
        try {
          if (!slug) return
          const blogPost = await getBlogPostBySlug(slug)
          setPost(blogPost)
          if (blogPost) {
            console.log("Raw post content from Supabase:", blogPost.content)
          }
        } catch (error) {
          console.error("Error loading blog post:", error)
          // Fallback localStorage (client-only)
          try {
            const saved = localStorage.getItem("blogPosts")
            if (saved) {
              const posts: BlogPost[] = JSON.parse(saved)
              const found = posts.find((p) => createSlug(p.title) === slug)
              setPost(found || null)
            }
          } catch (e) {
            console.error("Error reading localStorage:", e)
          }
        } finally {
          setIsLoading(false)
        }
      }

      if (slug) loadBlogPost()
    }
  }, [slug, initialPost])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const nextGalleryImage = () => {
    if (post?.gallery?.length) {
      setCurrentGalleryIndex((prev) => (prev + 1) % (post.gallery?.length || 1))
    }
  }

  const prevGalleryImage = () => {
    if (post?.gallery?.length) {
      setCurrentGalleryIndex((prev) => (prev - 1 + (post.gallery?.length || 1)) % (post.gallery?.length || 1))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
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
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const coverAlt = post.title || "Imagem do post"
  const mainTag = post.tags?.[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8">
            {post.image && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  alt={coverAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt as unknown as string)}</span>
              </div>

              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min de leitura</span>
                </div>
              )}

              <Button variant="outline" size="sm" type="button" aria-label="Compartilhar">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </header>

          {post.gallery?.length ? (
            <div className="my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria de Imagens</h2>

              <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={post.gallery[currentGalleryIndex] || "/placeholder.svg"}
                  alt={`Imagem ${currentGalleryIndex + 1} da galeria`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />

                {post.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevGalleryImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Imagem anterior"
                      type="button"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextGalleryImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      aria-label="Próxima imagem"
                      type="button"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentGalleryIndex + 1} / {post.gallery.length}
                    </div>
                  </>
                )}
              </div>

              {post.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {post.gallery.map((imageUrl, index) => (
                    <button
                      key={imageUrl + index}
                      onClick={() => setCurrentGalleryIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentGalleryIndex ? "border-green-600" : "border-gray-300"
                      }`}
                      type="button"
                      aria-label={`Ir para imagem ${index + 1}`}
                    >
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            {post.excerpt ? (
              <div
                className="text-xl text-gray-700 mb-8 font-medium"
                dangerouslySetInnerHTML={{ __html: he.decode(post.excerpt) }}
              />
            ) : null}

            <div
              dangerouslySetInnerHTML={{
                __html: he.decode(post.content || "Conteúdo indisponível."),
              }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}