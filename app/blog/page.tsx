"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { useLanguage } from "@/contexts/language-context"
import type { BlogPost } from "@/types/index"
import { getAllBlogPosts } from "@/services/supabase-blog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { SiteLayout } from "@/components/site-layout"

export default function BlogPage() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

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

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return (
    <SiteLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t("blogPageTitle") || "Blog"}</h1>
          <p className="text-base sm:text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
            {t("blogPageSubtitle") || "Descubra dicas, guias e histórias sobre Bonito e região"}
          </p>
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

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedTag === null ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedTag === null ? "bg-green-600 hover:bg-green-700" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedTag(null)}
            >
              {t("allPosts") || "Todos"}
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 capitalize ${
                  selectedTag === tag ? "bg-green-600 hover:bg-green-700" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPosts.length === 1
              ? `${filteredPosts.length} post encontrado`
              : `${filteredPosts.length} posts encontrados`}
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
