import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // We'll skip the RPC approach and directly test each table
    const tablesList: string[] = []
    const errors: string[] = []

    // Try to fetch data from tables if they exist
    let toursData = null
    let packagesData = null
    let attractionsData = null

    // Check if tours table exists and fetch data
    try {
      const { data, error } = await supabase.from("tours").select("*").limit(3)
      if (error) {
        errors.push(`Tours error: ${error.message}`)
      } else {
        toursData = data
        tablesList.push("tours")
      }
    } catch (err) {
      errors.push(`Tours exception: ${err instanceof Error ? err.message : "Unknown error"}`)
    }

    // Check if packages table exists and fetch data
    try {
      const { data, error } = await supabase.from("packages").select("*").limit(3)
      if (error) {
        errors.push(`Packages error: ${error.message}`)
      } else {
        packagesData = data
        tablesList.push("packages")
      }
    } catch (err) {
      errors.push(`Packages exception: ${err instanceof Error ? err.message : "Unknown error"}`)
    }

    // Check if attractions table exists and fetch data
    try {
      const { data, error } = await supabase.from("attractions").select("*").limit(3)
      if (error) {
        errors.push(`Attractions error: ${error.message}`)
      } else {
        attractionsData = data
        tablesList.push("attractions")
      }
    } catch (err) {
      errors.push(`Attractions exception: ${err instanceof Error ? err.message : "Unknown error"}`)
    }

    // Check if package_highlights table exists
    try {
      const { data, error } = await supabase.from("package_highlights").select("*").limit(1)
      if (!error) {
        tablesList.push("package_highlights")
      }
    } catch (err) {
      // Ignore errors for secondary tables
    }

    // Check if package_included table exists
    try {
      const { data, error } = await supabase.from("package_included").select("*").limit(1)
      if (!error) {
        tablesList.push("package_included")
      }
    } catch (err) {
      // Ignore errors for secondary tables
    }

    // Check if package_best_seasons table exists
    try {
      const { data, error } = await supabase.from("package_best_seasons").select("*").limit(1)
      if (!error) {
        tablesList.push("package_best_seasons")
      }
    } catch (err) {
      // Ignore errors for secondary tables
    }

    // Check if attraction_highlights table exists
    try {
      const { data, error } = await supabase.from("attraction_highlights").select("*").limit(1)
      if (!error) {
        tablesList.push("attraction_highlights")
      }
    } catch (err) {
      // Ignore errors for secondary tables
    }

    // Check connection status
    const connectionSuccess = tablesList.length > 0

    return NextResponse.json({
      success: connectionSuccess,
      message: connectionSuccess
        ? `Connected to Supabase. Found ${tablesList.length} tables.`
        : "Connected to Supabase but no expected tables were found.",
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      },
      availableTables: tablesList,
      data: {
        tours: toursData,
        packages: packagesData,
        attractions: attractionsData,
      },
      counts: {
        tours: toursData?.length || 0,
        packages: packagesData?.length || 0,
        attractions: attractionsData?.length || 0,
      },
      errors: errors.length > 0 ? errors : null,
    })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to connect to Supabase",
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
        },
      },
      { status: 500 },
    )
  }
}
