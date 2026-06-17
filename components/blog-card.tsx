"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"
import type { BlogPost } from "@/types/index"
import { useLanguage } from "@/contexts/language-context"
import { htmlToPlainText } from "@/lib/text-format"

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

  return (
    <Card className="h-full w-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <SafeImage
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-green-600 text-white">{post.tags[0]}</Badge>
        </div>
      </div>

      <CardContent className="p-6 flex-1">
        <h3 className="font-bold text-xl mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{htmlToPlainText(post.excerpt)}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>
            {post.readTime} {t("readTime")}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/blog/${createSlug(post.title)}`} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            {t("readMore")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
