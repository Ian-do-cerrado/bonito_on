"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BlogPost } from "@/types/index"
import { useLanguage } from "@/contexts/language-context"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const { t } = useLanguage()

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getSafeImageSrc = (src: string | null | undefined): string => {
    if (!src) return "/placeholder.svg"
    if (src.startsWith("http") || src.startsWith("/")) return src
    return "/" + src
  }

  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-green-100/60 border border-gray-100 bg-white rounded-2xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getSafeImageSrc(post.image)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4">
          <Badge className="bg-green-600 text-white shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            {post.tags[0]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {post.readTime} {t("readTime")}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/blog/${createSlug(post.title)}`} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-green-200 hover:shadow-lg transition-all duration-300">
            {t("readMore")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
