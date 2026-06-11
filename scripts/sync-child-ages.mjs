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

function parseChildAgeFromText(text) {
  if (!text?.trim()) return null
  const t = normalizeAgeText(text)

  const rangePatterns = [
    /crianc[a-z]*\s*(?:de\s*)?(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*ano\b/,
    /(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?\s*(?:\(|\/)?\s*crianc/,
  ]
  for (const re of rangePatterns) {
    const m = t.match(re)
    if (m) {
      const childMin = parseInt(m[1], 10)
      const childMax = parseInt(m[2], 10)
      if (childMin <= childMax) return { childMin, childMax }
    }
  }

  const fromPatterns = [
    /crianc[a-z]*\s*(?:a\s*)?partir\s*de\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*\+\s*(\d{1,2})\s*anos?/,
    /(?:adulto\s*e\s*)?crianc[a-z]*\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
    /crianca\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
    /idade\s*minima[:\s]+(\d{1,2})\s*anos?\s*de\s*idade/,
    /garupas?\s*(?:sao\s*)?(?:permitidas\s*)?a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
  ]
  for (const re of fromPatterns) {
    const m = t.match(re)
    if (m) return { childMin: parseInt(m[1], 10), childMax: null }
  }

  return null
}

/** Slug do header tarifário → slugs do site que herdam a mesma faixa */
const TARIFARIO_SLUG_ALIASES = {
  "abismo-anhumas": ["abismo-anhumas", "flutuacao-abismo-anhumas", "mergulho-com-cilindro-abismo-anhumas"],
  "gruta-da-catedral-antiga-gruta-sao-mateus": ["gruta-da-catedral-antiga-gruta-sao-mateus"],
  "gruta-de-sao-miguel": ["gruta-de-sao-miguel"],
  "gruta-do-lago-azul": ["gruta-do-lago-azul"],
  "flutuacao-na-praia-da-figueira-balneario-com-atividades": [
    "flutuacao-praia-da-figueira",
    "praia-da-figueira",
  ],
  "rio-azul-fervedouro": ["rio-azul-fervedouro"],
  "gruta-do-mimoso": ["gruta-do-mimoso", "mergulho-com-cilindro-gruta-do-mimoso"],
  "nascente-azul-flutuacao-com-balneario": [
    "nascente-azul-flutuacao-com-balneario",
    "nascente-azul-flutuacao-com-balneario-1",
  ],
  "barra-do-sucuri": ["barra-do-sucuri"],
  "lagoa-misteriosa-flutuacao": ["lagoa-misteriosa", "mergulho-com-cilindro-lagoa-misteriosa"],
  "rio-da-prata": ["rio-da-prata", "mergulho-com-cilindro-no-rio-da-prata", "cavalgada-rio-da-prata"],
  "rio-sucuri": ["rio-sucuri"],
  "aquario-natural": ["aquario-natural"],
  "canions-do-salobra": ["canions-do-salobra"],
  "eco-serrana-trilhas-e-cachoeiras-com-almoco": [
    "eco-serrana-trilhas-e-cachoeiras-com-almoco",
    "eco-serrana",
  ],
  "estancia-mimosa-com-almoco": ["estancia-mimosa", "cavalgada-estancia-mimosa"],
  "parque-das-cachoeiras": ["parque-das-cachoeiras"],
  "cachoeiras-serra-da-bodoquena-com-almoco": ["cachoeiras-serra-da-bodoquena-com-almoco"],
  "boca-da-onca-meia-trilha-buraco-do-macaco": ["boca-da-onca-buraco-do-macaco"],
  "boca-da-onca-trilha-discovery": ["boca-da-onca-trilha-discovery"],
  "boca-da-onca-trilha-adventure": [
    "boca-da-onca-trilha-adventure",
    "boca-da-onca-trilha-adventure-1",
    "boca-da-onca-rapel-trilha-adventure",
  ],
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
  "parque-ecologico-rio-formoso-formoso-adventure-tirolesa-arvorismo": [
    "formoso-adventure-tirolesa-arvorismo",
  ],
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
  "balneario-cachoeiras-serra-da-bodoquena-com-almoco": ["balneario-cachoeiras-serra-da-bodoquena-com-almoco"],
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
}

/** Faixas confirmadas no tarifário tarifariobonitoon.com.br (1º semestre 2026). */
const TARIFARIO_CHILD_AGES = {
  "abismo-anhumas": { childMin: 5, childMax: 12 },
  "flutuacao-abismo-anhumas": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-abismo-anhumas": { childMin: 5, childMax: 12 },
  "gruta-do-lago-azul": { childMin: 6, childMax: null },
  "gruta-de-sao-miguel": { childMin: 5, childMax: 12 },
  "gruta-da-catedral-antiga-gruta-sao-mateus": { childMin: 5, childMax: 12 },
  "gruta-do-mimoso": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-gruta-do-mimoso": { childMin: 5, childMax: 12 },
  "rio-sucuri": { childMin: 4, childMax: null },
  "barra-do-sucuri": { childMin: 5, childMax: 12 },
  "rio-da-prata": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-no-rio-da-prata": { childMin: 5, childMax: 12 },
  "cavalgada-rio-da-prata": { childMin: 5, childMax: 12 },
  "lobo-guara-bike-adventure-bike-tour-no-rio-da-prata": { childMin: 5, childMax: 12 },
  "aquario-natural": { childMin: 5, childMax: 12 },
  "lagoa-misteriosa": { childMin: 5, childMax: 12 },
  "mergulho-com-cilindro-lagoa-misteriosa": { childMin: 5, childMax: 12 },
  "nascente-azul-flutuacao-com-balneario": { childMin: 5, childMax: 12 },
  "nascente-azul-flutuacao-com-balneario-1": { childMin: 5, childMax: 12 },
  "flutuacao-praia-da-figueira": { childMin: 5, childMax: 12 },
  "praia-da-figueira": { childMin: 5, childMax: 12 },
  "rio-azul-fervedouro": { childMin: 5, childMax: 12 },
  "canions-do-salobra": { childMin: 8, childMax: null },
  "eco-serrana": { childMin: 6, childMax: 11 },
  "eco-serrana-trilhas-e-cachoeiras-com-almoco": { childMin: 6, childMax: 11 },
  "estancia-mimosa": { childMin: 6, childMax: 11 },
  "cavalgada-estancia-mimosa": { childMin: 6, childMax: 11 },
  "parque-das-cachoeiras": { childMin: 6, childMax: 11 },
  "cachoeiras-serra-da-bodoquena-com-almoco": { childMin: 6, childMax: 11 },
  "boca-da-onca-buraco-do-macaco": { childMin: 7, childMax: 11 },
  "boca-da-onca-trilha-discovery": { childMin: 7, childMax: 11 },
  "boca-da-onca-trilha-adventure": { childMin: 7, childMax: 11 },
  "boca-da-onca-trilha-adventure-1": { childMin: 7, childMax: 11 },
  "boca-da-onca-rapel-trilha-adventure": { childMin: 7, childMax: 11 },
  "fazenda-ceita-core": { childMin: 5, childMax: 12 },
  "cachoeiras-rio-do-peixe": { childMin: 6, childMax: 12 },
  "passaporte-eco-park-porto-da-ilha-boia-stand-up": { childMin: 5, childMax: 11 },
  "bike-boat-eco-park-porto-da-ilha": { childMin: 5, childMax: 11 },
  "stand-up-paddle-eco-park-porto-da-ilha": { childMin: 5, childMax: 11 },
  "barco-eletrico-eco-park-porto-da-ilha": { childMin: 5, childMax: 11 },
  "boia-cross-eco-park-porto-da-ilha": { childMin: 5, childMax: 11 },
  "passeio-de-duck-no-eco-park-porto-da-ilha": { childMin: 5, childMax: 11 },
  "passeio-de-bote-no-porto-da-ilha": { childMin: 5, childMax: 11 },
  "bonito-passeio-de-bote-no-ilha-bonita": { childMin: 5, childMax: 11 },
  "combo-bote-ou-combo-duck-eco-park-porto-da-ilha": { childMin: 5, childMax: 11 },
  "mergulho-com-cilindro-discovery-porto-da-ilha": { childMin: 5, childMax: 11 },
  "balneario-ecopark-porto-da-ilha": { childMin: 5, childMax: 11 },
  "formoso-adventure-tirolesa-arvorismo": { childMin: 5, childMax: 12 },
  "parque-ecologico-boia-cross": { childMin: 5, childMax: 12 },
  "boia-cross-cabanas": { childMin: 5, childMax: 11 },
  "cabanas-arvorismo": { childMin: 5, childMax: 11 },
  "quadriciclo-serra-da-bodoquena": { childMin: 6, childMax: null },
  "quadriciclo-trilha-boiadeira": { childMin: 6, childMax: null },
  "quadriciclo-rotta-zagaia": { childMin: 6, childMax: null },
  "quadriciclo-balneario-no-estrela-do-formoso": { childMin: 6, childMax: null },
  "cavalgada-parque-ecologico-rio-formoso": { childMin: 5, childMax: 12 },
  "cavalgada-recanto-do-peao": { childMin: 5, childMax: 12 },
  "balneario-nascente-azul": { childMin: 5, childMax: 11 },
  "balneario-estrela-do-formoso": { childMin: 5, childMax: 12 },
  "observacao-de-aves-balneario-no-estrela-do-formoso": { childMin: 5, childMax: 12 },
  "bosque-das-aguas": { childMin: 5, childMax: 12 },
  "balneario-municipal": { childMin: 5, childMax: 11 },
  "balneario-cachoeiras-serra-da-bodoquena-com-almoco": { childMin: 6, childMax: null },
  "balneario-jardim-ecopark": { childMin: 5, childMax: 12 },
  "refugio-da-barra": { childMin: 5, childMax: 12 },
  "balneario-do-sol": { childMin: 5, childMax: 11 },
  "buraco-das-araras": { childMin: 5, childMax: 12 },
  "bio-park": { childMin: 5, childMax: 12 },
  "projeto-jiboia": { childMin: 5, childMax: 12 },
  "nascente-azul-combo-adventure": { childMin: 5, childMax: 12 },
  "rota-aventura": { childMin: 5, childMax: 12 },
  "projeto-salobra-passeio-encontro-das-aguas": { childMin: 5, childMax: 12 },
  "fazenda-san-francisco": { childMin: 5, childMax: 12 },
  "pantanal-experiencia": { childMin: 5, childMax: 12 },
}

async function fetchTarifarioSections() {
  const res = await fetch("https://www.tarifariobonitoon.com.br/")
  const html = await res.text()

  const sections = []

  // Wix: títulos em <h2> ou data com class rich-text
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi
  let hm
  const h2Titles = []
  while ((hm = h2Re.exec(html)) !== null) {
    const title = hm[1].replace(/<[^>]+>/g, "").trim()
    if (title && !title.includes("Confira o Tarif")) h2Titles.push({ title, index: hm.index })
  }

  for (let i = 0; i < h2Titles.length; i++) {
    const start = h2Titles[i].index
    const end = h2Titles[i + 1]?.index ?? html.length
    const chunk = html.slice(start, end)
    const body = chunk.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
    sections.push({ title: h2Titles[i].title, body, slug: createSlug(h2Titles[i].title) })
  }

  return sections
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

function agesToTsValue(ages) {
  if (ages.childMax == null) {
    return `{ childMin: ${ages.childMin}, childMax: null }`
  }
  return `{ childMin: ${ages.childMin}, childMax: ${ages.childMax} }`
}

function writeDataFile(mapping) {
  const entries = Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b))
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

    const next = {
      ...existing,
      s1: {
        ...(existing.s1 ?? {}),
        ages,
      },
      s2: {
        ...(existing.s2 ?? {}),
        ages: existing.s2?.ages ?? ages,
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

  let sections = []
  try {
    sections = await fetchTarifarioSections()
    console.log(`Tarifario sections parsed: ${sections.length}`)
  } catch (e) {
    console.warn("Could not fetch tarifario live:", e.message)
  }

  const mapping = { ...TARIFARIO_CHILD_AGES }

  for (const section of sections) {
    const ages = parseChildAgeFromText(section.body)
    if (!ages) continue
    Object.assign(mapping, expandToTourSlugs(section.slug, ages))
  }

  // Match remaining tours by title similarity to tarifario sections
  for (const tour of tours) {
    if (mapping[tour.slug]) continue
    const tourSlugNorm = createSlug(tour.title)
    for (const section of sections) {
      const ages = parseChildAgeFromText(section.body)
      if (!ages) continue
      const secSlug = section.slug
      if (
        tourSlugNorm.includes(secSlug) ||
        secSlug.includes(tourSlugNorm) ||
        createSlug(section.title) === tourSlugNorm
      ) {
        mapping[tour.slug] = ages
        break
      }
    }
  }

  // Default 5-12 for tours still missing (common Bonito standard when no info)
  for (const tour of tours) {
    if (!mapping[tour.slug]) {
      mapping[tour.slug] = { childMin: 5, childMax: 12 }
    }
  }

  writeDataFile(mapping)

  console.log("\nSample mappings:")
  for (const slug of ["rio-sucuri", "gruta-do-lago-azul", "estancia-mimosa", "canions-do-salobra"]) {
    console.log(`  ${slug}:`, JSON.stringify(mapping[slug]))
  }

  const nonDefault = Object.entries(mapping).filter(
    ([, a]) => !(a.childMin === 5 && a.childMax === 12)
  )
  console.log(`\nNon-default (not 5-12): ${nonDefault.length}/${Object.keys(mapping).length}`)

  if (APPLY) {
    await applyToDatabase(mapping, tours)
  } else {
    console.log("\nRun with --apply to persist price_display_overrides in Supabase")
  }
}

main()
