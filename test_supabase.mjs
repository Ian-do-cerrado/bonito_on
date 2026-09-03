import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://inknnuxctfwnoswawixt.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY não definida")

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function test() {
  const { data: tour, error: fetchError } = await supabase.from("tours").select("id").limit(1).single()
  
  if (fetchError) {
    console.error("Fetch error:", fetchError)
    return
  }
  
  console.log("Found tour:", tour.id)
  
  const { error } = await supabase.from("tours").update({
    preferred_ms_tabela: null
  }).eq("id", tour.id)
  
  if (error) {
    console.error("Update error:", error)
  } else {
    console.log("Update successful!")
  }
}

test()
