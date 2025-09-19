"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, Minus } from "lucide-react"
import type { BlogPost } from "@/types/index"

interface AddBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (post: Omit<BlogPost, "id">) => void
}

export function AddBlogDialog({ open, onOpenChange, onAdd }: AddBlogDialogProps) {
  const [newPost, setNewPost] = useState<Omit<BlogPost, "id">>({
    title: "",
    excerpt: "",
    content: "",
    image: "/placeholder.svg?height=300&width=400",
    author: "",
    publishedAt: new Date().toISOString().split("T")[0],
    readTime: 5,
    tags: [],
    slug: "", // Add slug here
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    gallery: [],
  })
  const [tagsInput, setTagsInput] = useState(newPost.tags.join(", "))
  const [seoKeywordsInput, setSeoKeywordsInput] = useState(newPost.seoKeywords?.join(", ") || "")

  useEffect(() => {
    setTagsInput(newPost.tags.join(", "))
    setSeoKeywordsInput(newPost.seoKeywords?.join(", ") || "")
  }, [newPost.tags, newPost.seoKeywords])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure tags and keywords are parsed on submit as well
    handleTagsBlur()
    handleKeywordsBlur()

    if (newPost.title && newPost.excerpt && newPost.content && newPost.author) {
      onAdd(newPost)
      setNewPost({
        title: "",
        excerpt: "",
        content: "",
        image: "/placeholder.svg?height=300&width=400",
        author: "",
        publishedAt: new Date().toISOString().split("T")[0],
        readTime: 5,
        tags: [],
        slug: "", // Add slug here
        seoTitle: "",
        seoDescription: "",
        seoKeywords: [],
        gallery: [],
      })
      setTagsInput("")
      setSeoKeywordsInput("")
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value)
  }

  const handleTagsBlur = () => {
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setNewPost({ ...newPost, tags })
  }

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeoKeywordsInput(e.target.value)
  }

  const handleKeywordsBlur = () => {
    const keywords = seoKeywordsInput
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
    setNewPost({ ...newPost, seoKeywords: keywords })
  }

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...(newPost.gallery || [])]
    newGallery[index] = value
    setNewPost({ ...newPost, gallery: newGallery })
  }

  const addGalleryImage = () => {
    const newGallery = [...(newPost.gallery || []), ""]
    setNewPost({ ...newPost, gallery: newGallery })
  }

  const removeGalleryImage = (index: number) => {
    const newGallery = (newPost.gallery || []).filter((_, i) => i !== index)
    setNewPost({ ...newPost, gallery: newGallery })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Escrever Novo Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadados</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Post</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Digite o título do post"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo/Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  placeholder="Breve descrição do post que aparecerá nos cards"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Conteúdo Completo</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Escreva o conteúdo completo do post aqui..."
                  rows={10}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    placeholder="Nome do autor"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="readTime">Tempo de Leitura (minutos)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={newPost.readTime}
                    onChange={(e) => setNewPost({ ...newPost, readTime: Number(e.target.value) })}
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  onBlur={handleTagsBlur}
                  placeholder="passeios, bonito, turismo, dicas"
                />
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem de Capa</Label>
                <Input
                  id="image"
                  value={newPost.image}
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <Label htmlFor="publishedAt">Data de Publicação</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={newPost.publishedAt}
                  onChange={(e) => setNewPost({ ...newPost, publishedAt: e.target.value })}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Galeria de Imagens</h3>
                <p className="text-sm text-blue-700">
                  Adicione imagens que serão exibidas em uma galeria horizontal no post do blog.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Imagens da Galeria</Label>
                <Button type="button" onClick={addGalleryImage} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Imagem
                </Button>
              </div>

              {(newPost.gallery || []).map((imageUrl, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Label htmlFor={`gallery-${index}`}>Imagem {index + 1}</Label>
                    <Input
                      id={`gallery-${index}`}
                      value={imageUrl}
                      onChange={(e) => handleGalleryChange(index, e.target.value)}
                      placeholder={`https://exemplo.com/imagem-${index + 1}.jpg`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeGalleryImage(index)}
                    className="mt-6"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {(!newPost.gallery || newPost.gallery.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Nenhuma imagem adicionada à galeria</p>
                  <Button type="button" onClick={addGalleryImage} className="mt-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Imagem
                  </Button>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Dicas para Galeria</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Use imagens de alta qualidade (mínimo 800x600px)</li>
                  <li>• Mantenha proporções similares para melhor visualização</li>
                  <li>• Adicione imagens relevantes ao conteúdo do post</li>
                  <li>• Recomendamos entre 3-8 imagens por galeria</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Otimização para SEO</h3>
                <p className="text-sm text-blue-700">
                  Preencha os campos abaixo para otimizar seu post para mecanismos de busca como Google.
                </p>
              </div>

              <div>
                <Label htmlFor="seoTitle">Título SEO (Meta Title)</Label>
                <Input
                  id="seoTitle"
                  value={newPost.seoTitle || ""}
                  onChange={(e) => setNewPost({ ...newPost, seoTitle: e.target.value })}
                  placeholder="Título otimizado para SEO (50-60 caracteres)"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{(newPost.seoTitle || "").length}/60 caracteres</p>
              </div>

              <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={newPost.seoDescription || ""}
                  onChange={(e) => setNewPost({ ...newPost, seoDescription: e.target.value })}
                  placeholder="Descrição que aparecerá nos resultados de busca (150-160 caracteres)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">{(newPost.seoDescription || "").length}/160 caracteres</p>
              </div>

              <div>
                <Label htmlFor="seoKeywords">Palavras-chave (separadas por vírgula)</Label>
                <Input
                  id="seoKeywords"
                  value={seoKeywordsInput}
                  onChange={handleKeywordsChange}
                  onBlur={handleKeywordsBlur}
                  placeholder="bonito ms, turismo, passeios aquáticos, ecoturismo"
                />
                <p className="text-xs text-gray-500 mt-1">Use 3-5 palavras-chave relevantes para o conteúdo</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Dicas de SEO</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Use palavras-chave naturalmente no título e conteúdo</li>
                  <li>• Mantenha o título SEO entre 50-60 caracteres</li>
                  <li>• A meta description deve ter 150-160 caracteres</li>
                  <li>• Inclua a palavra-chave principal no início do título</li>
                  <li>• Use headings (H2, H3) para estruturar o conteúdo</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Publicar Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
