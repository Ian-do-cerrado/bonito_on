const { createClient } = require('@supabase/supabase-js');

// Configuração manual para o script (pegando do .env.local se possível ou hardcoded para teste rápido)
const supabaseUrl = 'https://inknnuxctfwnoswawixt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSyncLogic() {
  console.log("--- TESTANDO LÓGICA DE SINCRONIZAÇÃO ---");
  
  // 1. Simular o que a nova função faria para o Buraco das Araras
  // Sabemos que o preço fixo é 185
  const buracoSlug = 'buraco-das-araras';
  const buracoTitle = 'Buraco das Araras';
  
  console.log(`\nVerificando tour: ${buracoTitle} (${buracoSlug})`);
  const { data: tour, error: tourError } = await supabase.from('tours').select('*').eq('slug', buracoSlug).single();
  
  if (tourError || !tour) {
    console.error("Erro ao buscar tour no banco:", tourError);
  } else {
    console.log(`Preço atual no banco: R$ ${tour.price}`);
  }

  // 2. Simular a busca por preços usando a lógica que agora incluímos no sync
  // Como não posso importar o TS aqui facilmente, vamos apenas simular a chamada à ação
  // ou verificar se o banco foi atualizado após rodarmos o sync real via UI.
  
  console.log("\nPara validar 100%, você deve clicar no botão 'Sincronizar Preços' no painel.");
  console.log("Se a lógica nova estiver ok, o Buraco das Araras deve pular de 0 ou valor antigo para R$ 185.");
}

testSyncLogic();
