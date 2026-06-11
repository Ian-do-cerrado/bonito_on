const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Re-reading env from .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
  console.log('--- Diagnosing Nascente Azul Activities ---');
  const { data, error } = await supabase
    .from('atrativo_atividade_precos')
    .select('*')
    .ilike('atrativo', '%Nascente Azul%');

  if (error) {
    console.error(error);
    return;
  }

  const results = data.map(r => ({
    atrativo: r.atrativo,
    atividade: r.atividade,
    tabela: r.nome_tabela_preco,
    preco: r.publico_pax ?? r.atrativo_pax
  }));

  console.log(JSON.stringify(results, null, 2));
}

diagnose();
