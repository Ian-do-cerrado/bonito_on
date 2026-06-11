"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useLanguage } from "@/contexts/language-context"
import { BlogPost } from "@/types/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Languages, Loader2 } from "lucide-react"

interface AddBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (post: Omit<BlogPost, "id">) => void
}

export function AddBlogDialog({ open, onOpenChange, onAdd }: AddBlogDialogProps) {
  const { t } = useLanguage()
  const [isTranslating, setIsTranslating] = useState(false)
  const [newPost, setNewPost] = useState<Omit<BlogPost, "id">>({
    title: "",
    excerpt: "",
    content: "",
    title_en: "",
    excerpt_en: "",
    content_en: "",
    title_es: "",
    excerpt_es: "",
    content_es: "",
    image: "/placeholder.svg?height=300&width=600",
    author: "",
    publishedAt: new Date().toISOString().split("T")[0],
    readTime: 5,
    tags: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    gallery: [],
  })

  const handleTranslate = async () => {
    if (!newPost.title || !newPost.content) return
    setIsTranslating(true)
    try {
      const resEn = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: newPost.title,
            excerpt: newPost.excerpt,
            content: newPost.content
          },
          to: "en"
        })
      })
      const dataEn = await resEn.json()
      
      const resEs = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: {
            title: newPost.title,
            excerpt: newPost.excerpt,
            content: newPost.content
          },
          to: "es"
        })
      })
      const dataEs = await resEs.json()
      
      setNewPost(prev => ({
        ...prev,
        title_en: dataEn.results.title,
        excerpt_en: dataEn.results.excerpt,
        content_en: dataEn.results.content,
        title_es: dataEs.results.title,
        excerpt_es: dataEs.results.excerpt,
        content_es: dataEs.results.content
      }))
    } catch (error) {
      console.error("Erro na tradução:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.title && newPost.content) {
      onAdd(newPost)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="pt">
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
                {t("autoTranslate")}
              </Button>
            </div>

            <TabsContent value="pt" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>Título (PT)</Label>
                <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
              </div>
              <div>
                <Label>Resumo (PT)</Label>
                <Textarea value={newPost.excerpt} onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })} />
              </div>
              <div>
                <Label>Conteúdo (PT)</Label>
                <RichTextEditor value={newPost.content || ""} onChange={(val) => setNewPost({ ...newPost, content: val })} />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>Title (EN)</Label>
                <Input value={newPost.title_en} onChange={(e) => setNewPost({ ...newPost, title_en: e.target.value })} />
              </div>
              <div>
                <Label>Excerpt (EN)</Label>
                <Textarea value={newPost.excerpt_en} onChange={(e) => setNewPost({ ...newPost, excerpt_en: e.target.value })} />
              </div>
              <div>
                <Label>Content (EN)</Label>
                <RichTextEditor value={newPost.content_en || ""} onChange={(val) => setNewPost({ ...newPost, content_en: val })} />
              </div>
            </TabsContent>

            <TabsContent value="es" className="space-y-4 border p-4 rounded-lg">
              <div>
                <Label>Título (ES)</Label>
                <Input value={newPost.title_es} onChange={(e) => setNewPost({ ...newPost, title_es: e.target.value })} />
              </div>
              <div>
                <Label>Resumen (ES)</Label>
                <Textarea value={newPost.excerpt_es} onChange={(e) => setNewPost({ ...newPost, excerpt_es: e.target.value })} />
              </div>
              <div>
                <Label>Contenido (ES)</Label>
                <RichTextEditor value={newPost.content_es || ""} onChange={(val) => setNewPost({ ...newPost, content_es: val })} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Autor</Label>
              <Input value={newPost.author} onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} />
            </div>
            <div>
              <Label>Imagem</Label>
              <Input value={newPost.image} onChange={(e) => setNewPost({ ...newPost, image: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
