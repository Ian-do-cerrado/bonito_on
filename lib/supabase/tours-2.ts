import { createClient } from "@/lib/supabase/client"
import { DatabaseTour2, Tour2Data } from "@/lib/supabase/types"
import { mapDatabaseTour2ToTourData } from "@/lib/supabase/server-utils"

const supabase = createClient()

export async function getAllTours2(): Promise<Tour2Data[]> {
  try {
    console.log("🚀 Carregando tours 2 do Supabase...")

    const { data, error } = await supabase.from("tours_2").select("*, duration").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar tours 2:", error)
      return []
    }

    console.log("📊 Tours 2 carregados:", data?.length || 0)

    if (!data || data.length === 0) {
      console.log("⚠️ Nenhum tour 2 encontrado no Supabase")
      return []
    }

    // Transformar os dados para o formato esperado
    const tours: Tour2Data[] = data.reduce((acc: Tour2Data[], tour: DatabaseTour2) => {
      try {
        const mappedTour: Tour2Data = mapDatabaseTour2ToTourData(tour)
        acc.push(mappedTour)
      } catch (e) {
        console.error("❌ Erro ao processar o tour 2:", tour.id, e)
      }
      return acc
    }, [])

    return tours
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tours 2:", error)
    return []
  }
}

export async function getTour2BySlug(slug: string): Promise<Tour2Data | null> {
  try {
    console.log("🔍 Buscando tour 2 por slug:", slug)

    const { data, error } = await supabase.from("tours_2").select("*, duration").eq("slug", slug).single()

    if (error) {
      console.error("❌ Erro ao buscar tour 2 por slug:", error)
      return null
    }

    if (!data) {
      console.log("⚠️ Tour 2 não encontrado para slug:", slug)
      return null
    }

    // Transformar os dados para o formato esperado
    const tour: Tour2Data = mapDatabaseTour2ToTourData(data)

    console.log("✅ Tour 2 encontrado:", tour.title)
    return tour
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar tour 2 por slug:", error)
    return null
  }
}