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
import type { BlogPost } from "@/types/index"

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

        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {post.tags.map((tag, index) => (
            <Badge key={index} className="bg-green-600 text-white">
              {tag}
            </Badge>
          ))}
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
        <div>
          <Label htmlFor="excerpt">Resumo/Excerpt</Label>
          {isEditing ? (
            <Textarea
              id="excerpt"
              value={editedPost.excerpt}
              onChange={(e) => setEditedPost({ ...editedPost, excerpt: e.target.value })}
              placeholder="Breve descrição do post que aparecerá nos cards"
              rows={3}
            />
          ) : (
            <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
          )}
        </div>

        <div>
          <Label htmlFor="content">Conteúdo Completo</Label>
          {isEditing ? (
            <Textarea
              id="content"
              value={editedPost.content}
              onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
              placeholder="Escreva o conteúdo completo do post aqui..."
              rows={10}
            />
          ) : (
            <p className="text-sm text-gray-800">{post.content}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">Autor</Label>
            {isEditing ? (
              <Input
                id="author"
                value={editedPost.author}
                onChange={(e) => setEditedPost({ ...editedPost, author: e.target.value })}
                placeholder="Nome do autor"
              />
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" /> {post.author}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="readTime">Tempo de Leitura (minutos)</Label>
            {isEditing ? (
              <Input
                id="readTime"
                type="number"
                value={editedPost.readTime}
                onChange={(e) => setEditedPost({ ...editedPost, readTime: Number(e.target.value) })}
                placeholder="5"
                min="1"
              />
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" /> {post.readTime} min
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="publishedAt">Data de Publicação</Label>
          {isEditing ? (
            <Input
              id="publishedAt"
              type="date"
              value={editedPost.publishedAt.split("T")[0]}
              onChange={(e) => setEditedPost({ ...editedPost, publishedAt: e.target.value })}
            />
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" /> {formatDate(post.publishedAt)}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="image">URL da Imagem de Capa</Label>
          {isEditing ? (
            <Input
              id="image"
              value={editedPost.image || ""}
              onChange={(e) => setEditedPost({ ...editedPost, image: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          ) : (
            <p className="text-sm text-gray-800 break-all">{post.image}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          {isEditing ? (
            <Input
              id="slug"
              value={editedPost.slug || ""}
              onChange={(e) => setEditedPost({ ...editedPost, slug: e.target.value })}
              placeholder="exemplo-de-slug-do-post"
            />
          ) : (
            <p className="text-sm text-gray-800">{post.slug}</p>
          )}
        </div>

        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          {isEditing ? (
            <Input
              id="tags"
              value={editedPost.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="passeios, bonito, turismo, dicas"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="seoTitle">Título SEO</Label>
          {isEditing ? (
            <Input
              id="seoTitle"
              value={editedPost.seoTitle || ""}
              onChange={(e) => setEditedPost({ ...editedPost, seoTitle: e.target.value })}
              placeholder="Título otimizado para SEO"
            />
          ) : (
            <p className="text-sm text-gray-800">{post.seoTitle}</p>
          )}
        </div>

        <div>
          <Label htmlFor="seoDescription">Meta Description</Label>
          {isEditing ? (
            <Textarea
              id="seoDescription"
              value={editedPost.seoDescription || ""}
              onChange={(e) => setEditedPost({ ...editedPost, seoDescription: e.target.value })}
              placeholder="Descrição para resultados de busca"
              rows={3}
            />
          ) : (
            <p className="text-sm text-gray-800">{post.seoDescription}</p>
          )}
        </div>

        <div>
          <Label htmlFor="seoKeywords">Palavras-chave SEO (separadas por vírgula)</Label>
          {isEditing ? (
            <Input
              id="seoKeywords"
              value={editedPost.seoKeywords?.join(", ") || ""}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="palavra-chave1, palavra-chave2"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {post.seoKeywords?.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Galeria de Imagens</Label>
          {isEditing ? (
            <div className="space-y-2">
              {(editedPost.gallery || []).map((imageUrl, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={imageUrl}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                    placeholder={`URL da imagem ${index + 1}`}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeGalleryImage(index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addGalleryImage} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Imagem
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(post.gallery || []).map((imageUrl, index) => (
                <Image
                  key={index}
                  src={getSafeImageSrc(imageUrl)}
                  alt={`Galeria imagem ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />
              ))}
              {(!post.gallery || post.gallery.length === 0) && (
                <p className="text-sm text-gray-500">Nenhuma imagem na galeria.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
