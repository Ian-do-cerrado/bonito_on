import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://inknnuxctfwnoswawixt.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw"

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
