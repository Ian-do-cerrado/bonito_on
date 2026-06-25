"use server"

import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import {
  TOUR_IMAGES_BUCKET,
  TOUR_IMAGE_ALLOWED_TYPES,
  TOUR_IMAGE_MAX_BYTES,
  extFromFileName,
  extFromMime,
  isManagedStoragePath,
  nextGalleryFileName,
  toDbImagePath,
} from "@/lib/tour-image-storage"

async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user?.email) {
    throw new Error("Sessão expirada. Faça login novamente.")
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", user.email)
    .eq("is_active", true)
    .single()

  if (adminError || !adminUser) {
    throw new Error("Usuário não autorizado para alterar fotos de passeios.")
  }
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export async function uploadTourGalleryImages(
  slug: string,
  formData: FormData
): Promise<{ success: boolean; paths?: string[]; error?: string }> {
  try {
    const cleanSlug = normalizeSlug(slug)
    if (!cleanSlug) {
      return { success: false, error: "Slug do passeio inválido." }
    }

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (files.length === 0) {
      return { success: false, error: "Nenhum arquivo selecionado." }
    }

    const supabase = await createClient()
    await requireAdmin(supabase)

    const existingGalleryRaw = formData.get("existingGallery")
    const existingGallery: string[] = existingGalleryRaw
      ? (JSON.parse(String(existingGalleryRaw)) as string[]).map(toDbImagePath).filter(Boolean)
      : []

    const uploadedPaths: string[] = []
    let gallerySnapshot = [...existingGallery]

    for (const file of files) {
      if (!TOUR_IMAGE_ALLOWED_TYPES.includes(file.type)) {
        return { success: false, error: `Formato não suportado: ${file.name}` }
      }
      if (file.size > TOUR_IMAGE_MAX_BYTES) {
        return { success: false, error: `Arquivo muito grande: ${file.name} (máx. 10 MB)` }
      }

      const ext = file.type ? extFromMime(file.type) : extFromFileName(file.name)
      const storagePath = nextGalleryFileName(cleanSlug, gallerySnapshot, ext)
      const buffer = Buffer.from(await file.arrayBuffer())

      const { error: uploadError } = await supabase.storage
        .from(TOUR_IMAGES_BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        })

      if (uploadError) {
        console.error("Erro ao enviar imagem:", uploadError)
        return { success: false, error: uploadError.message || "Falha no upload." }
      }

      gallerySnapshot.push(storagePath)
      uploadedPaths.push(storagePath)
    }

    return { success: true, paths: uploadedPaths }
  } catch (error) {
    console.error("uploadTourGalleryImages:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao enviar imagens.",
    }
  }
}

export async function deleteTourStorageImage(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const path = toDbImagePath(storagePath)
    if (!isManagedStoragePath(path)) {
      return { success: true }
    }

    const supabase = await createClient()
    await requireAdmin(supabase)

    const { error } = await supabase.storage.from(TOUR_IMAGES_BUCKET).remove([path])
    if (error) {
      console.error("Erro ao remover imagem:", error)
      return { success: false, error: error.message || "Falha ao remover imagem." }
    }

    return { success: true }
  } catch (error) {
    console.error("deleteTourStorageImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao remover imagem.",
    }
  }
}
