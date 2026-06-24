/**
 * Extrai faixas etárias de criança do tarifário tarifariobonitoon.com.br
 * e sincroniza com tours.price_display_overrides no Supabase.
 *
 * Uso:
 *   node scripts/sync-child-ages.mjs           # analisa e gera lib/tour-child-ages-data.ts
 *   node scripts/sync-child-ages.mjs --apply   # também grava no banco
 */
import { createClient } from "@supabase/supabase-js"
import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const DATA_FILE = resolve(ROOT, "lib/tour-child-ages-data.ts")
const INFANT_FILE = resolve(ROOT, "lib/tour-infant-free.ts")
const APPLY = process.argv.includes("--apply")
const FORCE = process.argv.includes("--force")

// --- env ---
const envPath = resolve(ROOT, ".env.local")
try {
  const env = readFileSync(envPath, "utf8")
  for (const line of env.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  }
} catch {
  console.error("Missing .env.local")
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

function normalizeAgeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function extractAllChildRanges(text) {
  const t = normalizeAgeText(text)
  const ranges = []
  const re = /crianc[a-z]*\s*(?:de\s*)?(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?/g
  let m
  while ((m = re.exec(t)) !== null) {
    const childMin = parseInt(m[1], 10)
    const childMax = parseInt(m[2], 10)
    if (childMin <= childMax) ranges.push({ childMin, childMax })
  }
  return ranges
}

function getBaixaTemporadaFocus(text) {
  const t = normalizeAgeText(text)
  const match = t.match(/baixa\s*temporada[\s\S]*?(?=mais valores|alta\s*temporada|$)/i)
  return match ? match[0] : t
}

/** Extrai faixa CHD principal do bloco de baixa temporada (ignora tiers free/infantil). */
function pickPrimaryChildAge(text, postSlug = "") {
  if (!text?.trim()) return null
  const focus = getBaixaTemporadaFocus(text)
  const isMergulho = postSlug.includes("mergulho")

  const fromPatterns = [
    /crianc[a-z]*\s*\+\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*(?:acima|mais)\s*de\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
    /adulto\s*e\s*crianc[a-z]*\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
    /flutuacao\s*\/\s*crianc[a-z]*\s*acima\s*de\s*(\d{1,2})\s*anos?/,
  ]
  for (const re of fromPatterns) {
    const m = focus.match(re)
    if (m) return { childMin: parseInt(m[1], 10), childMax: null }
  }

  const ranges = extractAllChildRanges(focus)
  if (ranges.length) {
    const hasOlderTier =
      ranges.some((r) => r.childMin >= 6) ||
      /crianc[a-z]*\s*(?:mais|acima)\s*de/.test(focus)
    let pool = ranges
    if (hasOlderTier) {
      pool = ranges.filter((r) => !(r.childMax <= 5 && r.childMin < 6))
    }
    if (!pool.length) pool = ranges
    const sorted = [...pool].sort(
      (a, b) => b.childMin - a.childMin || b.childMax - a.childMax
    )
    const main = sorted.find((r) => r.childMin >= 5) ?? sorted[0]
    return { childMin: main.childMin, childMax: main.childMax }
  }

  if (!isMergulho) {
    const minAge = focus.match(/idade\s*minima[:\s]+(\d{1,2})\s*anos?/)
    if (minAge) {
      const n = parseInt(minAge[1], 10)
      if (n <= 12) return { childMin: n, childMax: null }
    }
  }

  return null
}

function pickInfantFree(text) {
  const t = normalizeAgeText(text)
  const m = t.match(
    /crianc[a-z]*\s*(?:de\s*)?0\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?\s*:?\s*free/
  )
  if (m) return { min: 0, max: parseInt(m[1], 10) }
  return null
}

/** Slug da URL do post tarifário → slugs do site bonitoon.com.br */
const TARIFARIO_SLUG_ALIASES = {
  "abismo-anhumas": ["abismo-anhumas", "flutuacao-abismo-anhumas", "mergulho-com-cilindro-abismo-anhumas"],
  "gruta-da-catedral-antiga-gruta-sao-mateus": ["gruta-da-catedral-antiga-gruta-sao-mateus"],
  "gruta-de-sao-miguel": ["gruta-de-sao-miguel"],
  "gruta-do-lago-azul": ["gruta-do-lago-azul"],
  "flutuacao-na-praia-da-figueira-balneario-com-atividades": ["flutuacao-praia-da-figueira", "praia-da-figueira"],
  "rio-azul-fervedouro": ["rio-azul-fervedouro"],
  "gruta-do-mimoso": ["gruta-do-mimoso"],
  "gruta-do-mimoso-1": ["mergulho-com-cilindro-gruta-do-mimoso"],
  "nascente-azul-flutuacao-com-balneario": ["nascente-azul-flutuacao-com-balneario", "nascente-azul-flutuacao-com-balneario-1"],
  "barra-do-sucuri": ["barra-do-sucuri"],
  "lagoa-misteriosa": ["lagoa-misteriosa"],
  "mergulho-com-cilindro-lagoa-misteriosa": ["mergulho-com-cilindro-lagoa-misteriosa"],
  "rio-da-prata": ["rio-da-prata", "mergulho-com-cilindro-no-rio-da-prata", "cavalgada-rio-da-prata", "lobo-guara-bike-adventure-bike-tour-no-rio-da-prata"],
  "rio-sucuri": ["rio-sucuri"],
  "aquario-natural": ["aquario-natural"],
  "canions-do-salobra": ["canions-do-salobra"],
  "eco-serrana-trilhas-e-cachoeiras-com-almoco": ["eco-serrana-trilhas-e-cachoeiras-com-almoco", "eco-serrana"],
  "estancia-mimosa-com-almoco": ["estancia-mimosa", "cavalgada-estancia-mimosa"],
  "parque-das-cachoeiras": ["parque-das-cachoeiras"],
  "cachoeiras-serra-da-bodoquena-com-almoco": ["cachoeiras-serra-da-bodoquena-com-almoco"],
  "boca-da-onca-meia-trilha-buraco-do-macaco": ["boca-da-onca-buraco-do-macaco", "boca-da-onca-meia-trilha-buraco-do-macaco"],
  "boca-da-onca-trilha-discovery": ["boca-da-onca-trilha-discovery"],
  "boca-da-onca-trilha-adventure": ["boca-da-onca-trilha-adventure", "boca-da-onca-trilha-adventure-1", "boca-da-onca-rapel-trilha-adventure"],
  "fazenda-ceita-core": ["fazenda-ceita-core"],
  "cachoeiras-rio-do-peixe": ["cachoeiras-rio-do-peixe"],
  "quadriciclo-balneario-no-estrela-do-formoso": ["quadriciclo-balneario-no-estrela-do-formoso"],
  "combo-bote-ou-combo-duck-eco-park-porto-da-ilha": ["combo-bote-ou-combo-duck-eco-park-porto-da-ilha"],
  "passaporte-eco-park-porto-da-ilha-boiastand-up": ["passaporte-eco-park-porto-da-ilha-boia-stand-up"],
  "bike-boat-eco-park-porto-da-ilha": ["bike-boat-eco-park-porto-da-ilha"],
  "stand-up-paddle-eco-park-porto-da-ilha": ["stand-up-paddle-eco-park-porto-da-ilha"],
  "barco-eletrico-eco-park-porto-da-ilha": ["barco-eletrico-eco-park-porto-da-ilha"],
  "boia-cross-eco-park-porto-da-ilha": ["boia-cross-eco-park-porto-da-ilha"],
  "passeio-de-duck-no-eco-park-porto-da-ilha": ["passeio-de-duck-no-eco-park-porto-da-ilha"],
  "passeio-de-bote-no-porto-da-ilha": ["passeio-de-bote-no-porto-da-ilha", "bonito-passeio-de-bote-no-ilha-bonita"],
  "formoso-adventure-tirolesa-arvorismo": ["formoso-adventure-tirolesa-arvorismo"],
  "parque-ecologico-boia-cross": ["parque-ecologico-boia-cross"],
  "nascente-azul-combo-adventure": ["nascente-azul-combo-adventure"],
  "boia-cross-cabanas": ["boia-cross-cabanas"],
  "cabanas-arvorismo": ["cabanas-arvorismo"],
  "quadriciclo-serra-da-bodoquena-balneario": ["quadriciclo-serra-da-bodoquena"],
  "quadriciclo-trilha-boiadeira": ["quadriciclo-trilha-boiadeira"],
  "quadriciclo-rotta-zagaia": ["quadriciclo-rotta-zagaia"],
  "cavalgada-parque-ecologico-rio-formoso": ["cavalgada-parque-ecologico-rio-formoso"],
  "cavalgada-recanto-do-peao": ["cavalgada-recanto-do-peao"],
  "balneario-nascente-azul": ["balneario-nascente-azul"],
  "balneario-estrela-do-formoso": ["balneario-estrela-do-formoso", "observacao-de-aves-balneario-no-estrela-do-formoso"],
  "bosque-das-aguas": ["bosque-das-aguas"],
  "balneario-ecopark-porto-da-ilha": ["balneario-ecopark-porto-da-ilha"],
  "balneario-municipal": ["balneario-municipal"],
  "balneário-municipal": ["balneario-municipal"],
  "balneario-cachoeiras-serra-da-bodoquena-com-almoco": ["balneario-cachoeiras-serra-da-bodoquena-com-almoco"],
  "balneário-cachoeiras-serra-da-bodoquena-com-almoço": ["balneario-cachoeiras-serra-da-bodoquena-com-almoco"],
  "balneario-jardim-ecopark": ["balneario-jardim-ecopark"],
  "refugio-da-barra": ["refugio-da-barra"],
  "praia-da-figueira": ["praia-da-figueira"],
  "balneario-do-sol": ["balneario-do-sol"],
  "buraco-das-araras": ["buraco-das-araras"],
  "bio-park": ["bio-park"],
  "projeto-jiboia": ["projeto-jiboia"],
  "rota-aventura": ["rota-aventura"],
  "projeto-salobra-passeio-encontro-das-aguas": ["projeto-salobra-passeio-encontro-das-aguas"],
  "fazenda-san-francisco": ["fazenda-san-francisco"],
  "pantanal-experiencia": ["pantanal-experiencia"],
  "mergulho-com-cilindro-no-rio-da-prata": ["mergulho-com-cilindro-no-rio-da-prata"],
  "mergulho-com-cilindro-gruta-do-mimoso": ["mergulho-com-cilindro-gruta-do-mimoso"],
  "mergulho-com-cilindro-discovery-porto-da-ilha": ["mergulho-com-cilindro-discovery-porto-da-ilha"],
}

/** Correções quando um post do tarifário cobre várias atividades com faixas diferentes. */
const SITE_SLUG_OVERRIDES = {
  "abismo-anhumas": { childMin: 5, childMax: 12 },
  "flutuacao-abismo-anhumas": { childMin: 8, childMax: 12 },
  "mergulho-com-cilindro-abismo-anhumas": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-gruta-do-mimoso": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-lagoa-misteriosa": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-no-rio-da-prata": { childMin: 5, childMax: 12 },
  "boca-da-onca-rapel-trilha-adventure": { childMin: 7, childMax: 11 },
  "mergulho-com-cilindro-discovery-porto-da-ilha": { childMin: 5, childMax: 11 },
}

const INFANT_FREE_ALIASES = {
  "eco-serrana-trilhas-e-cachoeiras-com-almoco": ["eco-serrana", "eco-serrana-trilhas-e-cachoeiras-com-almoco"],
  "balneario-municipal": ["balneario-municipal"],
  "balneário-municipal": ["balneario-municipal"],
  "balneario-cachoeiras-serra-da-bodoquena-com-almoco": ["balneario-cachoeiras-serra-da-bodoquena-com-almoco"],
  "balneário-cachoeiras-serra-da-bodoquena-com-almoço": ["balneario-cachoeiras-serra-da-bodoquena-com-almoco"],
}

async function fetchTarifarioPostUrls() {
  const res = await fetch("https://www.tarifariobonitoon.com.br/")
  const html = await res.text()
  const urls = new Set()
  for (const m of html.matchAll(/href="([^"]*\/post\/[^"]+)"/gi)) {
    let u = m[1]
    if (!u.startsWith("http")) {
      u = `https://www.tarifariobonitoon.com.br${u.startsWith("/") ? "" : "/"}${u}`
    }
    urls.add(u.split("?")[0].replace(/\/$/, ""))
  }
  return [...urls]
}

async function fetchTarifarioPost(url) {
  const res = await fetch(url)
  const html = await res.text()
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : ""
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
  const pathSlug = decodeURIComponent(url.split("/post/")[1] || "")
  return { url, title, pathSlug, text }
}

function expandToTourSlugs(tarifarioSlug, ages) {
  const out = {}
  const aliases = TARIFARIO_SLUG_ALIASES[tarifarioSlug]
  if (aliases) {
    for (const s of aliases) out[s] = ages
  } else {
    out[tarifarioSlug] = ages
  }
  return out
}

function expandInfantFree(tarifarioSlug, config) {
  const out = {}
  const aliases = INFANT_FREE_ALIASES[tarifarioSlug] ?? TARIFARIO_SLUG_ALIASES[tarifarioSlug] ?? [tarifarioSlug]
  for (const s of aliases) out[s] = config
  return out
}

function agesToTsValue(ages) {
  if (ages.childMax == null) {
    return `{ childMin: ${ages.childMin}, childMax: null }`
  }
  return `{ childMin: ${ages.childMin}, childMax: ${ages.childMax} }`
}

function writeDataFile(mapping, tourSlugs) {
  const allowed = new Set(tourSlugs)
  const entries = Object.entries(mapping)
    .filter(([slug]) => allowed.has(slug))
    .sort(([a], [b]) => a.localeCompare(b))
  const body = entries.map(([slug, ages]) => `  "${slug}": ${agesToTsValue(ages)},`).join("\n")

  const content = `/**
 * Faixas etárias de criança por passeio, extraídas do tarifário oficial (tarifariobonitoon.com.br).
 * Gerado via: node scripts/sync-child-ages.mjs
 *
 * childMax: null = "a partir de childMin anos"
 */
import type { ChildAgeAges } from "@/lib/child-age-parser"

export const DEFAULT_CHILD_AGES: ChildAgeAges = { childMin: 5, childMax: 12 }

export const TOUR_CHILD_AGE_BY_SLUG: Record<string, ChildAgeAges> = {
${body}
}
`
  writeFileSync(DATA_FILE, content, "utf8")
  console.log(`Wrote ${entries.length} entries → ${DATA_FILE}`)
}

function writeInfantFreeFile(mapping, tourSlugs) {
  const allowed = new Set(tourSlugs)
  const entries = Object.entries(mapping)
    .filter(([slug]) => allowed.has(slug))
    .sort(([a], [b]) => a.localeCompare(b))
  const body = entries.map(([slug, cfg]) => `  "${slug}": { min: ${cfg.min}, max: ${cfg.max} },`).join("\n")
  const content = `export type InfantFreeConfig = {
  min: number
  max: number
}

/** Passeios com crianças gratuitas em faixa etária inferior à tarifa CHD. */
export const TOUR_INFANT_FREE_BY_SLUG: Record<string, InfantFreeConfig> = {
${body}
}

export function resolveInfantFree(tourSlug?: string): InfantFreeConfig | null {
  if (!tourSlug) return null
  return TOUR_INFANT_FREE_BY_SLUG[tourSlug] ?? null
}

export function formatInfantFreeLabel(config: InfantFreeConfig): string {
  return \`\${config.min} a \${config.max} anos\`
}
`
  writeFileSync(INFANT_FILE, content, "utf8")
  console.log(`Wrote ${entries.length} infant-free entries → ${INFANT_FILE}`)
}

function formatChildAgeLabel(ages) {
  if (ages?.childMin == null && ages?.childMin !== 0) return "Crianças (5-12 anos)"
  const min = ages.childMin
  if (ages.childMax == null) return `Crianças (a partir de ${min} anos)`
  return `Criança de ${min} a ${ages.childMax} anos`
}

async function applyToDatabase(mapping, tours) {
  let updated = 0
  let skipped = 0

  for (const tour of tours) {
    const ages = mapping[tour.slug]
    if (!ages) {
      skipped++
      continue
    }

    const existing = tour.price_display_overrides ?? {}
    const s1Ages = existing.s1?.ages
    if (!FORCE && s1Ages?.childMin != null) {
      skipped++
      continue
    }

    const criancaLabel = formatChildAgeLabel(ages)
    const next = {
      ...existing,
      s1: {
        ...(existing.s1 ?? {}),
        ages,
        labels: {
          ...(existing.s1?.labels ?? {}),
          crianca: criancaLabel,
        },
      },
      s2: {
        ...(existing.s2 ?? {}),
        ages: existing.s2?.ages ?? ages,
        labels: {
          ...(existing.s2?.labels ?? {}),
          crianca: existing.s2?.labels?.crianca ?? criancaLabel,
        },
      },
    }

    const { error } = await supabase
      .from("tours")
      .update({ price_display_overrides: next })
      .eq("id", tour.id)

    if (error) {
      console.error(`Failed ${tour.slug}:`, error.message)
    } else {
      updated++
    }
  }

  console.log(`DB: updated=${updated}, skipped=${skipped}`)
}

async function main() {
  const { data: tours, error } = await supabase
    .from("tours")
    .select("id, slug, title, price_display_overrides")
    .order("title")

  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(`Loaded ${tours.length} tours`)

  const mapping = {}
  const infantFree = {}
  let posts = []

  try {
    const urls = await fetchTarifarioPostUrls()
    console.log(`Fetching ${urls.length} tarifario posts...`)
    for (const url of urls) {
      try {
        const post = await fetchTarifarioPost(url)
        if (post.text.includes("Não foi possível encontrar esta página")) continue
        posts.push(post)
        await new Promise((r) => setTimeout(r, 150))
      } catch (e) {
        console.warn(`  skip ${url}: ${e.message}`)
      }
    }
    console.log(`Parsed ${posts.length} tarifario posts`)
  } catch (e) {
    console.warn("Could not fetch tarifario:", e.message)
  }

  for (const post of posts) {
    const slugKeys = [post.pathSlug, createSlug(post.title)].filter(Boolean)
    const ages = pickPrimaryChildAge(post.text, post.pathSlug)
    const infant = pickInfantFree(post.text)

    if (ages) {
      for (const key of slugKeys) {
        Object.assign(mapping, expandToTourSlugs(key, ages))
      }
    }
    if (infant) {
      for (const key of slugKeys) {
        Object.assign(infantFree, expandInfantFree(key, infant))
      }
    }
  }

  Object.assign(mapping, SITE_SLUG_OVERRIDES)

  for (const tour of tours) {
    if (!mapping[tour.slug]) {
      const tourSlugNorm = createSlug(tour.title)
      for (const post of posts) {
        const ages = pickPrimaryChildAge(post.text, post.pathSlug)
        if (!ages) continue
        const keys = [post.pathSlug, createSlug(post.title)]
        if (keys.some((k) => tourSlugNorm.includes(k) || k.includes(tourSlugNorm))) {
          mapping[tour.slug] = ages
          break
        }
      }
    }
  }

  for (const tour of tours) {
    if (!mapping[tour.slug]) {
      mapping[tour.slug] = { childMin: 5, childMax: 12 }
    }
  }

  writeDataFile(mapping, tours.map((t) => t.slug))
  if (Object.keys(infantFree).length) writeInfantFreeFile(infantFree, tours.map((t) => t.slug))

  console.log("\nSample mappings:")
  for (const slug of [
    "rio-sucuri",
    "barra-do-sucuri",
    "gruta-do-lago-azul",
    "flutuacao-abismo-anhumas",
    "balneario-municipal",
    "estancia-mimosa",
  ]) {
    console.log(`  ${slug}:`, JSON.stringify(mapping[slug]))
  }

  const nonDefault = Object.entries(mapping).filter(
    ([, a]) => !(a.childMin === 5 && a.childMax === 12)
  )
  console.log(`\nNon-default (not 5-12): ${nonDefault.length}/${Object.keys(mapping).length}`)

  if (APPLY) {
    await applyToDatabase(mapping, tours)
  } else {
    console.log("\nRun with --apply --force to persist price_display_overrides in Supabase")
  }
}

main()
