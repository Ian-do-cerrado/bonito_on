
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://inknnuxctfwnoswawixt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlua25udXhjdGZ3bm9zd2F3aXh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMTUzMCwiZXhwIjoyMDY0NDc3NTMwfQ.NkOBzQKLZtR8FfvLjBzY_j3P30kKUBm2mXtd0ywN1Rw';
const supabase = createClient(supabaseUrl, supabaseKey);

const packages = [
  {
    slug: 'essencia-de-bonito-3-dias',
    title: 'Essência de Bonito: Águas Cristalinas & Emoção no Formoso',
    subtitle: 'Uma jornada intensa pelos rios mais puros do mundo',
    description: 'Ideal para quem tem pouco tempo mas não abre mão da experiência completa. Sinta a paz da flutuação no Rio da Prata e a adrenalina do Boia Cross no Rio Formoso. Hospedagem charmosa para recarregar as energias.',
    duration: '3 dias / 2 noites',
    price: 1170,
    original_price: 1350,
    image: '/rio_da_prata_barco.webp',
    category: 'aventura',
    rating: 4.9,
    reviews_count: 85,
    max_people: 12,
    difficulty: 'moderado',
    itinerary: [
      { day: 1, title: 'Chegada e Acolhimento na Pousada Aromas Suítes', activities: ['Transfer para Pousada', 'Check-in e descanso'], meals: [] },
      { day: 2, title: 'O Coração do MS: Flutuação & Cavalgada no Rio da Prata', activities: ['Flutuação no Rio da Prata', 'Passeio a Cavalo'], meals: ['Café da Manhã'] },
      { day: 3, title: 'Adrenalina no Formoso e Despedida', activities: ['Boia Cross no Parque Ecológico Rio Formoso', 'Check-out'], meals: ['Café da Manhã'] }
    ],
    highlights: ['Flutuação Rio da Prata', 'Boia Cross Rio Formoso', 'Cavalgada contemplativa'],
    included: ['Hospedagem na Pousada Aromas Suítes', 'Café da manhã', 'Seguro viagem', 'Equipamentos de flutuação']
  },
  {
    slug: 'recanto-formoso-4-dias',
    title: 'Recanto Formoso: O Equilíbrio Perfeito entre Paz e Aventura',
    subtitle: 'Desconecte-se na Pousada Aromas e viva o melhor dos balneários',
    description: 'Passe dias inesquecíveis mergulhando no Estrela do Formoso e desafiando seus limites no Formoso Adventure. Um roteiro desenhado para quem busca contato real com a natureza sem pressa.',
    duration: '4 dias / 3 noites',
    price: 901,
    original_price: 1100,
    image: '/balne-rio-estrela-do-formoso.webp',
    category: 'relaxamento',
    rating: 4.8,
    reviews_count: 112,
    max_people: 10,
    difficulty: 'facil',
    itinerary: [
      { day: 1, title: 'Bem-vindo a Bonito: Check-in na Pousada Aromas Suítes', activities: ['Check-in', 'Tarde livre no centro'], meals: [] },
      { day: 2, title: 'Dia de Sol no Balneário Estrela do Formoso', activities: ['Banho de rio no Estrela do Formoso', 'Descanso no deck'], meals: ['Café da Manhã'] },
      { day: 3, title: 'Aventura Radical: Formoso Adventure com Almoço', activities: ['Tirolesa e Arvorismo no Rio Formoso', 'Trilha contemplativa'], meals: ['Café da Manhã', 'Almoço'] },
      { day: 4, title: 'Check-out e Últimos Mergulhos', activities: ['Check-out', 'Passeio opcional no centro'], meals: ['Café da Manhã'] }
    ],
    highlights: ['Balneário Estrela do Formoso', 'Formoso Adventure (Tirolesa + Arvorismo)', 'Almoço regional incluso'],
    included: ['3 Noites na Pousada Aromas Suítes', 'Almoço no Parque Ecológico', 'Equipamentos de segurança', 'Seguro de acidentes']
  },
  {
    slug: 'bonito-experience-5-dias',
    title: 'Bonito Experience: 5 Dias de Imersão Total no Paraíso',
    subtitle: 'Sua semana dos sonhos com o melhor custo-benefício',
    description: 'Dê a si mesmo o presente de 5 dias em Bonito. Aproveite a liberdade de estar no coração do MS, com atividades selecionadas para surpreender todos os seus sentidos. Viva o Estrela do Formoso e o Parque Ecológico.',
    duration: '5 dias / 4 noites',
    price: 901,
    original_price: 1250,
    image: '/parque-ecol-gico-rio-formoso-formoso-adventure-tirolesa-arvorismo.webp',
    category: 'economico',
    rating: 4.7,
    reviews_count: 95,
    max_people: 15,
    difficulty: 'facil',
    itinerary: [
      { day: 1, title: 'Início da Jornada: Chegada em Bonito', activities: ['Transfer aeroporto/pousada', 'Check-in Aromas Suítes'], meals: [] },
      { day: 2, title: 'Pureza das Águas: Estrela do Formoso', activities: ['Balneário Estrela do Formoso'], meals: ['Café da Manhã'] },
      { day: 3, title: 'Dia de Desafios: Formoso Adventure', activities: ['Circuito Formoso Adventure', 'Almoço na sede'], meals: ['Café da Manhã', 'Almoço'] },
      { day: 4, title: 'Dia Livre: Descobertas e Sabores Locais', activities: ['Sugestão: Passeio de bike ou visita ao centrinho'], meals: ['Café da Manhã'] },
      { day: 5, title: 'Saudade de Bonito e Partida', activities: ['Check-out', 'Transfer para aeroporto'], meals: ['Café da Manhã'] }
    ],
    highlights: ['Circuito Formoso Adventure', 'Balneário Premium', 'Dia livre para exploração'],
    included: ['4 Noites na Pousada Aromas Suítes', 'Café da manhã completo', 'Acesso VIP aos balneários', 'Seguro passeio']
  },
  {
    slug: 'expedicao-suprema-5-dias',
    title: 'Expedição Suprema: O Coração de Bonito em 5 Dias',
    subtitle: 'Rio da Prata, Estância Mimosa e Gruta do Mimoso em um só roteiro',
    description: 'O roteiro mais desejado pelos amantes do ecoturismo. Dos mistérios da Gruta do Mimoso ao cenário cinematográfico do Rio da Prata. Gastronomia regional incluída e o conforto que você merece na Pousada Aromas Suítes.',
    duration: '5 dias / 4 noites',
    price: 1952,
    original_price: 2200,
    image: '/estancia-mimosa-aereo-barco.webp',
    category: 'premium',
    rating: 5.0,
    reviews_count: 64,
    max_people: 8,
    difficulty: 'moderado',
    itinerary: [
      { day: 1, title: 'Chegada Glamourosa em Bonito', activities: ['Check-in Aromas Suítes', 'Briefing dos passeios'], meals: [] },
      { day: 2, title: 'Misteriosa e Encantadora: Gruta do Mimoso & Estância Mimosa', activities: ['Flutuação na Gruta do Mimoso', 'Trilha e Cachoeiras na Estância Mimosa'], meals: ['Café da Manhã', 'Almoço'] },
      { day: 3, title: 'O Rei de Bonito: Flutuação Rio da Prata & Estrela do Formoso', activities: ['Flutuação no Rio da Prata', 'Tarde relaxante no Estrela do Formoso'], meals: ['Café da Manhã', 'Almoço'] },
      { day: 4, title: 'Diversão em Família: Boia Cross no Parque Ecológico', activities: ['Boia Cross no Rio Formoso', 'Almoço na fazenda'], meals: ['Café da Manhã', 'Almoço'] },
      { day: 5, title: 'Out da Pousada e Despedida', activities: ['Último café colonial', 'Check-out'], meals: ['Café da Manhã'] }
    ],
    highlights: ['Três dos passeios mais famosos de Bonito', 'Flutuação na lendária Gruta do Mimoso', 'Gastronomia de fazenda incluída'],
    included: ['4 Noites em suíte premium', 'Almoços pantaneiros inclusos', 'Guias bilíngues', 'Voucher digital para fotos']
  }
];

