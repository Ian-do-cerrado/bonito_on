// Dados estáticos das seções de /pacotes-promo.
// Copiado literalmente de bonito-on-your-dream-trip/src/routes/index.tsx
// (imagens apontadas para public/pacotes-promo/*; ícones referenciados por nome
// de string — os componentes resolvem o nome lucide correspondente).

export const WHATSAPP_NUMBER = "5567991395384";
export const WHATSAPP_MESSAGE =
  "Olá, vim do Google! Gostaria de receber um orçamento para um pacote em Bonito.";
export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/* ---------- PACKAGES ---------- */
export type Pkg = {
  id: string;
  days: 2 | 3 | 4 | 5;
  shortLabel: string;
  title: string;
  desc: string;
  tours: string[];
  includes: string[];
  excludes?: string[];
  featured?: boolean;
  images: { src: string; alt: string; tour: string }[];
};

export const packages: Pkg[] = [
  {
    id: "2-dias-classico",
    days: 2,
    shortLabel: "Clássico",
    title: "O Melhor de Bonito em 2 Dias",
    desc: "Ideal para quem possui pouco tempo e deseja conhecer os principais atrativos de Bonito.",
    tours: ["Flutuação Rio da Prata", "Estância Mimosa", "Gruta do Mimoso"],
    includes: ["Equipamentos", "Guias credenciados", "Almoço na Estância Mimosa"],
    images: [
      { src: "/pacotes-promo/flutuacao-rio-da-prata-1.jpeg", alt: "Flutuação no Rio da Prata", tour: "Flutuação Rio da Prata" },
      { src: "/pacotes-promo/flutuacao-rio-da-prata-2.jpeg", alt: "Águas cristalinas do Rio da Prata", tour: "Flutuação Rio da Prata" },
      { src: "/pacotes-promo/estancia-mimosa-1.jpg", alt: "Cachoeiras da Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/estancia-mimosa-2.jpeg", alt: "Trilha da Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/gruta-do-mimoso-1.jpg", alt: "Gruta do Mimoso", tour: "Gruta do Mimoso" },
      { src: "/pacotes-promo/gruta-do-mimoso-2.jpeg", alt: "Mergulho na Gruta do Mimoso", tour: "Gruta do Mimoso" },
    ],
  },
  {
    id: "3-dias-experiencias",
    days: 3,
    shortLabel: "Experiências",
    title: "As Melhores Experiências de Bonito",
    desc: "Três dias reunindo natureza, aventura e as atrações mais famosas da região.",
    tours: ["Rio da Prata", "Estância Mimosa", "Boia Cross", "Gruta do Mimoso"],
    includes: [
      "Equipamentos",
      "Guias credenciados",
      "Almoço Rio da Prata",
      "Almoço Estância Mimosa",
    ],
    featured: true,
    images: [
      { src: "/pacotes-promo/rio-da-prata-3.jpg", alt: "Rio da Prata", tour: "Rio da Prata" },
      { src: "/pacotes-promo/rio-da-prata-4.jpg", alt: "Águas do Rio da Prata", tour: "Rio da Prata" },
      { src: "/pacotes-promo/estancia-mimosa-3.jpg", alt: "Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/estancia-mimosa-4.jpg", alt: "Cachoeira da Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/boia-cross-1.webp", alt: "Boia Cross em Bonito", tour: "Boia Cross" },
      { src: "/pacotes-promo/boia-cross-2.jpg", alt: "Aventura no Boia Cross", tour: "Boia Cross" },
      { src: "/pacotes-promo/gruta-do-mimoso-3.webp", alt: "Gruta do Mimoso", tour: "Gruta do Mimoso" },
      { src: "/pacotes-promo/gruta-do-mimoso-4.jpeg", alt: "Interior da Gruta do Mimoso", tour: "Gruta do Mimoso" },
    ],
  },
  {
    id: "4-dias-completo",
    days: 4,
    shortLabel: "Completo",
    title: "Bonito Completo em 4 Dias",
    desc: "O roteiro mais completo para conhecer Bonito com tranquilidade.",
    tours: [
      "Rio da Prata",
      "Estância Mimosa",
      "Boia Cross",
      "Gruta do Mimoso",
      "Estrela do Formoso",
    ],
    includes: ["Equipamentos", "Guias credenciados", "Almoços inclusos", "Day Use"],
    images: [
      { src: "/pacotes-promo/flutuacao-rio-da-prata-5.jpeg", alt: "Rio da Prata", tour: "Rio da Prata" },
      { src: "/pacotes-promo/flutuacao-rio-da-prata-6.jpeg", alt: "Flutuação no Rio da Prata", tour: "Rio da Prata" },
      { src: "/pacotes-promo/estancia-mimosa-5.webp", alt: "Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/estancia-mimosa-6.jpg", alt: "Piscinas naturais da Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/boia-cross-3.webp", alt: "Boia Cross em Bonito", tour: "Boia Cross" },
      { src: "/pacotes-promo/boia-cross-4.webp", alt: "Descida no Boia Cross", tour: "Boia Cross" },
      { src: "/pacotes-promo/gruta-do-mimoso-5.jpeg", alt: "Gruta do Mimoso", tour: "Gruta do Mimoso" },
      { src: "/pacotes-promo/gruta-do-mimoso-6.jpeg", alt: "Formações rochosas da Gruta do Mimoso", tour: "Gruta do Mimoso" },
      { src: "/pacotes-promo/estrela-do-formoso-1.webp", alt: "Estrela do Formoso", tour: "Estrela do Formoso" },
      { src: "/pacotes-promo/estrela-do-formoso-2.jpeg", alt: "Cachoeira da Estrela do Formoso", tour: "Estrela do Formoso" },
    ],
  },
  {
    id: "2-dias-natureza-aventura",
    days: 2,
    shortLabel: "Natureza & Aventura",
    title: "Pacote Natureza & Aventura – 2 Dias",
    desc: "Descubra o melhor de Bonito em um roteiro que combina descanso, natureza e muita diversão.",
    tours: ["1º Dia – Estrela do Formoso (Day Use)", "2º Dia – Boia Cross no Parque Ecológico Rio Formoso"],
    includes: ["Equipamentos necessários", "Seguro das atividades"],
    images: [
      { src: "/pacotes-promo/estrela-do-formoso-3.jpeg", alt: "Estrela do Formoso", tour: "Estrela do Formoso" },
      { src: "/pacotes-promo/estrela-do-formoso-4.jpeg", alt: "Day use no Estrela do Formoso", tour: "Estrela do Formoso" },
      { src: "/pacotes-promo/boia-cross-5.jpg", alt: "Boia Cross no Rio Formoso", tour: "Boia Cross" },
      { src: "/pacotes-promo/boia-cross-6.jpg", alt: "Corredeiras do Boia Cross", tour: "Boia Cross" },
    ],
  },
  {
    id: "5-dias-premium",
    days: 5,
    shortLabel: "Premium",
    title: "Pacote Bonito Premium – 5 Dias",
    desc: "Cinco dias para viver o melhor de Bonito e região, combinando rios cristalinos, cachoeiras, cavernas e aventura.",
    tours: [
      "1º Dia – Chegada em Bonito (dia livre)",
      "2º Dia – Flutuação no Rio da Prata",
      "3º Dia – Estância Mimosa + Gruta do Mimoso",
      "4º Dia – Formoso Adventure (tirolesa, arvorismo e flutuação)",
      "5º Dia – Estrela do Formoso (Day Use)",
    ],
    includes: ["Equipamentos para os passeios", "Seguro das atividades", "Guias credenciados"],
    images: [
      { src: "/pacotes-promo/rio-da-prata-7.jpeg", alt: "Rio da Prata", tour: "Rio da Prata" },
      { src: "/pacotes-promo/rio-da-prata-8.jpeg", alt: "Flutuação no Rio da Prata", tour: "Rio da Prata" },
      { src: "/pacotes-promo/estancia-mimosa-7.jpg", alt: "Estância Mimosa", tour: "Estância Mimosa" },
      { src: "/pacotes-promo/gruta-do-mimoso-7.webp", alt: "Gruta do Mimoso", tour: "Gruta do Mimoso" },
      { src: "/pacotes-promo/formoso-adventure.jpg", alt: "Formoso Adventure", tour: "Formoso Adventure" },
      { src: "/pacotes-promo/formoso-adventure-2.jpeg", alt: "Tirolesa no Formoso Adventure", tour: "Formoso Adventure" },
      { src: "/pacotes-promo/estrela-do-formoso-5.jpeg", alt: "Estrela do Formoso", tour: "Estrela do Formoso" },
      { src: "/pacotes-promo/estrela-do-formoso-6.jpg", alt: "Day use no Estrela do Formoso", tour: "Estrela do Formoso" },
    ],
  },
];

