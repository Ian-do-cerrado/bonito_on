import { HomeContent } from "./home-content"
import { createApiClient } from "@/lib/supabase/api-client"
import { getAllTours } from "@/services/supabase-tours"
import { getAllPackages } from "@/services/supabase-packages"
import { getAllAttractions } from "@/services/supabase-attractions"

// ISR: página fica em cache e é revalidada a cada 2min, em vez de rodar
// as 3 queries ao Supabase em toda visita (era a maior fonte de consumo
// de Fluid Active CPU, já que é a página mais visitada do site).
// Edições feitas no admin de passeios já disparam revalidatePath("/") via
// app/actions/tour-admin.ts e settings.ts, então o conteúdo de tours segue
// atualizando na hora; pacotes/atrações usam o fallback de 2min.
export const revalidate = 120

export default async function HomePage() {
  const supabase = createApiClient()
  const [tours, packages, attractions] = await Promise.all([
    getAllTours(supabase, true).catch(() => []),
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
