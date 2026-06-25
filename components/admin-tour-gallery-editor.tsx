"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { resolveImageUrl, isExternalImageUrl } from "@/lib/image-url"
import { toDbImagePath, isManagedStoragePath } from "@/lib/tour-image-storage"
import { uploadTourGalleryImages, deleteTourStorageImage } from "@/app/actions/tour-images"
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react"

interface AdminTourGalleryEditorProps {
  slug: string
  title?: string
  image?: string
  gallery?: string[]
  onChange: (updates: { image?: string; gallery?: string[] }) => void
  disabled?: boolean
}

const PLACEHOLDER = "/images/placeholder.svg"

function normalizeGallery(gallery?: string[]): string[] {
  return (gallery ?? []).map(toDbImagePath).filter(Boolean)
}

function normalizeImage(image: string | undefined, gallery: string[]): string {
  const dbImage = toDbImagePath(image)
  if (dbImage && dbImage !== PLACEHOLDER && !dbImage.includes("placeholder.svg")) {
    return dbImage
  }
  return gallery[0] ?? PLACEHOLDER
}

export function AdminTourGalleryEditor({
  slug,
  title,
  image,
  gallery,
  onChange,
  disabled = false,
}: AdminTourGalleryEditorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [manualPath, setManualPath] = useState("")
  const [removingPath, setRemovingPath] = useState<string | null>(null)

  const dbGallery = useMemo(() => normalizeGallery(gallery), [gallery])
  const dbImage = useMemo(() => normalizeImage(image, dbGallery), [image, dbGallery])
  const canUpload = Boolean(slug.trim()) && !disabled

  const applyGallery = (nextGallery: string[], nextImage = dbImage) => {
    const normalized = normalizeGallery(nextGallery)
    const cover = normalized.includes(nextImage)
      ? nextImage
      : normalizeImage(nextImage, normalized)
    onChange({
      gallery: normalized,
      image: cover || normalized[0] || PLACEHOLDER,
    })
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !canUpload) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append("files", file))
      formData.append("existingGallery", JSON.stringify(dbGallery))

      const result = await uploadTourGalleryImages(slug, formData)
      if (!result.success || !result.paths?.length) {
        throw new Error(result.error || "Falha no upload.")
      }

      const nextGallery = [...dbGallery, ...result.paths]
      const nextImage =
        !dbImage || dbImage === PLACEHOLDER || dbImage.includes("placeholder.svg")
          ? result.paths[0]
          : dbImage

      applyGallery(nextGallery, nextImage)
      toast({
        title: "Fotos enviadas",
        description: `${result.paths.length} imagem(ns) adicionada(s) à galeria.`,
      })
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível enviar as fotos.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemove = async (path: string) => {
    if (disabled) return
    setRemovingPath(path)

    try {
      if (isManagedStoragePath(path)) {
        const result = await deleteTourStorageImage(path)
        if (!result.success) {
          throw new Error(result.error || "Falha ao remover do storage.")
        }
      }

      const nextGallery = dbGallery.filter((item) => item !== path)
      let nextImage = dbImage
      if (dbImage === path) {
        nextImage = nextGallery[0] ?? PLACEHOLDER
      }
      applyGallery(nextGallery, nextImage)
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: error instanceof Error ? error.message : "Não foi possível remover a foto.",
        variant: "destructive",
      })
    } finally {
      setRemovingPath(null)
    }
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= dbGallery.length) return
    const nextGallery = [...dbGallery]
    const [item] = nextGallery.splice(index, 1)
    nextGallery.splice(target, 0, item)
    applyGallery(nextGallery, dbImage)
  }

  const setCover = (path: string) => {
    onChange({ image: path, gallery: dbGallery })
  }

  const addManualPath = () => {
    const path = toDbImagePath(manualPath)
    if (!path) return
    if (dbGallery.includes(path)) {
      setManualPath("")
      return
    }
    applyGallery([...dbGallery, path], dbImage === PLACEHOLDER ? path : dbImage)
    setManualPath("")
  }

  const coverSrc = resolveImageUrl(dbImage)

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-slate-600" />
        <Label className="text-slate-700 font-semibold text-sm">Fotos do Passeio</Label>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        As imagens são salvas no bucket <strong>{process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "tour-images"}</strong>{" "}
        no formato <code className="text-[10px]">slug/arquivo</code>, como no site. A foto de capa aparece nos cards; a galeria na página do passeio.
      </p>

      {!slug.trim() && (
        <p className="text-xs text-amber-600 font-medium">
          Informe o título do passeio para gerar o slug antes de enviar fotos.
          {title ? ` Slug previsto: ${slug || "—"}` : ""}
        </p>
      )}

      <div className="space-y-2">
        <Label className="text-xs text-slate-600">Capa (card e hero)</Label>
        <div className="relative h-36 rounded-md overflow-hidden border bg-white">
          <Image
            src={coverSrc}
            alt="Capa do passeio"
            fill
            className="object-cover"
            unoptimized={isExternalImageUrl(coverSrc) || coverSrc.endsWith(".webp")}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          disabled={!canUpload || isUploading}
          onChange={(e) => void handleUpload(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canUpload || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Adicionar fotos
        </Button>
        <span className="text-[11px] text-slate-400">JPG, PNG ou WebP — até 10 MB cada</span>
      </div>

      {dbGallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dbGallery.map((path, index) => {
            const src = resolveImageUrl(path)
            const isCover = dbImage === path
            const isRemoving = removingPath === path

            return (
              <div key={`${path}-${index}`} className="relative rounded-md border bg-white overflow-hidden">
                <div className="relative h-24">
                  <Image
                    src={src}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={isExternalImageUrl(src) || src.endsWith(".webp")}
                  />
                  {isCover && (
                    <span className="absolute top-1 left-1 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      <Star className="w-2.5 h-2.5" />
                      Capa
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <div className="flex gap-0.5">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={disabled || index === 0 || isRemoving}
                      onClick={() => moveImage(index, -1)}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={disabled || index === dbGallery.length - 1 || isRemoving}
                      onClick={() => moveImage(index, 1)}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex gap-0.5">
                    {!isCover && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[10px]"
                        disabled={disabled || isRemoving}
                        onClick={() => setCover(path)}
                      >
                        Capa
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      disabled={disabled || isRemoving}
                      onClick={() => void handleRemove(path)}
                    >
                      {isRemoving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="px-2 pb-2 text-[9px] text-slate-400 truncate" title={path}>
                  {path}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">Nenhuma foto na galeria.</p>
      )}

      <div className="space-y-2 pt-1 border-t border-slate-200">
        <Label className="text-xs text-slate-600">Adicionar por URL ou path (opcional)</Label>
        <div className="flex gap-2">
          <Input
            value={manualPath}
            onChange={(e) => setManualPath(e.target.value)}
            placeholder="slug/001.jpg ou https://..."
            disabled={disabled}
            className="text-sm"
          />
          <Button type="button" variant="secondary" size="sm" disabled={disabled || !manualPath.trim()} onClick={addManualPath}>
            Incluir
          </Button>
        </div>
      </div>
    </div>
  )
}
