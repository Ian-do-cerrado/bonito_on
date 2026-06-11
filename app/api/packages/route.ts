import { NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api-client"
import { getAllPackages } from "@/services/supabase-packages"

export async function GET() {
  try {
    const supabase = createApiClient()
    const packages = await getAllPackages(supabase)
    return NextResponse.json(packages)
  } catch (error) {
    console.error("API /api/packages error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch packages" },
      { status: 500 }
    )
  }
}
