"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import type { BlogPost } from "@/types/index"
import { getAllBlogPosts } from "@/services/supabase-blog"

export function BlogSection() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const loadBlogPosts = async () => {
      const data = await getAllBlogPosts()
      setPosts(data)
    }
    loadBlogPosts()
  }, [])

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("blogTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("blogSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 8).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length > 8 && (
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("viewAllPosts") || "Ver Blog"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
