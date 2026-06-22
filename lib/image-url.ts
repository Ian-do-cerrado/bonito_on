/**
 * Resolve imagem para URL absoluta.
 * - Se for URL completa (http/https), retorna como está.
 * - Se NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET estiver definido e o path for relativo,
 *   constrói a URL do Supabase Storage.
 * - Caso contrário, retorna o path relativo (para arquivos em public/).
 */
export function resolveImageUrl(path: string | null | undefined): string {
  if (path == null || typeof path !== "string" || !path.trim()) {
    return "/images/placeholder.svg"
  }
  const p = path.trim()
  if (p.startsWith("http://") || p.startsWith("https://")) {
    return p
  }
  if (p.startsWith("data:image/")) {
    return p
  }
  // Caminhos absolutos locais de public/ (ex.: /foto.webp) devem permanecer locais.
  // Exceção: endpoints de storage do Supabase, que precisam de host.
  if (p.startsWith("/") && !p.startsWith("/storage/v1/object/public/")) {
    return p
  }

  const supabaseObjectPrefix = "/storage/v1/object/public/"
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  // Aceita caminhos já no formato do endpoint de storage
  if (supabaseUrl && p.startsWith(supabaseObjectPrefix)) {
    return `${supabaseUrl.replace(/\/$/, "")}${p}`
  }

  // Fallback do bucket para evitar imagens quebradas quando o env não estiver configurado no deploy.
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "tour-images"
  if (supabaseUrl) {
    const cleanPath = p.replace(/^\//, "")
    if (cleanPath.startsWith(`${bucket}/`)) {
      return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${cleanPath}`
    }
    if (cleanPath.startsWith(`storage/v1/object/public/${bucket}/`)) {
      return `${supabaseUrl.replace(/\/$/, "")}/${cleanPath}`
    }
    return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${cleanPath}`
  }
  return p.startsWith("/") ? p : `/${p}`
}

/** URLs http(s) não devem passar pelo otimizador da Vercel (evita 402 em storage Supabase). */
export function isExternalImageUrl(path: string | null | undefined): boolean {
  if (!path || typeof path !== "string") return false
  const p = path.trim()
  return p.startsWith("http://") || p.startsWith("https://")
}
