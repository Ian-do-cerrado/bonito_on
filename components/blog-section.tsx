"use client"

import { useState, useEffect, useRef } from "react"
import { BlogCard } from "@/components/blog-card"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { BlogPost } from "@/types/index"
import { getAllBlogPosts } from "@/services/supabase-blog"

export function BlogSection() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadBlogPosts = async () => {
      const data = await getAllBlogPosts()
      setPosts(data)
    }
    loadBlogPosts()
  }, [])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      const total = Math.min(posts.length, 8)
      if (total > 0) setCurrentIndex(Math.round(scrollLeft / (scrollWidth / total)))
    }
  }

  const scrollCarousel = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => handleScroll())
  }, [posts])

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">{t("blogTitle")}</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{t("blogSubtitle")}</p>
        </div>

        <div className="relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300 md:hidden"
            onClick={() => scrollCarousel("left")}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 hover:bg-white transition-all duration-300 md:hidden"
            onClick={() => scrollCarousel("right")}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div
            ref={scrollRef}
            className="flex md:grid overflow-x-auto md:overflow-visible md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory md:snap-none scrollbar-hide pb-4 md:pb-0 pl-[calc(50%-41vw)] pr-[calc(50%-41vw)] md:pl-0 md:pr-0"
            onScroll={handleScroll}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {posts.slice(0, 8).map((post) => (
              <div key={post.id} className="flex-shrink-0 w-[82vw] md:w-auto snap-center">
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-2 md:hidden">
            {posts.slice(0, 8).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current && posts.length > 0) {
                    const total = Math.min(posts.length, 8)
                    const cardWidth = scrollRef.current.scrollWidth / total
                    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" })
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {posts.length > 8 && (
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-sm sm:text-base rounded-full font-semibold transition-all duration-300 hover:scale-105"
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
