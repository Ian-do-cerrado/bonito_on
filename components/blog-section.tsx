"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog-card"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import type { BlogPost } from "@/types/index"
import { getAllBlogPosts } from "@/services/supabase-blog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"

export function BlogSection() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const loadBlogPosts = async () => {
      const data = await getAllBlogPosts()
      setPosts(data)
    }
    loadBlogPosts()
  }, [])

  useEffect(() => {
    if (!carouselApi) return

    const updateCarouselState = () => {
      setCount(carouselApi.scrollSnapList().length)
      setCurrentIndex(carouselApi.selectedScrollSnap())
    }

    updateCarouselState()
    carouselApi.on("select", updateCarouselState)
    carouselApi.on("reInit", updateCarouselState)

    return () => {
      carouselApi.off("select", updateCarouselState)
      carouselApi.off("reInit", updateCarouselState)
    }
  }, [carouselApi])

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">{t("blogTitle")}</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{t("blogSubtitle")}</p>
        </div>

        <div className="relative">
          <Carousel opts={{ loop: true, align: "center" }} setApi={setCarouselApi}>
            <CarouselContent className="-ml-6 md:-ml-8">
              {posts.slice(0, 8).map((post) => (
                <CarouselItem key={post.id} className="pl-6 md:pl-8 basis-[82vw] md:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 backdrop-blur-sm shadow-lg border-0 -left-4 w-10 h-10 hover:bg-white md:hidden" />
            <CarouselNext className="bg-white/90 backdrop-blur-sm shadow-lg border-0 -right-4 w-10 h-10 hover:bg-white md:hidden" />
          </Carousel>

          {count > 1 && (
            <div className="flex justify-center mt-4 gap-2 md:hidden">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
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
