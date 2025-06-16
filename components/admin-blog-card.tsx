"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Save, X, Calendar, Clock, User, Plus, Minus, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { BlogPost } from "@/components/blog-section"

interface AdminBlogCardProps {
  post: BlogPost
  onUpdate: (post: BlogPost) => void
  onDelete: (postId: string) => void
}

// Função movida para fora do JSX
function getSafeImageSrc(src: string | null | undefined): string {
  if (!src) return "/placeholder.svg"
  if (src.startsWith("http") || src.startsWith("/")) return src
  return "/" + src
}

export function AdminBlogCard({ post, onUpdate, onDelete }: AdminBlogCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState<BlogPost>(post)

  const handleSave = () => {
    onUpdate(editedPost)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedPost(post)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(",").map((tag) => tag.trim()).filter(Boolean)
    setEditedPost({ ...editedPost, tags })
  }

  const handleKeywordsChange = (keywordsString: string) => {
    const keywords = keywordsString.split(",").map((kw) => kw.trim()).filter(Boolean)
    setEditedPost({ ...editedPost, seoKeywords: keywords })
  }

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...(editedPost.gallery || [])]
    newGallery[index] = value
    setEditedPost({ ...editedPost, gallery: newGallery })
  }

  const addGalleryImage = () => {
    setEditedPost({ ...editedPost, gallery: [...(editedPost.gallery || []), ""] })
  }

  const removeGalleryImage = (index: number) => {
    const updated = (editedPost.gallery || []).filter((_, i) => i !== index)
    setEditedPost({ ...editedPost, gallery: updated })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={getSafeImageSrc(post.image)}
          alt={post.title}
          fill
          className="object-cover"
        />

        <div className="absolute top-2 left-2">
          <Badge className="bg-green-600 text-white">{post.tags[0]}</Badge>
        </div>

        {post.gallery && post.gallery.length > 0 && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600 text-white flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              {post.gallery.length}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedPost.title}
                onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                className="font-bold text-lg"
              />
            ) : (
              <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
            )}
          </div>
          <div className="flex space-x-2 ml-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {/* ...restante do conteúdo permanece igual, sem necessidade de correção */}
      </CardContent>
    </Card>
  )
}
