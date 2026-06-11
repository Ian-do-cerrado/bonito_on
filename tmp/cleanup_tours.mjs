import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables missing")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanupTours() {
  const { data: tours, error: fetchError } = await supabase
    .from("tours")
    .select("id, title, included")

  if (fetchError) {
    console.error("Error fetching tours:", fetchError)
    process.exit(1)
  }

  console.log(`Found ${tours.length} tours to check.`)

  for (const tour of tours) {
    let included = tour.included || []
    
    // Hardcoded strings in Portuguese, English, Spanish based on standard titles
    const stringsToRemove = [
      "Transporte ida e volta",
      "Round trip transport",
      "Transporte ida y vuelta",
      "includedTransport"
    ]

    const initialCount = included.length
    included = included.filter(item => !stringsToRemove.includes(item))

    if (included.length !== initialCount) {
      console.log(`Cleaning up tour: ${tour.title} (${tour.id})`)
      const { error: updateError } = await supabase
        .from("tours")
        .update({ included })
        .eq("id", tour.id)

      if (updateError) {
        console.error(`Error updating tour ${tour.id}:`, updateError)
      }
    }
  }

  console.log("Cleanup complete.")
}

cleanupTours()