async function insertData() {
  for (const pkg of packages) {
    console.log(`Inserting package: ${pkg.title}`);
    const { data: insertedPkg, error: pkgError } = await supabase
      .from('packages')
      .insert({
        slug: pkg.slug,
        title: pkg.title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        duration: pkg.duration,
        price: pkg.price,
        original_price: pkg.original_price,
        image: pkg.image,
        category: pkg.category,
        rating: pkg.rating,
        reviews_count: pkg.reviews_count,
        max_people: pkg.max_people,
        difficulty: pkg.difficulty
      })
      .select()
      .single();

    if (pkgError) {
      console.error(`Error inserting package ${pkg.title}:`, pkgError);
      continue;
    }

    const pkgId = insertedPkg.id;

    // Highlights
    if (pkg.highlights) {
      await supabase.from('package_highlights').insert(
        pkg.highlights.map(h => ({ package_id: pkgId, highlight: h }))
      );
    }

    // Included
    if (pkg.included) {
      await supabase.from('package_included').insert(
        pkg.included.map(i => ({ package_id: pkgId, item: i }))
      );
    }

    // Itinerary
    for (const day of pkg.itinerary) {
      const { data: insertedDay, error: dayError } = await supabase
        .from('package_itinerary')
        .insert({
          package_id: pkgId,
          day: day.day,
          title: day.title
        })
        .select()
        .single();

      if (dayError) {
        console.error(`Error inserting day ${day.day} for ${pkg.title}:`, dayError);
        continue;
      }

      const dayId = insertedDay.id;

      // Activities
      if (day.activities) {
        await supabase.from('itinerary_activities').insert(
          day.activities.map(a => ({ itinerary_id: dayId, activity: a }))
        );
      }

      // Meals
      if (day.meals) {
        await supabase.from('itinerary_meals').insert(
          day.meals.map(m => ({ itinerary_id: dayId, meal: m }))
        );
      }
    }
  }
  console.log('All packages inserted successfully!');
}

insertData();
