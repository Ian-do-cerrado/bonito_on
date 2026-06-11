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

async function syncTours() {
  console.log('Iniciando sincronização massiva de preços...');
  
  const { data: tours, error: toursError } = await supabase.from('tours').select('id, slug, title');
  if (toursError) { console.error(toursError); return; }
  
  console.log(`Encontrados ${tours.length} passeios.`);
  
  for (const tour of tours) {
    try {
      if (tour.slug.includes('abismo')) {
        console.log(`Processando: ${tour.title}...`);
        
        let price = 0;
        if (tour.slug === 'flutuacao-abismo-anhumas') price = 1598;
        if (tour.slug === 'mergulho-com-cilindro-abismo-anhumas') price = 1799;
        if (tour.slug === 'abismo-anhumas') price = 1598;

        if (price > 0) {
           const { error } = await supabase.from('tours').update({ price }).eq('id', tour.id);
           if (error) console.error(`Erro ao atualizar ${tour.title}:`, error);
           else console.log(`✓ ${tour.title} atualizado para R$ ${price}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  console.log('Sincronização concluída.');
}

syncTours();
