import { NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api-client"
import { getAllAttractions } from "@/services/supabase-attractions"

export async function GET() {
  try {
    const supabase = createApiClient()
    const attractions = await getAllAttractions(supabase)
    return NextResponse.json(attractions)
  } catch (error) {
    console.error("API /api/attractions error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch attractions" },
      { status: 500 }
    )
  }
}
