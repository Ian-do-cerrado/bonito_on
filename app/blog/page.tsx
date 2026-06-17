"use client"

import { useState, useEffect, useRef } from "react"
import { BlogCard } from "@/components/blog-card"
import { useLanguage } from "@/contexts/language-context"
import type { BlogPost } from "@/types/index"
import { getAllBlogPosts } from "@/services/supabase-blog"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BlogPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  const scrollFilter = (direction: "left" | "right") => {
    const el = tagsRef.current
    if (!el) return

    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
    const atStart = el.scrollLeft <= 4

    if (direction === "right") {
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" })
      else el.scrollBy({ left: 200, behavior: "smooth" })
    } else {
      if (atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" })
      else el.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const loadBlogPosts = async () => {
      const data = await getAllBlogPosts()
      setPosts(data)
      setFilteredPosts(data)
    }
    loadBlogPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag))
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedTag])

  useEffect(() => {
    if (selectedTag !== null) return

    requestAnimationFrame(() => {
      if (tagsRef.current) tagsRef.current.scrollLeft = 0
    })
  }, [selectedTag])

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return (
    <SiteLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-72 pt-16 bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <div className="mb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backBtn")}
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t("blogPageTitle") || "Blog"}</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-2xl leading-relaxed">
              {t("blogPageSubtitle") || "Descubra dicas, guias e histórias sobre Bonito e região"}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t("searchPosts") || "Buscar posts..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block text-center sm:text-left">
            {t("filterByCategory")}
          </span>
          <p className="text-xs text-gray-500 mb-3 text-center sm:text-left">
            <span className="sm:hidden">{t("dragToFilterPosts")}</span>
            <span className="hidden sm:inline">{t("clickToFilterPosts")}</span>
          </p>

          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scrollFilter("left")}
              className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
              aria-label="Rolar categorias para a esquerda"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div ref={tagsRef} className="flex overflow-x-auto scrollbar-hide gap-2 py-1 flex-1">
              {[
                { value: null, label: t("allPosts") || "Todos", count: posts.length },
                ...allTags.map((tag) => ({
                  value: tag,
                  label: tag,
                  count: posts.filter((post) => post.tags.includes(tag)).length,
                })),
              ].map(({ value, label, count }) => (
                <button
                  key={value || "all"}
                  onClick={() => setSelectedTag(value)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap shadow-sm capitalize ${
                    selectedTag === value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                  }`}
                >
                  {label} <span className="ml-1 opacity-70">({count})</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollFilter("right")}
              className="flex-shrink-0 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
              aria-label="Rolar categorias para a direita"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPosts.length === 1
              ? `${filteredPosts.length} ${t("postFoundSingular")}`
              : `${filteredPosts.length} ${t("postsFoundPlural")}`}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${filteredPosts.indexOf(post) * 0.1}s` }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t("noPostsFound") || "Nenhum post encontrado"}
            </h3>
            <p className="text-gray-500">
              {t("tryDifferentSearch") || "Tente uma busca diferente ou remova os filtros"}
            </p>
          </div>
        )}
      </div>
    </div>
    </SiteLayout>
  )
}
