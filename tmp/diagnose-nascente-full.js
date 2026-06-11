const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnoseAll() {
  const { data, error } = await supabase
    .from('atrativo_atividade_precos')
    .select('*')
    .ilike('atrativo', '%Nascente Azul%');

  if (error) {
    console.error(error);
    return;
  }

  // Sort by price to find 337
  const sorted = data.sort((a, b) => (a.publico_pax || 0) - (b.publico_pax || 0));

  console.log(JSON.stringify(sorted.map(r => ({
    atividade: r.atividade,
    tabela: r.nome_tabela_preco,
    pax: r.publico_pax,
    atr_pax: r.atrativo_pax,
    inicio: r.vig_inicio,
    fim: r.vig_fim
  })), null, 2));
}

diagnoseAll();
