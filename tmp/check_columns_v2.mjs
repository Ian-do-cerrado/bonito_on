import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://inknnuxctfwnoswawixt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDE1MzAsImV4cCI6MjA2NDQ3NzUzMH0.TxkpIelTrSUkIINFwiYB9IBxeIM_NGTQ96jnUgokoxE"

async function checkColumns() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase.from("tours").select("*").limit(1)
  if (error) {
    console.error(error)
    return
  }
  if (data && data[0]) {
    console.log("Columns:", Object.keys(data[0]))
  } else {
    console.log("No data in tours table")
  }
}

checkColumns()
