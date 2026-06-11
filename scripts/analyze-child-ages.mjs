import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, "../.env.local")
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

/** Parse faixa etária de criança a partir de texto livre (descrições BTMS/tarifário). */
function parseChildAgeRange(text) {
  if (!text) return null
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  // "crianca de 6 a 11 anos", "criancas 05 a 12 ano", "de 7 a 11 anos"
  const rangePatterns = [
    /crianc[a-z]*\s*(?:de\s*)?(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?/,
    /(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?\s*(?:\(|\/)?\s*crianc/,
    /crianc[a-z]*\s*(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*ano\b/,
  ]
  for (const re of rangePatterns) {
    const m = t.match(re)
    if (m) return { childMin: parseInt(m[1], 10), childMax: parseInt(m[2], 10), source: "range" }
  }

  // "a partir de 6 anos", "apartir de 4 anos"
  const fromPatterns = [
    /crianc[a-z]*\s*(?:a\s*)?partir\s*de\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*(?:de\s*)?(\d{1,2})\s*anos?\s*(?:ou\s*mais|em\s*diante)/,
    /(?:adulto\s*e\s*)?crianc[a-z]*\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
  ]
  for (const re of fromPatterns) {
    const m = t.match(re)
    if (m) {
      const min = parseInt(m[1], 10)
      return { childMin: min, childMax: min >= 12 ? 17 : 11, source: "from" }
    }
  }

  return null
}

async function main() {
  const { data: tours, error: toursErr } = await supabase
    .from("tours")
    .select("id, slug, title, description, price_display_overrides, btms_atrativo_override")
    .order("title")

  if (toursErr) {
    console.error(toursErr)
    process.exit(1)
  }

  const { data: prices, error: pricesErr } = await supabase
    .from("atrativo_atividade_precos")
    .select("atrativo, atividade, descricao")

  if (pricesErr) {
    console.error(pricesErr)
    process.exit(1)
  }

  console.log(`Tours: ${tours.length}, BTMS rows: ${prices.length}\n`)

  const results = []
  for (const tour of tours) {
    const existing = tour.price_display_overrides?.s1?.ages
    const fromDesc = parseChildAgeRange(tour.description)

    // Match BTMS rows by atrativo override or title similarity
    const titleLower = tour.title.toLowerCase()
    const atrOverride = (tour.btms_atrativo_override || "").toLowerCase()
    const matchingRows = prices.filter((r) => {
      const atr = (r.atrativo || "").toLowerCase()
      const ativ = (r.atividade || "").toLowerCase()
      if (atrOverride && atr.includes(atrOverride)) return true
      if (titleLower.includes(atr) || atr.includes(titleLower.split(" ")[0])) return true
      if (titleLower.includes(ativ) || ativ.includes(titleLower.split(" ")[0])) return true
      return false
    })

    let fromBtms = null
    for (const row of matchingRows) {
      const parsed = parseChildAgeRange(row.descricao)
      if (parsed) {
        fromBtms = { ...parsed, atrativo: row.atrativo, atividade: row.atividade }
        break
      }
    }

    const best = fromDesc || (fromBtms ? { childMin: fromBtms.childMin, childMax: fromBtms.childMax, source: "btms" } : null)

    results.push({
      slug: tour.slug,
      title: tour.title,
      existing: existing ? `${existing.childMin}-${existing.childMax}` : null,
      parsed: best ? `${best.childMin}-${best.childMax} (${best.source})` : "NOT FOUND",
      defaultWouldShow: "5-12",
    })
  }

  console.log("slug | title | existing | parsed | default")
  console.log("-".repeat(100))
  for (const r of results) {
    console.log(`${r.slug} | ${r.title.slice(0, 40)} | ${r.existing ?? "—"} | ${r.parsed} | ${r.defaultWouldShow}`)
  }

  const missing = results.filter((r) => r.parsed === "NOT FOUND")
  const wrongDefault = results.filter((r) => r.parsed !== "NOT FOUND" && !r.parsed.startsWith("5-12"))
  console.log(`\nParsed: ${results.length - missing.length}/${results.length}`)
  console.log(`Would differ from default 5-12: ${wrongDefault.length}`)
  console.log(`Missing: ${missing.length}`)
  if (missing.length) {
    console.log("\nMissing tours:")
    missing.forEach((m) => console.log(`  - ${m.title} (${m.slug})`))
  }
}

main()
