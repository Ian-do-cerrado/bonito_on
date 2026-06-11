const { createClient } = require('@supabase/supabase-js');

function createSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const supabaseUrl = 'https://inknnuxctfwnoswawixt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDE1MzAsImV4cCI6MjA2NDQ3NzUzMH0.TxkpIelTrSUkIINFwiYB9IBxeIM_NGTQ96jnUgokoxE';
const supabase = createClient(supabaseUrl, supabaseKey);

function matchesTourSim(row, tourSlug) {
  const atrativo = row.atrativo || "";
  const atividade = row.atividade || "";
  const atrSlug = createSlug(atrativo);
  
  if (tourSlug.includes("abismo-anhumas")) {
    if (atrSlug !== "abismo-anhumas") return false;
    
    if (tourSlug.includes("flutuacao")) {
      const ativNorm = (atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!ativNorm.includes("FLUTUACAO")) return false;
    }
  }
  return true;
}

async function verify() {
  const { data, error } = await supabase
    .from('atrativo_atividade_precos')
    .select('*')
    .ilike('atrativo', '%Abismo%');
  
  if (error) { console.error(error); return; }
  
  const tourSlug = "flutuacao-abismo-anhumas";
  
  const matches = data.filter(r => matchesTourSim(r, tourSlug));
  
  console.log('Matches found for "Flutuação Abismo Anhumas" with NEW logic:');
  const distinct = [...new Set(matches.map(m => m.atividade))];
  console.log('Unique activities matching:');
  console.log(distinct);
  
  matches.forEach(m => {
    console.log(`- ${m.atividade} (${m.nome_tabela_preco}): R$ ${m.publico_pax}`);
  });
}

verify();
