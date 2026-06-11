import { HomeContent } from "./home-content"
import { createApiClient } from "@/lib/supabase/api-client"
import { getAllTours } from "@/services/supabase-tours"
import { getAllPackages } from "@/services/supabase-packages"
import { getAllAttractions } from "@/services/supabase-attractions"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = createApiClient()
  const [tours, packages, attractions] = await Promise.all([
    getAllTours(supabase).catch(() => []),
    getAllPackages(supabase).catch(() => []),
    getAllAttractions(supabase).catch(() => []),
  ])

  return (
    <HomeContent
      initialTours={tours}
      initialPackages={packages}
      initialAttractions={attractions}
    />
  )
}
