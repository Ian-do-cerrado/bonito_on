import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://inknnuxctfwnoswawixt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDE1MzAsImV4cCI6MjA2NDQ3NzUzMH0.TxkpIelTrSUkIINFwiYB9IBxeIM_NGTQ96jnUgokoxE"

async function debugPortoPrices() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase
    .from("atrativo_atividade_precos")
    .select("*")
    .ilike("atrativo", "%porto da ilha%")
    .ilike("nome_tabela_preco", "%COMBO BOTE 2026 - 2 SEMESTRE AT%")

  if (error) {
    console.error(error)
    return
  }

  console.log("Full data for missing row:")
  console.log(JSON.stringify(data[0], null, 2))
}

debugPortoPrices()
