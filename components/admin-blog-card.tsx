"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Save, X, Languages, Loader2, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"
import Image from "next/image"
import type { BlogPost } from "@/types/index"
import { useLanguage } from "@/contexts/language-context"

interface AdminBlogCardProps {
  post: BlogPost
  onUpdate: (post: BlogPost) => void
  onDelete: (postId: string) => void
}

function getSafeImageSrc(src: string | null | undefined): string {
  if (!src) return "/placeholder.svg"
  if (src.startsWith("http") || src.startsWith("/")) return src
  return "/" + src
}

export function AdminBlogCard({ post, onUpdate, onDelete }: AdminBlogCardProps) {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState<BlogPost>(post)
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!editedPost.title || !editedPost.content) return
    
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedPost.title,
            excerpt: editedPost.excerpt || "",
            content: editedPost.content
          },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: editedPost.title,
            excerpt: editedPost.excerpt || "",
            content: editedPost.content
          },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      if (dataEn.error || dataEs.error) {
        throw new Error(dataEn.error || dataEs.error || "Erro desconhecido na tradução")
      }

      if (!dataEn.results || !dataEs.results) {
        throw new Error("Resultados da tradução não recebidos")
      }
      
      setEditedPost(prev => ({
        ...prev,
        title_en: dataEn.results.title || prev.title_en,
        excerpt_en: dataEn.results.excerpt || prev.excerpt_en,
        content_en: dataEn.results.content || prev.content_en,
        title_es: dataEs.results.title || prev.title_es,
        excerpt_es: dataEs.results.excerpt || prev.excerpt_es,
        content_es: dataEs.results.content || prev.content_es
      }))

      toast({
        title: "Sucesso",
        description: "Tradução concluída com sucesso!",
      })
    } catch (error) {
      console.error("Erro na tradução:", error)
      toast({
        title: "Erro na tradução",
        description: error instanceof Error ? error.message : "Não foi possível traduzir o conteúdo",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSave = () => {
    onUpdate(editedPost)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedPost(post)
    setIsEditing(false)
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean)
    setEditedPost({ ...editedPost, tags })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={getSafeImageSrc(post.image)} alt={post.title} fill className="object-cover" />
        <div className="absolute top-2 left-2">
          <Badge className="bg-green-600 text-white">{post.tags[0]}</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {!isEditing && <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>}
          </div>
          <div className="flex space-x-2 ml-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-1" /> Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" /> Cancelar
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

      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {isEditing ? (
          <>
            <Tabs defaultValue="pt" className="w-full">
              <div className="flex items-center justify-between mb-2">
                <TabsList>
                  <TabsTrigger value="pt">PT</TabsTrigger>
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="es">ES</TabsTrigger>
                </TabsList>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="flex items-center gap-2"
                >
                  {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                  Traduzir Auto
                </Button>
              </div>

              <TabsContent value="pt" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (PT)</Label>
                  <Input
                    value={editedPost.title}
                    onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                    className="font-bold border-green-200"
                  />
                  <Label>Resumo (PT)</Label>
                  <Textarea
                    value={editedPost.excerpt}
                    onChange={(e) => setEditedPost({ ...editedPost, excerpt: e.target.value })}
                  />
                  <Label>Conteúdo (PT)</Label>
                  <RichTextEditor
                    value={editedPost.content || ""}
                    onChange={(val) => setEditedPost({ ...editedPost, content: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input
                    value={editedPost.title_en || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, title_en: e.target.value })}
                  />
                  <Label>Excerpt (EN)</Label>
                  <Textarea
                    value={editedPost.excerpt_en || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, excerpt_en: e.target.value })}
                  />
                  <Label>Content (EN)</Label>
                  <RichTextEditor
                    value={editedPost.content_en || ""}
                    onChange={(val) => setEditedPost({ ...editedPost, content_en: val })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="es" className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Título (ES)</Label>
                  <Input
                    value={editedPost.title_es || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, title_es: e.target.value })}
                  />
                  <Label>Resumen (ES)</Label>
                  <Textarea
                    value={editedPost.excerpt_es || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, excerpt_es: e.target.value })}
                  />
                  <Label>Contenido (ES)</Label>
                  <RichTextEditor
                    value={editedPost.content_es || ""}
                    onChange={(val) => setEditedPost({ ...editedPost, content_es: val })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t space-y-4">
              <div>
                <Label>Imagem Principal</Label>
                <Input
                  value={editedPost.image}
                  onChange={(e) => setEditedPost({ ...editedPost, image: e.target.value })}
                />
              </div>
              <div>
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={editedPost.tags.join(", ")}
                  onChange={(e) => handleTagsChange(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="font-medium">Autor:</span> {post.author}
              <span className="font-medium">Tempo:</span> {post.readTime} min
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
