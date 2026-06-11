import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { improveDescriptionFormatting } from "@/lib/description-cleaner"

export async function POST() {
  try {
    const supabase = await createClient()

    const { data: tours, error } = await supabase.from("tours").select("id, title, description")

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    let updated = 0
    const errors: string[] = []

    for (const tour of tours ?? []) {
      const improved = improveDescriptionFormatting(tour.description ?? "")
      if (improved !== (tour.description ?? "")) {
        const { error: updateError } = await supabase
          .from("tours")
          .update({ description: improved })
          .eq("id", tour.id)

        if (updateError) {
          errors.push(`${tour.title}: ${updateError.message}`)
        } else {
          updated++
        }
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      total: tours?.length ?? 0,
      errors,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}
