import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
