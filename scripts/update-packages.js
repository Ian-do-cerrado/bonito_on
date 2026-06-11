const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const newPackages = [
  {
    title: "Bonito Essencial",
    slug: "bonito-essencial-3-dias",
    subtitle: "O melhor de Bonito em 3 dias",
    description: "Um roteiro prático e encantador para quem tem pouco tempo mas não abre mão de conhecer os cartões-postais da capital do ecoturismo. Visitaremos as grutas mais famosas e flutuaremos em águas cristalinas.",
    duration: "3 dias / 2 noites",
    price: 1190,
    original_price: 1400,
    image: "/gruta_do_lago_azul_principal.webp",
    category: "economico",
    rating: 4.9,
    reviews_count: 342,
    max_people: 12,
    difficulty: "facil",
    highlights: ["Gruta do Lago Azul", "Flutuação Barra do Sucuri", "Cachoeiras Estância Mimosa", "Balneário Municipal"],
    included: ["Hospedagem em Pousada Central", "Café da manhã incluso", "Transporte para todos os passeios", "Guia bilíngue", "Seguro viagem"],
    best_seasons: ["Maio", "Junho", "Julho", "Agosto", "Setembro"],
    itinerary: [
      {
        day: 1,
        title: "Contemplação Subterrânea",
        activities: ["Chegada em Bonito", "Visita à Gruta do Lago Azul", "Visita às Grutas de São Miguel"],
        meals: ["Jantar de Boas-vindas"],
        accommodation: "Pousada Conforto"
      },
      {
        day: 2,
        title: "Águas de Cristal e Cachoeiras",
        activities: ["Flutuação Barra do Sucuri", "Almoço Regional", "Trilha e Cachoeiras na Estância Mimosa"],
        meals: ["Café da manhã", "Almoço"],
        accommodation: "Pousada Conforto"
      },
      {
        day: 3,
        title: "Despedida no Balneário",
        activities: ["Manhã livre no Balneário Municipal", "Check-out e Partida"],
        meals: ["Café da manhã"],
        accommodation: null
      }
    ]
  },
  {
    title: "Aventura Extrema",
    slug: "pacote-aventura-extrema-bonito",
    subtitle: "Adrenalina pura no coração do MS",
    description: "Para quem busca superar limites. Este roteiro inclui rapel, mergulho profundo e as maiores quedas d'água da região (Boca da Onça). Prepare-se para vivenciar Bonito do ângulo mais radical possível.",
    duration: "4 dias / 3 noites",
    price: 3250,
    original_price: 3600,
    image: "/abismo2.webp",
    category: "premium",
    rating: 5.0,
    reviews_count: 156,
    max_people: 8,
    difficulty: "dificil",
    highlights: ["Abismo Anhumas (Flutuação)", "Boca da Onça (Maior Rapel do Brasil)", "Mergulho na Lagoa Misteriosa", "Boia Cross no Rio Formoso"],
    included: ["Hospedagem em Hotel Superior", "Equipamento completo de mergulho/rapel", "Almoço em fazendas selecionadas", "Instrutores especializados", "Fotos e vídeos profissionais"],
    best_seasons: ["Abril", "Maio", "Junho", "Julho", "Agosto"],
    itinerary: [
      {
        day: 1,
        title: "O Abismo Vertical",
        activities: ["Check-in", "Treinamento de Rapel", "Descida no Abismo Anhumas"],
        meals: ["Almoço"],
        accommodation: "Hotel Selina Bonito"
      },
      {
        day: 2,
        title: "A Maior Queda",
        activities: ["Expedição Boca da Onça", "Rapel de 90 metros", "Trilha Discovery"],
        meals: ["Café da manhã", "Almoço"],
        accommodation: "Hotel Selina Bonito"
      },
      {
        day: 3,
        title: "Profundezas Azuis",
        activities: ["Mergulho com cilindro na Lagoa Misteriosa", "Flutuação no Rio da Prata", "Jantar na cidade"],
        meals: ["Café da manhã", "Almoço"],
        accommodation: "Hotel Selina Bonito"
      },
      {
        day: 4,
        title: "Rios e Correntes",
        activities: ["Boia Cross no Rio Formoso", "Check-out"],
        meals: ["Café da manhã"],
        accommodation: null
      }
    ]
  },
  {
    title: "Natureza & Vida Selvagem",
    slug: "natureza-vida-selvagem-pantanal-bonito",
    subtitle: "Expedição Bonito & Pantanal",
    description: "Uma imersão completa na biodiversidade brasileira. Combine as águas transparentes de Bonito com o safári fotográfico e a observação de animais no Pantanal Sul.",
    duration: "4 dias / 3 noites",
    price: 1950,
    original_price: 2300,
    image: "/fazenda_ceita_core.webp",
    category: "premium",
    rating: 4.8,
    reviews_count: 210,
    max_people: 10,
    difficulty: "moderado",
    highlights: ["Santuário Rio da Prata", "Buraco das Araras", "Safári Fotográfico no Pantanal", "Bio Park (Fauna local)"],
    included: ["Hospedagem em Lodge no Pantanal", "Hospedagem em Bonito", "Todas as refeições no Pantanal", "Transporte 4x4", "Guia biólogo"],
    best_seasons: ["Junho", "Julho", "Agosto", "Setembro"],
    itinerary: [
      {
        day: 1,
        title: "O Santuário das Águas",
        activities: ["Flutuação no Rio da Prata", "Almoço regional", "Visita ao Buraco das Araras"],
        meals: ["Almoço"],
        accommodation: "Pousada Olho d'Água"
      },
      {
        day: 2,
        title: "Rumo ao Pantanal",
        activities: ["Partida para o Pantanal", "Almoço Pantaneiro", "Focagem Noturna de Animais"],
        meals: ["Café da manhã", "Almoço", "Jantar"],
        accommodation: "Fazenda San Francisco (Lodge)"
      },
      {
        day: 3,
        title: "Safári e Tradição",
        activities: ["Safári Fotográfico", "Passeio de Chalana", "Pesca de Piranhas"],
        meals: ["Café da manhã", "Almoço", "Jantar"],
        accommodation: "Fazenda San Francisco (Lodge)"
      },
      {
        day: 4,
        title: "Fauna e Retorno",
        activities: ["Visita ao Bio Park Bonito", "Check-out e retorno"],
        meals: ["Café da manhã"],
        accommodation: null
      }
    ]
  },
  {
    title: "Férias em Família",
    slug: "ferias-em-familia-bonito-ms",
    subtitle: "Diversão e memórias inesquecíveis",
    description: "Pensado para quem viaja com crianças ou idosos. Atividades com infraestrutura completa, seguras e com pouco esforço físico, focadas no lazer e relaxamento.",
    duration: "5 dias / 4 noites",
    price: 1850,
    original_price: 2100,
    image: "/Praia_da_figueira.webp",
    category: "luxo",
    rating: 4.7,
    reviews_count: 189,
    max_people: 20,
    difficulty: "facil",
    highlights: ["Praia da Figueira", "Aquário Natural", "Rio do Peixe (Cachoeiras)", "Nascente Azul"],
    included: ["Hospedagem em Resort com Piscina", "Monitoria para crianças", "Almoço em todos os dias de passeio", "Transporte privativo", "Passaporte para balneários"],
    best_seasons: ["Janeiro", "Fevereiro", "Março", "Julho", "Dezembro"],
    itinerary: [
      {
        day: 1,
        title: "Dia de Praia",
        activities: ["Check-in", "Tarde inteira na Praia da Figueira"],
        meals: ["Jantar"],
        accommodation: "Zagaia Eco Resort"
      },
      {
        day: 2,
        title: "Mundo Subaquático",
        activities: ["Flutuação no Aquário Natural", "Visita ao Projeto Jiboia (Educativo)"],
        meals: ["Café da manhã", "Almoço"],
        accommodation: "Zagaia Eco Resort"
      },
      {
        day: 3,
        title: "Cachoeiras e Lazer",
        activities: ["Passeio nas Cachoeiras Rio do Peixe", "Interação com macacos e araras"],
        meals: ["Café da manhã", "Almoço"],
        accommodation: "Zagaia Eco Resort"
      },
      {
        day: 4,
        title: "Aventuras Leves",
        activities: ["Nascente Azul (Flutuação e Balneário)", "Tirolesa e Museu Subaquático"],
        meals: ["Café da manhã", "Almoço"],
        accommodation: "Zagaia Eco Resort"
      },
      {
        day: 5,
        title: "Despedida e Relax",
        activities: ["Manhã livre na piscina do resort", "Check-out e Partida"],
        meals: ["Café da manhã"],
        accommodation: null
      }
    ]
  }
];

