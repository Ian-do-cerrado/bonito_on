import { NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api-client"
import { getAllTours } from "@/services/supabase-tours"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const preferNextSemester = searchParams.get("semester") === "2"
    const supabase = createApiClient()
    const tours = await getAllTours(supabase, preferNextSemester)
    return NextResponse.json(tours)
  } catch (error) {
    console.error("API /api/tours error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tours" },
      { status: 500 }
    )
  }
}
