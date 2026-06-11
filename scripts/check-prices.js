const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const tourSearch = [
  "Gruta do Lago Azul",
  "Barra do Sucuri",
  "Estância Mimosa",
  "Balneário Municipal",
  "Abismo Anhumas",
  "Boca da Onça",
  "Lagoa Misteriosa",
  "Rio Formoso",
  "Rio da Prata",
  "Buraco das Araras",
  "Fazenda San Francisco",
  "Bio Park",
  "Praia da Figueira",
  "Aquário Natural",
  "Rio do Peixe",
  "Nascente Azul"
];

async function checkPrices() {
  const { data, error } = await supabase
    .from('atrativo_atividade_precos')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  console.log('--- Price Audit (Standard/Alta Temporada) ---');
  
  const results = {};

  for (const name of tourSearch) {
    const matches = data.filter(r => 
      (r.atrativo && r.atrativo.toLowerCase().includes(name.toLowerCase())) ||
      (r.atividade && r.atividade.toLowerCase().includes(name.toLowerCase()))
    );

    // Filter to find a likely "standard" price (High season)
    const normalPrices = matches.filter(r => 
      r.nome_tabela_preco && 
      !r.nome_tabela_preco.includes('MS') && 
      !r.nome_tabela_preco.includes('BONITENSE') &&
      !r.nome_tabela_preco.includes('GP')
    );

    if (normalPrices.length > 0) {
      // Pick the max price found as a conservative estimate for "from R$" or highest standard
      const prices = normalPrices.map(r => parseFloat(r.publico_pax || r.atrativo_pax || 0)).filter(p => p > 0);
      if (prices.length > 0) {
        results[name] = Math.max(...prices);
      }
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

checkPrices();
