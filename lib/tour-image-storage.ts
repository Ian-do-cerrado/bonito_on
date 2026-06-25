export const TOUR_IMAGES_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "tour-images"

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
}

/** Converte URL absoluta do Supabase ou path local para o formato gravado no banco. */
export function toDbImagePath(path: string | null | undefined): string {
  if (path == null || typeof path !== "string") return ""
  const p = path.trim()
  if (!p) return ""

  if (!p.startsWith("http://") && !p.startsWith("https://")) {
    return p.replace(/^\//, "")
  }

  const bucket = TOUR_IMAGES_BUCKET
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = p.indexOf(marker)
  if (idx >= 0) return p.slice(idx + marker.length)

  return p
}

/** Path gerenciado no bucket tour-images (ex.: slug/001.jpg). */
export function isManagedStoragePath(path: string | null | undefined): boolean {
  const p = toDbImagePath(path)
  if (!p || p.startsWith("http://") || p.startsWith("https://")) return false
  if (p.startsWith("images/")) return false
  return /^[^/]+\/.+/.test(p)
}

export function extFromFileName(name: string): string {
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase()
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext
  }
  return ".jpg"
}

export function extFromMime(mime: string): string {
  return MIME_TO_EXT[mime] ?? ".jpg"
}

export function nextGalleryFileName(slug: string, gallery: string[], ext: string): string {
  const nums = gallery
    .map((raw) => {
      const p = toDbImagePath(raw)
      const match = p.match(new RegExp(`^${escapeRegExp(slug)}/(\\d+)`))
      return match ? Number.parseInt(match[1], 10) : 0
    })
    .filter((n) => n > 0)

  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `${slug}/${String(next).padStart(3, "0")}${ext}`
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export const TOUR_IMAGE_MAX_BYTES = 10 * 1024 * 1024
export const TOUR_IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
