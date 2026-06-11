/**
 * Copia fotos do webscraping para public/images/tours/{slug}/
 * e atualiza tours.gallery no Supabase.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SCRAPING_DIR = "C:/Users/ian/Documents/webscrapping"
const PHOTOS_DIR = path.join(SCRAPING_DIR, "fotos_passeios")
const LOG_FILE = path.join(SCRAPING_DIR, "download.log")
const PUBLIC_TOURS_DIR = path.join(ROOT, "public/images/tours")

const SUPABASE_URL = "https://inknnuxctfwnoswawixt.supabase.co"
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw"

/** Blog post slug (download.log) -> tour slug no Supabase */
const BLOG_TO_DB_SLUG = {
  "abismo-anhumas": "abismo-anhumas",
  "aquário-natural": "aquario-natural",
  "arvismo-cabanas": "cabanas-arvorismo",
  "arvorismo-cabanas": "cabanas-arvorismo",
  "balneário-cachoeiras-serra-da-bodoquena-com-almoço": "balneario-cachoeiras-serra-da-bodoquena-com-almoco",
  "balneário-do-sol": "balneario-do-sol",
  "balneário-ecopark-porto-da-ilha": "balneario-ecopark-porto-da-ilha",
  "balneário-estrela-do-formoso": "balneario-estrela-do-formoso",
  "balneário-jardim-ecopark": "balneario-jardim-ecopark",
  "balneário-municipal": "balneario-municipal",
  "balneário-nascente-azul-1": "balneario-nascente-azul",
  "barco-elétrico-eco-park-porto-da-ilha": "barco-eletrico-eco-park-porto-da-ilha",
  "barra-do-sucuri": "barra-do-sucuri",
  "bike-boat-eco-park-porto-da-ilha": "bike-boat-eco-park-porto-da-ilha",
  "bio-park": "bio-park",
  "boca-da-onca-ecotour-trilha-adventure": "boca-da-onca-trilha-adventure-1",
  "boca-da-oncatrilha-adventure-rapel-com-almoço": "boca-da-onca-rapel-trilha-adventure",
  "boia-cross-cabanas": "boia-cross-cabanas",
  "boia-cross-eco-park-porto-da-ilha": "boia-cross-eco-park-porto-da-ilha",
  "bosque-das-águas": "bosque-das-aguas",
  "buraco-das-araras": "buraco-das-araras",
  "cachoeiras-rio-do-peixe": "cachoeiras-rio-do-peixe",
  "cachoeiras-serra-da-bodoquena-com-almoço": "cachoeiras-serra-da-bodoquena-com-almoco",
  "calvagada-parque-ecológico-rio-formoso": "cavalgada-parque-ecologico-rio-formoso",
  "cavalgada-recanto-do-peão": "cavalgada-recanto-do-peao",
  "cavalgada-rio-da-prata": "cavalgada-rio-da-prata",
  "combo-bote-ou-combo-duck-eco-park-porto-da-ilha": "combo-bote-ou-combo-duck-eco-park-porto-da-ilha",
  "cânion-do-rio-salobra": "canions-do-salobra",
  "duck-eco-park-porto-da-ilha": "passeio-de-duck-no-eco-park-porto-da-ilha",
  "eco-serrana-trilhas-e-cachoeiras-com-almoço": "eco-serrana-trilhas-e-cachoeiras-com-almoco",
  "estância-mimosa-com-almoço": "estancia-mimosa",
  "fazenda-ceita-corê": "fazenda-ceita-core",
  "fazenda-san-francisco": "fazenda-san-francisco",
  "flutuação-na-praia-da-figueira-balneário": "flutuacao-praia-da-figueira",
  "formoso-adventure-tirolesa-arvorismo": "formoso-adventure-tirolesa-arvorismo",
  "gruta-da-catedral": "gruta-da-catedral-antiga-gruta-sao-mateus",
  "gruta-de-são-miguel": "gruta-de-sao-miguel",
  "gruta-do-lago-azul": "gruta-do-lago-azul",
  "gruta-do-mimoso": "gruta-do-mimoso",
  "gruta-do-mimoso-1": "mergulho-com-cilindro-gruta-do-mimoso",
  "lagoa-misteriosa": "lagoa-misteriosa",
  "meia-trilha-adventure-buraco-do-macaco-sem-almoço": "boca-da-onca-buraco-do-macaco",
  "mergulho-com-cilindro-discovery-porto-da-ilha": "mergulho-com-cilindro-discovery-porto-da-ilha",
  "mergulho-com-cilindro-lagoa-misteriosa": "mergulho-com-cilindro-lagoa-misteriosa",
  "nascente-azul-combo-adventure": "nascente-azul-combo-adventure",
  "nascente-azul-flutuação-com-balneário": "nascente-azul-flutuacao-com-balneario",
  "nascentes-da-serra": "rio-azul",
  "pantanal-experiência": "pantanal-experiencia",
  "parque-das-cachoeiras": "parque-das-cachoeiras",
  "parque-ecológico-boia-cross": "parque-ecologico-boia-cross",
  "passaporte-eco-park-porto-da-ilha-boia-stand-up": "passaporte-eco-park-porto-da-ilha-boia-stand-up",
  "passeio-de-bote-eco-park-porto-da-ilha": "passeio-de-bote-no-porto-da-ilha",
  "praia-da-figueira": "praia-da-figueira",
  "projeto-jiboia": "projeto-jiboia",
  "projeto-salobra-passeio-encontro-das-águas": "projeto-salobra-passeio-encontro-das-aguas",
  "quadriciclo-rotta-zagaia": "quadriciclo-rotta-zagaia",
  "quadriciclo-serra-da-bodoquena-day-use-no-balneário": "quadriciclo-serra-da-bodoquena",
  "quadriciclo-trilha-boiadeira": "quadriciclo-trilha-boiadeira",
  "quadriciculo-no-estrela-do-formoso": "quadriciclo-balneario-no-estrela-do-formoso",
  "refúgio-da-barra": "refugio-da-barra",
  "rio-da-prata": "rio-da-prata",
  "rio-da-prata-1": "mergulho-com-cilindro-no-rio-da-prata",
  "rio-sucuri": "rio-sucuri",
  "rota-aventura": "rota-aventura",
  "stand-up-paddle-eco-park-porto-da-ilha": "stand-up-paddle-eco-park-porto-da-ilha",
  "trilha-discovery": "boca-da-onca-trilha-discovery",
}

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function readLogFile() {
  const buf = fs.readFileSync(LOG_FILE)
  // download.log gerado no Windows costuma ser UTF-16 LE
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString("utf16le")
  }
  return buf.toString("utf8")
}