async function updatePackages() {
  console.log('--- Starting Packages Update ---');

  try {
    console.log('Cleaning up old packages data...');
    await supabase.from('package_best_seasons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('package_highlights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('package_included').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    await supabase.from('itinerary_activities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('itinerary_meals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('package_itinerary').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    await supabase.from('packages').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Inserting new packages...');

    for (const pkgData of newPackages) {
      const { highlights, included, best_seasons, itinerary, ...pkg } = pkgData;
      
      const { data: insertedPkg, error: pkgError } = await supabase
        .from('packages')
        .insert([pkg])
        .select()
        .single();

      if (pkgError) throw pkgError;
      const packageId = insertedPkg.id;

      if (highlights) {
        const hData = highlights.map(h => ({ package_id: packageId, highlight: h }));
        await supabase.from('package_highlights').insert(hData);
      }

      if (included) {
        const iData = included.map(i => ({ package_id: packageId, item: i }));
        await supabase.from('package_included').insert(iData);
      }

      if (best_seasons) {
        const sData = best_seasons.map(s => ({ package_id: packageId, season: s }));
        await supabase.from('package_best_seasons').insert(sData);
      }

      if (itinerary) {
        for (const day of itinerary) {
          const { activities, meals, ...dayData } = day;
          const { data: insertedDay, error: dayError } = await supabase
            .from('package_itinerary')
            .insert([{ ...dayData, package_id: packageId }])
            .select()
            .single();

          if (dayError) throw dayError;
          const itineraryId = insertedDay.id;

          if (activities) {
            const aData = activities.map(a => ({ itinerary_id: itineraryId, activity: a }));
            await supabase.from('itinerary_activities').insert(aData);
          }

          if (meals) {
            const mData = meals.map(m => ({ itinerary_id: itineraryId, meal: m }));
            await supabase.from('itinerary_meals').insert(mData);
          }
        }
      }

      console.log(`- Package "${pkg.title}" inserted successfully.`);
    }

    console.log('\nAll packages updated successfully!');
  } catch (err) {
    console.error('Error updating packages:', err);
    process.exit(1);
  }
}

updatePackages();