/* ---------- COMPARISON ---------- */
// Cada array de `values` segue a mesma ordem do array `packages` acima:
// [2-dias-classico, 3-dias-experiencias, 4-dias-completo, 2-dias-natureza-aventura, 5-dias-premium]
export type ComparisonRow = { label: string; values: string[] };

export const comparisonRows: ComparisonRow[] = [
  { label: "Quantidade de dias", values: ["2 dias", "3 dias", "4 dias", "2 dias", "5 dias"] },
  { label: "Flutuação Rio da Prata", values: ["Sim", "Sim", "Sim", "—", "Sim"] },
  { label: "Cachoeiras", values: ["Sim", "Sim", "Sim", "—", "Sim"] },
  { label: "Grutas", values: ["Sim", "Sim", "Sim", "—", "Sim"] },
  { label: "Aventura (Boia Cross)", values: ["—", "Sim", "Sim", "Sim", "—"] },
  { label: "Formoso Adventure", values: ["—", "—", "—", "—", "Sim"] },
  { label: "Almoço incluso", values: ["1 almoço", "2 almoços", "Múltiplos", "—", "—"] },
  { label: "Quantidade de atrações", values: ["3", "4", "5", "2", "5"] },
  {
    label: "Ideal para",
    values: [
      "Bate e volta",
      "Experiência completa",
      "Roteiro tranquilo",
      "Descanso e aventura",
      "Roteiro premium completo",
    ],
  },
];