function parseDownloadLog() {
  const text = readLogFile()
  const entries = []
  const lines = text.split(/\r?\n/)
  let currentBlogSlug = null

  for (const line of lines) {
    const slugMatch = line.match(/^\[\d+\/\d+\]\s+(.+)$/)
    if (slugMatch) {
      currentBlogSlug = slugMatch[1].trim()
      continue
    }
    const savedMatch = line.match(/salvos em (.+)$/i)
    if (savedMatch && currentBlogSlug) {
      entries.push({
        blogSlug: currentBlogSlug,
        folderPath: savedMatch[1].trim(),
      })
      currentBlogSlug = null
    }
  }
  return entries
}

function resolveFolder(folderPath) {
  if (fs.existsSync(folderPath)) return folderPath

  const trimmed = folderPath.replace(/\.+$/, "")
  if (fs.existsSync(trimmed)) return trimmed

  const baseName = path.basename(folderPath).replace(/\.+$/, "")
  const fromPhotosDir = path.join(PHOTOS_DIR, baseName)
  if (fs.existsSync(fromPhotosDir)) return fromPhotosDir

  // tenta match case-insensitive no diretório de fotos
  const dirs = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
  const target = norm(baseName)
  const match = dirs.find((d) => norm(d.name) === target)
  return match ? path.join(PHOTOS_DIR, match.name) : null
}

function listImageFiles(folderPath) {
  if (!fs.existsSync(folderPath)) return []
  return fs
    .readdirSync(folderPath)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function copyGalleryImages(dbSlug, sourceFolder) {
  const files = listImageFiles(sourceFolder)
  if (files.length === 0) return []

  const destDir = path.join(PUBLIC_TOURS_DIR, dbSlug)
  fs.mkdirSync(destDir, { recursive: true })

  const galleryPaths = []
  for (let i = 0; i < files.length; i++) {
    const ext = path.extname(files[i]).toLowerCase()
    const destName = `${String(i + 1).padStart(3, "0")}${ext}`
    const src = path.join(sourceFolder, files[i])
    const dest = path.join(destDir, destName)
    fs.copyFileSync(src, dest)
    galleryPaths.push(`/images/tours/${dbSlug}/${destName}`)
  }
  return galleryPaths
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const entries = parseDownloadLog()
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data: tours, error: toursError } = await supabase
    .from("tours")
    .select("slug, title")
  if (toursError) throw toursError

  const tourSlugs = new Set(tours.map((t) => t.slug))
  const results = { updated: 0, skipped: 0, errors: [] }

  console.log(`Processando ${entries.length} pastas de fotos...\n`)

  for (const { blogSlug, folderPath } of entries) {
    const dbSlug = BLOG_TO_DB_SLUG[blogSlug] ?? createSlug(blogSlug)

    if (!tourSlugs.has(dbSlug)) {
      results.errors.push(`Sem passeio no banco: blog="${blogSlug}" -> slug="${dbSlug}"`)
      continue
    }

    const resolvedFolder = resolveFolder(folderPath)

    if (!resolvedFolder) {
      results.errors.push(`Pasta não encontrada: ${folderPath}`)
      continue
    }

    const gallery = copyGalleryImages(dbSlug, resolvedFolder)
    if (gallery.length === 0) {
      results.skipped++
      console.log(`  [skip] ${dbSlug} — sem imagens`)
      continue
    }

    console.log(`  [ok] ${dbSlug} — ${gallery.length} imagens`)

    if (!dryRun) {
      const { error } = await supabase
        .from("tours")
        .update({ gallery })
        .eq("slug", dbSlug)
      if (error) {
        results.errors.push(`Erro ao atualizar ${dbSlug}: ${error.message}`)
        continue
      }
    }
    results.updated++
  }

  console.log(`\n--- Resumo ---`)
  console.log(`Atualizados: ${results.updated}`)
  console.log(`Ignorados (sem imagens): ${results.skipped}`)
  if (results.errors.length) {
    console.log(`Erros (${results.errors.length}):`)
    results.errors.forEach((e) => console.log(`  - ${e}`))
  }
  if (dryRun) console.log("\n(dry-run — nenhuma alteração no banco)")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
