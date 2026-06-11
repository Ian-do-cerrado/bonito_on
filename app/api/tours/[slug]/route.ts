import { NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api-client"
import { getTourBySlug } from "@/services/supabase-tours"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 })
    }
    const { searchParams } = new URL(request.url)
    const preferNextSemester = searchParams.get("semester") === "2"
    const supabase = createApiClient()
    const tour = await getTourBySlug(slug, supabase, preferNextSemester)
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }
    return NextResponse.json(tour)
  } catch (error) {
    console.error("API /api/tours/[slug] error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tour" },
      { status: 500 }
    )
  }
}
