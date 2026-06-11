const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://inknnuxctfwnoswawixt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDE1MzAsImV4cCI6MjA2NDQ3NzUzMH0.TxkpIelTrSUkIINFwiYB9IBxeIM_NGTQ96jnUgokoxE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('atrativo_atividade_precos')
    .select('*')
    .ilike('atrativo', '%Abismo%');
  
  if (error) { console.error(error); return; }
  
  const rows = data.map(r => ({
    atrativo: r.atrativo,
    atividade: r.atividade,
    vig_inicio: r.vig_inicio,
    vig_fim: r.vig_fim,
    publico_pax: r.publico_pax,
    nome_tabela_preco: r.nome_tabela_preco
  }));
  console.log(JSON.stringify(rows.filter(r => r.atividade.includes('Contemplação')), null, 2));
}
check();