/* ---------- HOW IT WORKS ---------- */
export type HowItWorksStep = { n: number; title: string; desc: string };

export const howItWorksSteps: HowItWorksStep[] = [
  { n: 1, title: "Escolha seu pacote", desc: "2 a 5 dias." },
  { n: 2, title: "Fale com um especialista", desc: "Atendimento humano pelo WhatsApp." },
  { n: 3, title: "Receba seu orçamento", desc: "Personalizado para o seu grupo." },
  { n: 4, title: "Confirme sua viagem", desc: "Reservas garantidas com antecedência." },
  { n: 5, title: "Viva Bonito", desc: "Com suporte do início ao fim." },
];

/* ---------- INCLUDED / NOT INCLUDED ---------- */
export const includedItems: string[] = [
  "Equipamentos",
  "Guias credenciados",
  "Passeios descritos",
  "Almoços conforme pacote",
];

export const notIncludedItems: string[] = [
  "Hospedagem",
  "Transporte",
  "Despesas pessoais",
  "Bebidas",
];

/* ---------- DIFFERENTIALS ---------- */
export type DifferentialItem = { icon: string; title: string; desc: string };

export const differentialsItems: DifferentialItem[] = [
  {
    icon: "Mountain",
    title: "Especialistas em Bonito",
    desc: "Conhecemos o destino como ninguém.",
  },
  {
    icon: "Sparkles",
    title: "Melhores combinações",
    desc: "Passeios que se encaixam perfeitamente.",
  },
  {
    icon: "Clock",
    title: "Economia de tempo",
    desc: "Roteiros otimizados sem desperdício.",
  },
  {
    icon: "Users",
    title: "Atendimento personalizado",
    desc: "Cada viagem é única.",
  },
  {
    icon: "Compass",
    title: "Roteiros inteligentes",
    desc: "Ordem certa dos passeios para melhor experiência.",
  },
  {
    icon: "Headphones",
    title: "Suporte completo",
    desc: "Da primeira mensagem ao retorno para casa.",
  },
];

/* ---------- GALLERY ---------- */
export type GalleryShot = { src: string; label: string };

export const galleryShots: GalleryShot[] = [
  { src: "/pacotes-promo/gruta-do-mimoso-1.jpg", label: "Gruta do Mimoso" },
  { src: "/pacotes-promo/estancia-mimosa-1.jpg", label: "Estância Mimosa" },
  { src: "/pacotes-promo/boia-cross-1.webp", label: "Boia Cross" },
  { src: "/pacotes-promo/flutuacao-rio-da-prata-1.jpeg", label: "Rio da Prata" },
];

/* ---------- FAQ ---------- */
export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Os passeios incluem equipamentos?",
    a: "Sim. Todos os passeios já contam com os equipamentos necessários — máscara, snorkel, colete e neoprene quando aplicável.",
  },
  {
    q: "Posso personalizar o roteiro?",
    a: "Claro. Nossos pacotes são o ponto de partida. Ajustamos passeios, ritmo e datas conforme o seu perfil.",
  },
  {
    q: "Há opções para crianças?",
    a: "Sim. Vários passeios possuem versões family friendly. Ao falar com um especialista, indicamos os que combinam com a idade dos pequenos.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Aceitamos PIX, cartão de crédito e transferência. O orçamento é enviado após a conversa pelo WhatsApp.",
  },
  {
    q: "Preciso reservar com antecedência?",
    a: "Recomendamos sim. Os principais atrativos de Bonito trabalham com vagas limitadas por dia — quanto antes reservar, melhor.",
  },
];
