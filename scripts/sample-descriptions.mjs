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

async function main() {
  const { data, error } = await supabase
    .from("tours")
    .select("slug, title, description")
    .limit(5)
  if (error) {
    console.error(error)
    process.exit(1)
  }
  for (const t of data) {
    console.log("===", t.title, "===")
    console.log((t.description || "").slice(0, 800))
    console.log()
  }
}

main()
