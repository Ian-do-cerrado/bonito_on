/**
 * Envia galerias locais (public/images/tours) para Supabase Storage
 * e atualiza tours.gallery com paths relativos ao bucket.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const LOCAL_TOURS_DIR = path.join(ROOT, "public/images/tours")
const BUCKET = "tour-images"

const SUPABASE_URL = "https://inknnuxctfwnoswawixt.supabase.co"
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw"

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
}

async function ensureBucket(supabase) {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some((b) => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error && !/already exists/i.test(error.message)) throw error
  }
}

async function uploadFile(supabase, storagePath, localPath, retries = 4) {
  const ext = path.extname(localPath).toLowerCase()
  const body = fs.readFileSync(localPath)
  let lastError
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
      contentType: MIME[ext] ?? "application/octet-stream",
      upsert: true,
    })
    if (!error) return
    lastError = error
    if (!/timeout|502|503|504|fetch/i.test(error.message)) break
    await new Promise((r) => setTimeout(r, attempt * 1500))
  }
  throw new Error(`${storagePath}: ${lastError?.message}`)
}

async function fileExistsInBucket(supabase, storagePath) {
  const parts = storagePath.split("/")
  const name = parts.pop()
  const folder = parts.join("/")
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, { search: name })
  if (error) return false
  return data?.some((f) => f.name === name) ?? false
}

async function main() {
  if (!fs.existsSync(LOCAL_TOURS_DIR)) {
    console.error("Pasta não encontrada:", LOCAL_TOURS_DIR)
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
  await ensureBucket(supabase)

  const slugs = fs
    .readdirSync(LOCAL_TOURS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  let uploaded = 0
  let updated = 0

  for (const slug of slugs) {
    const dir = path.join(LOCAL_TOURS_DIR, slug)
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    if (files.length === 0) continue

    const gallery = []
    for (const file of files) {
      const storagePath = `${slug}/${file}`
      const exists = await fileExistsInBucket(supabase, storagePath)
      if (!exists) {
        await uploadFile(supabase, storagePath, path.join(dir, file))
        uploaded++
        if (uploaded % 25 === 0) console.log(`  ... ${uploaded} arquivos enviados`)
      }
      gallery.push(storagePath)
    }

    const { error } = await supabase.from("tours").update({ gallery }).eq("slug", slug)
    if (error) {
      console.error(`Erro DB ${slug}:`, error.message)
      continue
    }
    updated++
    console.log(`[ok] ${slug} — ${gallery.length} imagens`)
  }

  console.log(`\nConcluído: ${uploaded} arquivos, ${updated} passeios atualizados`)
  console.log(`Bucket: ${BUCKET}`)
  console.log(`Defina NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=${BUCKET} na Vercel e no .env.local`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
