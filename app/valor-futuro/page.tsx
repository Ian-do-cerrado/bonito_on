import { getPasseiosValorFuturoPublic } from "@/lib/supabase/valor-futuro"
import { ClientValorFuturoPage } from "./client-page-content"

export default async function ValorFuturoPage() {
  const { data: initialTours, error } = await getPasseiosValorFuturoPublic()

  if (error) {
    console.error("Error fetching initial tours for server component:", error)
    // You might want to display an error message or a fallback UI
    return <div>Error loading tours: {error.message}</div>
  }

  return <ClientValorFuturoPage initialTours={initialTours || []} />
}
