// Dados estáticos das seções de /pacotes-promo.
// Copiado literalmente de bonito-on-your-dream-trip/src/routes/index.tsx
// (imagens apontadas para public/pacotes-promo/*; ícones referenciados por nome
// de string — os componentes resolvem o nome lucide correspondente).

export const WHATSAPP_NUMBER = "5567991395384";
export const WHATSAPP_MESSAGE =
  "Olá, vim do Google! Gostaria de receber um orçamento para um pacote em Bonito.";
export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/* ---------- WHY US ---------- */
export type WhyUsItem = { icon: string; title: string; desc: string };

export const whyUsItems: WhyUsItem[] = [
  {
    icon: "Headphones",
    title: "Atendimento consultivo",
    desc: "Ajudamos você a montar o roteiro ideal para o seu perfil e tempo disponível.",
  },
  {
    icon: "Sparkles",
    title: "Pacotes completos",
    desc: "Passeios, guias e almoços organizados sem dor de cabeça.",
  },
  {
    icon: "Compass",
    title: "Passeios selecionados",
    desc: "Somente as melhores atrações que Bonito tem a oferecer.",
  },
  {
    icon: "ShieldCheck",
    title: "Guias credenciados",
    desc: "Segurança e profissionais autorizados em todos os passeios.",
  },
  {
    icon: "Clock",
    title: "Melhor aproveitamento do tempo",
    desc: "Rotas inteligentes para você viver mais em menos tempo.",
  },
  {
    icon: "Users",
    title: "Suporte antes e durante",
    desc: "Time à disposição do primeiro contato até o fim da viagem.",
  },
];

/* ---------- PACKAGES ---------- */
export type Pkg = {
  days: 2 | 3 | 4;
  title: string;
  desc: string;
  tours: string[];
  includes: string[];
  excludes?: string[];
  featured?: boolean;
  images: { src: string; alt: string }[];
};

export const packages: Pkg[] = [
  {
    days: 2,
    title: "O Melhor de Bonito em 2 Dias",
    desc: "Ideal para quem possui pouco tempo e deseja conhecer os principais atrativos de Bonito.",
    tours: ["Flutuação Rio da Prata", "Estância Mimosa", "Gruta do Mimoso"],
    includes: ["Equipamentos", "Guias credenciados", "Almoço na Estância Mimosa"],
    excludes: ["Transporte", "Hospedagem", "Bebidas"],
    images: [
      { src: "/pacotes-promo/pkg2-1.webp", alt: "Gruta do Mimoso" },
      { src: "/pacotes-promo/pkg2-2.webp", alt: "Mergulho na Gruta do Mimoso" },
      { src: "/pacotes-promo/pkg2-3.jpg", alt: "Cachoeiras da Estância Mimosa" },
      { src: "/pacotes-promo/pkg2-4.jpg", alt: "Cachoeira em Bonito" },
      { src: "/pacotes-promo/pkg2-5.webp", alt: "Flutuação no Rio da Prata" },
      { src: "/pacotes-promo/pkg2-6.jpg", alt: "Águas cristalinas de Bonito" },
    ],
  },
  {
    days: 3,
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
      { src: "/pacotes-promo/pkg34-1.jpeg", alt: "Boia Cross em Bonito" },
      { src: "/pacotes-promo/rio-da-prata.jpg", alt: "Rio da Prata" },
      { src: "/pacotes-promo/estancia-mimosa.jpg", alt: "Estância Mimosa" },
      { src: "/pacotes-promo/gruta-mimoso.jpg", alt: "Gruta do Mimoso" },
    ],
  },
  {
    days: 4,
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
      { src: "/pacotes-promo/pkg34-1.jpeg", alt: "Boia Cross em Bonito" },
      { src: "/pacotes-promo/rio-da-prata.jpg", alt: "Rio da Prata" },
      { src: "/pacotes-promo/estancia-mimosa.jpg", alt: "Estância Mimosa" },
      { src: "/pacotes-promo/gruta-mimoso.jpg", alt: "Gruta do Mimoso" },
      { src: "/pacotes-promo/estrela-formoso.jpg", alt: "Estrela do Formoso" },
    ],
  },
];

/* ---------- COMPARISON ---------- */
export type ComparisonRow = { label: string; values: [string, string, string] };

export const comparisonRows: ComparisonRow[] = [
  { label: "Quantidade de dias", values: ["2 dias", "3 dias", "4 dias"] },
  { label: "Flutuação", values: ["Sim", "Sim", "Sim"] },
  { label: "Cachoeiras", values: ["Sim", "Sim", "Sim"] },
  { label: "Grutas", values: ["Sim", "Sim", "Sim"] },
  { label: "Aventura (Boia Cross)", values: ["—", "Sim", "Sim"] },
  { label: "Almoço incluso", values: ["1 almoço", "2 almoços", "Múltiplos"] },
  { label: "Quantidade de atrações", values: ["3", "4", "5"] },
  {
    label: "Ideal para",
    values: ["Bate e volta", "Experiência completa", "Roteiro tranquilo"],
  },
];

/* ---------- HOW IT WORKS ---------- */
export type HowItWorksStep = { n: number; title: string; desc: string };

export const howItWorksSteps: HowItWorksStep[] = [
  { n: 1, title: "Escolha seu pacote", desc: "2, 3 ou 4 dias." },
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
  { src: "/pacotes-promo/pkg2-1.webp", label: "Gruta do Mimoso" },
  { src: "/pacotes-promo/pkg2-3.jpg", label: "Estância Mimosa" },
  { src: "/pacotes-promo/pkg34-1.jpeg", label: "Boia Cross" },
  { src: "/pacotes-promo/pkg2-5.webp", label: "Rio da Prata" },
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
