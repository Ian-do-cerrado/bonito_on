"use server"

import { createClient } from "@/lib/supabase/server"
import { getAllTours } from "@/services/supabase-tours"
import { getAllPackages } from "@/services/supabase-packages"
import { getAllAttractions } from "@/services/supabase-attractions"
import { getAllBlogPosts } from "@/services/supabase-blog"
import { PUBLIC_DEFAULT_PREFER_S2 } from "@/lib/semester-config"

export async function fetchAllAdminData() {
  try {
    const supabase = await createClient()

    // Fetch sequentially to prevent connection pool exhaustion on Vercel
    const toursData = await getAllTours(supabase, PUBLIC_DEFAULT_PREFER_S2)
    const packagesData = await getAllPackages(supabase)
    const attractionsData = await getAllAttractions(supabase)
    const blogData = await getAllBlogPosts(supabase)

    return { 
      toursData, 
      packagesData, 
      attractionsData, 
      blogData 
    }
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return {
      toursData: [],
      packagesData: [],
      attractionsData: [],
      blogData: []
    }
  }
}
