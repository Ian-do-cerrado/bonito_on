"use server"

import { createClient } from "@/lib/supabase/server"
import { mapDatabaseTour2ToTourData } from "@/lib/supabase/tours-2"
import { cookies } from "next/headers"

export async function getPasseiosValorFuturoPublic() {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tours_2")
    .select(
      `
      *
    `,
    )

  if (error) {
    console.error("Error fetching valor futuro tours:", error)
    return { data: [], error }
  }

  const result = data.map(mapDatabaseTour2ToTourData)
  return { data: result, error: null }
}