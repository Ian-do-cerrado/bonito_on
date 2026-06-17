"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "pt" | "en" | "es"

interface Translations {
  [key: string]: {
    pt: string
    en: string
    es: string
  }
}

const translations: Translations = {
  // Navigation
  home: { pt: "HOME", en: "HOME", es: "INICIO" },
  tours: { pt: "PASSEIOS", en: "TOURS", es: "PASEOS" },
  gastronomy: { pt: "GASTRONOMIA", en: "GASTRONOMY", es: "GASTRONOMÍA" },
  accommodations: { pt: "HOSPEDAGENS", en: "ACCOMMODATIONS", es: "ALOJAMIENTOS" },
  atracoes: { pt: "ATRAÇÕES", en: "ATTRACTIONS", es: "ATRACCIONES" },
  pacotes: { pt: "PACOTES", en: "PACKAGES", es: "PAQUETES" },
  blog: { pt: "BLOG", en: "BLOG", es: "BLOG" },
  contact: { pt: "CONTATO", en: "CONTACT", es: "CONTACTO" },
  admin: { pt: "Admin", en: "Admin", es: "Admin" },
  packages: { pt: "PACOTES", en: "PACKAGES", es: "PAQUETES" },

  // Hero Section
  heroTitle1: { pt: "Passeios Incríveis", en: "Amazing Tours", es: "Paseos Increíbles" },
  heroTitle2: { pt: "Esperam Por Você", en: "Await You", es: "Te Esperan" },
  heroButton: { pt: "Fale com um Especialista!", en: "Talk to a Specialist!", es: "¡Habla con un Especialista!" },
  heroDiscover: { pt: "Descubra", en: "Discover", es: "Descubre" },
  heroDescription: {
    pt: "Descubra as águas cristalinas, grutas místicas e a natureza exuberante do destino mais encantador do Brasil",
    en: "Discover the crystal-clear waters, mystical caves and exuberant nature of Brazil's most enchanting destination",
    es: "Descubre las aguas cristalinas, grutas místicas y la naturaleza exuberante del destino más encantador de Brasil",
  },
  heroExplore: { pt: "Explore", en: "Explore", es: "Explora" },
  heroClients: { pt: "Clientes", en: "Clients", es: "Clientes" },

  // Packages Section
  packagesTitle: { pt: "Pacotes Completos", en: "Complete Packages", es: "Paquetes Completos" },
  packagesSubtitle: {
    pt: "Experiências completas com hospedagem, passeios e muito mais",
    en: "Complete experiences with accommodation, tours and much more",
    es: "Experiencias completas con alojamiento, paseos y mucho más",
  },
  seeAllPackages: { pt: "Ver Todos os Pacotes", en: "See All Packages", es: "Ver Todos los Paquetes" },
  learnMore: { pt: "Saiba Mais", en: "Learn More", es: "Saber Más" },
  bookNow: { pt: "Reservar", en: "Book Now", es: "Reservar" },
  days: { pt: "dias", en: "days", es: "días" },
  from: { pt: "A partir de", en: "From", es: "Desde" },
  includes: { pt: "Inclui", en: "Includes", es: "Incluye" },
  upTo: { pt: "Até", en: "Up to", es: "Hasta" },
  people: { pt: "pessoas", en: "people", es: "personas" },

  // Tours Section
  toursInBonito: { pt: "em Bonito", en: "in Bonito", es: "en Bonito" },
  seeAll: { pt: "Ver todos", en: "See all", es: "Ver todos" },
  seeAllAttractions: { pt: "Ver Todas as Atrações", en: "See All Attractions", es: "Ver Todas las Atracciones" },
  discoverAllOptions: {
    pt: "Descubra todas as opções de passeios e atividades em Bonito",
    en: "Discover all tour and activity options in Bonito",
    es: "Descubre todas las opciones de paseos y actividades en Bonito",
  },
  all: { pt: "Todos", en: "All", es: "Todos" },
  passeios: { pt: "Passeios", en: "Tours", es: "Paseos" },
  locations: { pt: "Hospedagens", en: "Accommodations", es: "Alojamientos" },
  food: { pt: "Gastronomia", en: "Gastronomy", es: "Gastronomía" },
  transportation: { pt: "Transporte", en: "Transportation", es: "Transporte" },
  events: { pt: "Eventos", en: "Events", es: "Eventos" },
  reserve: { pt: "Reservar", en: "Reserve", es: "Reservar" },
  searchTours: { pt: "Procurar Passeio", en: "Search Tour", es: "Buscar Paseo" },
  verPrecosProximoSemestre: { pt: "Ver Preços do Proximo Semestre", en: "See Next Semester Prices", es: "Ver Precios del Próximo Semestre" },

  // Attractions Section
  attractionsTitle: { pt: "Atrações", en: "Attractions", es: "Atracciones" },
  attractionsSubtitle: {
    pt: "Gastronomia, hospedagem, transporte e eventos em Bonito",
    en: "Gastronomy, accommodation, transportation and events in Bonito",
    es: "Gastronomía, alojamiento, transporte y eventos en Bonito",
  },

  // Tarifário Categories
  adventure: { pt: "Aventura", en: "Adventure", es: "Aventura" },
  contemplation: { pt: "Contemplação", en: "Contemplation", es: "Contemplación" },
  waterfall: { pt: "Cachoeira", en: "Waterfall", es: "Cascada" },
  rappelling: { pt: "Rapel", en: "Rappelling", es: "Rappel" },
  horseback: { pt: "Cavalgada", en: "Horseback Riding", es: "Cabalgata" },
  biking: { pt: "Passeio de Bike", en: "Bike Tour", es: "Paseo en Bici" },
  scubaDiving: { pt: "Mergulho com Cilindro", en: "Scuba Diving", es: "Buceo con Cilindro" },
  resort: { pt: "Balneário", en: "Resort", es: "Balneario" },
  floating: { pt: "Flutuação", en: "Floating", es: "Flotación" },
  pantanal: { pt: "Pantanal", en: "Pantanal", es: "Pantanal" },
  cave: { pt: "Gruta", en: "Cave", es: "Gruta" },

  // Tarifário Page
  priceList: { pt: "Tarifário", en: "Price List", es: "Tarifario" },
  priceListSubtitle: {
    pt: "Confira todos os nossos passeios e atividades organizados por categoria",
    en: "Check out all our tours and activities organized by category",
    es: "Consulta todos nuestros paseos y actividades organizados por categoría",
  },
  backToHome: { pt: "Voltar ao Início", en: "Back to Home", es: "Volver al Inicio" },

  // Tarifario page
  passeiosPageTitle: { pt: "Passeios em Bonito", en: "Tours in Bonito", es: "Paseos en Bonito" },
  passeiosPageSubtitle: {
    pt: "Encontre experiências, filtre por categoria e consulte os passeios disponíveis em Bonito.",
    en: "Find experiences, filter by category and browse tours available in Bonito.",
    es: "Encuentra experiencias, filtra por categoría y consulta los paseos disponibles en Bonito.",
  },
  allToursHeading: { pt: "Todos os passeios", en: "All tours", es: "Todos los paseos" },
  futurePricesBtn: { pt: "Ver preços do próximo semestre", en: "View next semester prices", es: "Ver precios del próximo semestre" },
  filterByCategory: { pt: "Filtrar por categoria", en: "Filter by category", es: "Filtrar por categoría" },
  dragToFilterTours: {
    pt: "Arraste para ver mais categorias e toque para filtrar os passeios",
    en: "Drag to see more categories and tap to filter tours",
    es: "Desliza para ver más categorías y toca para filtrar los paseos",
  },
  clickToFilterTours: {
    pt: "Clique em uma categoria para filtrar os passeios",
    en: "Click a category to filter the tours",
    es: "Haz clic en una categoría para filtrar los paseos",
  },

  // Atracoes page
  atracoesPageTitle: { pt: "Atrações em Bonito", en: "Attractions in Bonito", es: "Atracciones en Bonito" },
  atracoesPageSubtitle: {
    pt: "Encontre gastronomia, hospedagens, transportes e eventos para completar sua experiência.",
    en: "Find gastronomy, accommodations, transportation and events to complete your experience.",
    es: "Encuentra gastronomía, alojamientos, transporte y eventos para completar tu experiencia.",
  },
  allAttractions: { pt: "Todas", en: "All", es: "Todas" },
  atracaoHospedagem: { pt: "Hospedagem", en: "Accommodation", es: "Alojamiento" },
  noAttractionsFound: { pt: "Nenhuma atração encontrada", en: "No attractions found", es: "No se encontraron atracciones" },
  noAttractionsInCategory: {
    pt: "Não há atrações cadastradas nesta categoria ainda.",
    en: "There are no attractions registered in this category yet.",
    es: "No hay atracciones registradas en esta categoría aún.",
  },

  // Pacotes page
  categoryPlaceholder: { pt: "Categoria", en: "Category", es: "Categoría" },
  categoryEconomico: { pt: "Econômico", en: "Budget", es: "Económico" },
  categoryLuxo: { pt: "Luxo", en: "Luxury", es: "Lujo" },
  categoryPadrao: { pt: "Padrão", en: "Standard", es: "Estándar" },

  // Blog page
  blogPageTitle: { pt: "Blog", en: "Blog", es: "Blog" },
  blogPageSubtitle: {
    pt: "Descubra dicas, guias e histórias sobre Bonito e região",
    en: "Discover tips, guides and stories about Bonito and the region",
    es: "Descubre consejos, guías e historias sobre Bonito y la región",
  },
  searchPosts: { pt: "Buscar posts...", en: "Search posts...", es: "Buscar publicaciones..." },
  allPosts: { pt: "Todos", en: "All", es: "Todos" },
  noPostsFound: { pt: "Nenhum post encontrado", en: "No posts found", es: "No se encontraron publicaciones" },
  tryDifferentSearch: { pt: "Tente uma busca diferente ou remova os filtros", en: "Try a different search or remove filters", es: "Intenta una búsqueda diferente o elimina los filtros" },
  viewAllPosts: { pt: "Ver Blog", en: "View Blog", es: "Ver Blog" },
  dragToFilterPosts: {
    pt: "Arraste para ver mais categorias e toque para filtrar os posts",
    en: "Drag to see more categories and tap to filter posts",
    es: "Desliza para ver más categorías y toca para filtrar las publicaciones",
  },
  clickToFilterPosts: {
    pt: "Clique em uma categoria para filtrar os posts",
    en: "Click a category to filter posts",
    es: "Haz clic en una categoría para filtrar las publicaciones",
  },
  postFoundSingular: { pt: "post encontrado", en: "post found", es: "publicación encontrada" },
  postsFoundPlural: { pt: "posts encontrados", en: "posts found", es: "publicaciones encontradas" },

  // Blog Section
  blogTitle: { pt: "Blog", en: "Blog", es: "Blog" },
  blogSubtitle: {
    pt: "Descubra dicas, guias e histórias sobre Bonito e o turismo na região",
    en: "Discover tips, guides and stories about Bonito and tourism in the region",
    es: "Descubre consejos, guías e historias sobre Bonito y el turismo en la región",
  },
  readMore: { pt: "Ler", en: "Read", es: "Leer" },
  readTime: { pt: "min de leitura", en: "min read", es: "min de lectura" },

  // Reviews Section
  reviewsTitle: { pt: "O que nossos clientes dizem", en: "What our clients say", es: "Lo que dicen nuestros clientes" },
  reviewsSubtitle: {
    pt: "Confira as avaliações reais de quem já viveu experiências incríveis conosco em Bonito",
    en: "Check out real reviews from those who have already lived incredible experiences with us in Bonito",
    es: "Consulta las reseñas reales de quienes ya han vivido experiencias increíbles con nosotros en Bonito",
  },
  googleReviews: { pt: "Google Reviews", en: "Google Reviews", es: "Google Reviews" },
  reviews: { pt: "avaliações", en: "reviews", es: "reseñas" },
  seeOnGoogle: { pt: "Ver no Google", en: "See on Google", es: "Ver en Google" },
  joinStories: {
    pt: "Quer fazer parte dessas histórias?",
    en: "Want to be part of these stories?",
    es: "¿Quieres ser parte de estas historias?",
  },
  joinStoriesDesc: {
    pt: "Planeje sua viagem dos sonhos para Bonito conosco e crie memórias inesquecíveis!",
    en: "Plan your dream trip to Bonito with us and create unforgettable memories!",
    es: "¡Planifica tu viaje de ensueño a Bonito con nosotros y crea recuerdos inolvidables!",
  },

  // Tour Cards
  knowMore: { pt: "Saiba mais", en: "Learn more", es: "Saber más" },
  perPerson: { pt: "por pessoa", en: "per person", es: "por persona" },

  // Categories
  allToursTitle: { pt: "Todos os Itens", en: "All Items", es: "Todos los Elementos" },
  passeiosTitle: { pt: "Passeios", en: "Tours", es: "Paseos" },
  locationsTitle: { pt: "Hospedagens", en: "Accommodations", es: "Alojamientos" },
  foodTitle: { pt: "Gastronomia", en: "Gastronomy", es: "Gastronomía" },
  transportationTitle: { pt: "Transporte", en: "Transportation", es: "Transporte" },

  // Admin
  adminPanel: { pt: "Painel Administrativo", en: "Administrative Panel", es: "Panel Administrativo" },
  backToSite: { pt: "Voltar ao Site", en: "Back to Site", es: "Volver al Sitio" },
  addTour: { pt: "Adicionar Item", en: "Add Item", es: "Agregar Elemento" },
  addNewTour: { pt: "Adicionar Novo Item", en: "Add New Item", es: "Agregar Nuevo Elemento" },
  noToursFound: {
    pt: "Nenhum item encontrado nesta categoria.",
    en: "No items found in this category.",
    es: "No se encontraron elementos en esta categoría.",
  },
  addFirstTour: { pt: "Adicionar Primeiro Item", en: "Add First Item", es: "Agregar Primer Elemento" },

  // Form fields
  title: { pt: "Título", en: "Title", es: "Título" },
  description: { pt: "Descrição", en: "Description", es: "Descripción" },
  price: { pt: "Preço (R$)", en: "Price (R$)", es: "Precio (R$)" },
  rating: { pt: "Avaliação", en: "Rating", es: "Calificación" },
  category: { pt: "Categoria", en: "Category", es: "Categoría" },
  imageUrl: { pt: "URL da Imagem", en: "Image URL", es: "URL de Imagen" },
  cancel: { pt: "Cancelar", en: "Cancel", es: "Cancelar" },
  save: { pt: "Salvar", en: "Save", es: "Guardar" },

  // Language change notification
  languageChanged: {
    pt: "Idioma alterado para Português",
    en: "Language changed to English",
    es: "Idioma cambiado a Español",
  },

  // Footer translations
  quickLinks: { pt: "Links Rápidos", en: "Quick Links", es: "Enlaces Rápidos" },
  completePackages: { pt: "Pacotes Completos", en: "Complete Packages", es: "Paquetes Completos" },
  localGastronomy: { pt: "Gastronomia Local", en: "Local Gastronomy", es: "Gastronomía Local" },
  blogAndTips: { pt: "Blog e Dicas", en: "Blog & Tips", es: "Blog y Consejos" },
  popularTours: { pt: "Passeios Populares", en: "Popular Tours", es: "Paseos Populares" },
  address: { pt: "Endereço", en: "Address", es: "Dirección" },
  phones: { pt: "Telefones", en: "Phones", es: "Teléfonos" },
  email: { pt: "E-mail", en: "E-mail", es: "E-mail" },
  schedule: { pt: "Horário", en: "Schedule", es: "Horario" },
  emergency24h: { pt: "Emergência 24h", en: "24h Emergency", es: "Emergencia 24h" },
  socialMedia: { pt: "Redes Sociais", en: "Social Media", es: "Redes Sociales" },
  contactUsNow: { pt: "Fale Conosco Agora", en: "Contact Us Now", es: "Contáctanos Ahora" },
  basedOnGoogleReviews: {
    pt: "Baseado em 500+ avaliações no Google",
    en: "Based on 500+ Google reviews",
    es: "Basado en 500+ reseñas de Google",
  },
  seeAllReviews: { pt: "Ver todas as avaliações", en: "See all reviews", es: "Ver todas las reseñas" },
  copyright: {
    pt: "© {year} BonitoON Turismo. Todos os direitos reservados.",
    en: "© {year} BonitoON Tourism. All rights reserved.",
    es: "© {year} BonitoON Turismo. Todos los derechos reservados.",
  },
  privacyPolicy: { pt: "Política de Privacidade", en: "Privacy Policy", es: "Política de Privacidad" },
  termsOfUse: { pt: "Termos de Uso", en: "Terms of Use", es: "Términos de Uso" },
  cancellationPolicy: { pt: "Política de Cancelamento", en: "Cancellation Policy", es: "Política de Cancelación" },
  weAccept: { pt: "Aceitamos:", en: "We accept:", es: "Aceptamos:" },

  // Season Section
  seasonTitle: { pt: "Temporada Atual", en: "Current Season", es: "Temporada Actual" },
  highSeason: { pt: "Alta Temporada", en: "High Season", es: "Temporada Alta" },
  lowSeason: { pt: "Baixa Temporada", en: "Low Season", es: "Temporada Baja" },
  highSeasonDesc: {
    pt: "Período de maior movimento turístico com preços mais elevados",
    en: "Peak tourist period with higher prices",
    es: "Período de mayor movimiento turístico con precios más altos",
  },
  lowSeasonDesc: {
    pt: "Período com menos movimento e preços mais acessíveis",
    en: "Period with less movement and more affordable prices",
    es: "Período con menos movimiento y precios más accesibles",
  },
  highSeasonPeriod: { pt: "Períodos específicos", en: "Specific periods", es: "Períodos específicos" },
  lowSeasonPeriod: { pt: "Demais períodos", en: "Other periods", es: "Otros períodos" },
  advantages: { pt: "Vantagens", en: "Advantages", es: "Ventajas" },
  considerations: { pt: "Considerações", en: "Considerations", es: "Consideraciones" },
  highSeasonAdvantages: {
    pt: "• Mais opções de passeios\n• Programação cultural\n• Melhor infraestrutura",
    en: "• More tour options\n• Cultural programming\n• Better infrastructure",
    es: "• Más opciones de paseos\n• Programación cultural\n• Mejor infraestructura",
  },
  highSeasonConsiderations: {
    pt: "• Preços mais elevados\n• Maior movimento turístico\n• Necessário reservar com antecedência",
    en: "• Higher prices\n• More tourist traffic\n• Need to book in advance",
    es: "• Precios más altos\n• Mayor movimiento turístico\n• Necesario reservar con anticipación",
  },
  lowSeasonAdvantages: {
    pt: "• Preços mais acessíveis\n• Menos multidões\n• Atendimento mais personalizado",
    en: "• More affordable prices\n• Fewer crowds\n• More personalized service",
    es: "• Precios más accesibles\n• Menos multitudes\n• Servicio más personalizado",
  },
  lowSeasonConsiderations: {
    pt: "• Menos opções de passeios\n• Alguns estabelecimentos fechados\n• Menos eventos culturais",
    en: "• Fewer tour options\n• Some establishments closed\n• Fewer cultural events",
    es: "• Menos opciones de paseos\n• Algunos establecimientos cerrados\n• Menos eventos culturales",
  },
  planYourTrip: { pt: "Ver Calendário de Temporadas", en: "View Season Calendar", es: "Ver Calendario de Temporadas" },
  seasonCalendar: {
    pt: "Calendário de Temporadas 2025",
    en: "2025 Season Calendar",
    es: "Calendario de Temporadas 2025",
  },
  january: { pt: "Janeiro", en: "January", es: "Enero" },
  february: { pt: "Fevereiro", en: "February", es: "Febrero" },
  march: { pt: "Março", en: "March", es: "Marzo" },
  april: { pt: "Abril", en: "April", es: "Abril" },
  may: { pt: "Maio", en: "May", es: "Mayo" },
  june: { pt: "Junho", en: "June", es: "Junio" },
  july: { pt: "Julho", en: "July", es: "Julio" },
  august: { pt: "Agosto", en: "August", es: "Agosto" },
  september: { pt: "Setembro", en: "September", es: "Septiembre" },
  october: { pt: "Outubro", en: "October", es: "Octubre" },
  november: { pt: "Novembro", en: "November", es: "Noviembre" },
  december: { pt: "Dezembro", en: "December", es: "Diciembre" },
  schoolHolidays: { pt: "Férias Escolares", en: "School Holidays", es: "Vacaciones Escolares" },
  carnival: { pt: "Carnaval", en: "Carnival", es: "Carnaval" },
  easterHoliday: { pt: "Semana Santa/Páscoa", en: "Easter Holiday", es: "Semana Santa/Pascua" },
  laborDay: { pt: "Dia do Trabalho", en: "Labor Day", es: "Día del Trabajo" },
  corpusChristi: { pt: "Corpus Christi", en: "Corpus Christi", es: "Corpus Christi" },
  closeCalendar: { pt: "Fechar Calendário", en: "Close Calendar", es: "Cerrar Calendário" },
  firstSemester: { pt: "Primeiro Semestre", en: "First Semester", es: "Primer Semestre" },
  secondSemester: { pt: "Segundo Semestre", en: "Second Semester", es: "Segundo Semestre" },

  // WhatsApp button labels
  bookWhatsApp: { pt: "Reservar pelo WhatsApp", en: "Book via WhatsApp", es: "Reservar por WhatsApp" },
  consultWhatsApp: { pt: "Consultar pelo WhatsApp", en: "Consult via WhatsApp", es: "Consultar por WhatsApp" },
  contactWhatsApp: { pt: "Fale Conosco pelo WhatsApp", en: "Contact Us via WhatsApp", es: "Contáctanos por WhatsApp" },

  // Navigation / back buttons
  backBtn: { pt: "Voltar", en: "Back", es: "Volver" },
  backToTours: { pt: "Voltar aos Passeios", en: "Back to Tours", es: "Volver a los Paseos" },
  backToPackages: { pt: "Voltar aos Pacotes", en: "Back to Packages", es: "Volver a los Paquetes" },
  backToBlog: { pt: "Voltar ao Blog", en: "Back to Blog", es: "Volver al Blog" },

  // Loading / not found
  loadingLabel: { pt: "Carregando...", en: "Loading...", es: "Cargando..." },
  loadingPackages: { pt: "Carregando pacotes...", en: "Loading packages...", es: "Cargando paquetes..." },
  noPackageFound: { pt: "Pacote não encontrado", en: "Package not found", es: "Paquete no encontrado" },
  itemNotFound: { pt: "Item não encontrado", en: "Item not found", es: "Elemento no encontrado" },
  postNotFound: { pt: "Post não encontrado", en: "Post not found", es: "Publicación no encontrada" },
  attractionNotFound: { pt: "Atração não encontrada", en: "Attraction not found", es: "Atracción no encontrada" },

  // Tour card
  freeUpToYear: { pt: "Grátis até:", en: "Free up to:", es: "Gratis hasta:" },

  // Package card
  perMonth: { pt: "/mês", en: "/month", es: "/mes" },

  // Difficulty
  difficultyLabel: { pt: "Dificuldade", en: "Difficulty", es: "Dificultad" },
  difficultyEasy: { pt: "Fácil", en: "Easy", es: "Fácil" },
  difficultyModerate: { pt: "Moderado", en: "Moderate", es: "Moderado" },
  difficultyHard: { pt: "Difícil", en: "Difficult", es: "Difícil" },
  difficultyUnknown: { pt: "Não informado", en: "Not specified", es: "No informado" },

  // Package/tour detail — sidebar
  reserveThisPackage: { pt: "Reserve este pacote", en: "Reserve this package", es: "Reserva este paquete" },
  reserveThisTour: { pt: "Reserve este passeio", en: "Reserve this tour", es: "Reserva este paseo" },
  durationLabel: { pt: "Duração", en: "Duration", es: "Duración" },
  groupLabel: { pt: "Grupo", en: "Group", es: "Grupo" },
  savingsOf: { pt: "Economia de", en: "Savings of", es: "Ahorro de" },
  cancellationFree: { pt: "Cancelamento gratuito até 48h antes", en: "Free cancellation up to 48h before", es: "Cancelación gratuita hasta 48h antes" },
  whatsappConfirmation: { pt: "Confirmação imediata por WhatsApp", en: "Immediate WhatsApp confirmation", es: "Confirmación inmediata por WhatsApp" },
  certifiedGuides: { pt: "Guias especializados e certificados", en: "Certified specialist guides", es: "Guías especializados y certificados" },
  personalAccident: { pt: "Seguro de acidentes pessoais incluído", en: "Personal accident insurance included", es: "Seguro de accidentes personales incluido" },
  needHelp: { pt: "Precisa de ajuda?", en: "Need help?", es: "¿Necesita ayuda?" },
  importantInfo: { pt: "Informações importantes", en: "Important information", es: "Información importante" },

  // Package detail — sections
  overview: { pt: "Visão Geral", en: "Overview", es: "Vista General" },
  packageHighlights: { pt: "Destaques do Pacote", en: "Package Highlights", es: "Destacados del Paquete" },
  whatsIncluded: { pt: "O que está incluído", en: "What's included", es: "Qué está incluido" },
  bestSeasonVisit: { pt: "Melhor Época para Visitar", en: "Best Time to Visit", es: "Mejor Época para Visitar" },
  detailedItinerary: { pt: "Roteiro Detalhado", en: "Detailed Itinerary", es: "Itinerario Detallado" },
  dayLabel: { pt: "Dia", en: "Day", es: "Día" },
  activitiesLabel: { pt: "Atividades", en: "Activities", es: "Actividades" },
  mealsLabel: { pt: "Refeições", en: "Meals", es: "Comidas" },
  accommodationLabel: { pt: "Acomodação", en: "Accommodation", es: "Alojamiento" },

  // Packages listing page — filters
  searchPackagesPlaceholder: { pt: "Buscar pacotes...", en: "Search packages...", es: "Buscar paquetes..." },
  allCategories: { pt: "Todas as categorias", en: "All categories", es: "Todas las categorías" },
  sortByLabel: { pt: "Ordenar por", en: "Sort by", es: "Ordenar por" },
  sortLowestPrice: { pt: "Menor preço", en: "Lowest price", es: "Menor precio" },
  sortHighestPrice: { pt: "Maior preço", en: "Highest price", es: "Mayor precio" },
  sortShortestDuration: { pt: "Menor duração", en: "Shortest duration", es: "Menor duración" },
  sortLongestDuration: { pt: "Maior duração", en: "Longest duration", es: "Mayor duración" },
  sortBestRating: { pt: "Melhor avaliação", en: "Best rating", es: "Mejor valoración" },
  packagesFoundPlural: { pt: "pacotes encontrados", en: "packages found", es: "paquetes encontrados" },
  packagesFoundSingular: { pt: "pacote encontrado", en: "package found", es: "paquete encontrado" },
  noPackagesFiltered: { pt: "Nenhum pacote encontrado", en: "No packages found", es: "No se encontraron paquetes" },
  tryAdjustFilters: { pt: "Tente ajustar os filtros ou buscar por outros termos.", en: "Try adjusting the filters or searching for other terms.", es: "Intente ajustar los filtros o buscar otros términos." },
  clearFilters: { pt: "Limpar filtros", en: "Clear filters", es: "Limpiar filtros" },
  completePackagesTitle: { pt: "Pacotes Completos", en: "Complete Packages", es: "Paquetes Completos" },
  completePackagesSubtitle: { pt: "Experiências completas em Bonito com hospedagem, passeios e refeições inclusos", en: "Complete experiences in Bonito with accommodation, tours and meals included", es: "Experiencias completas en Bonito con alojamiento, paseos y comidas incluidas" },
  seeDetails: { pt: "Ver Detalhes", en: "See Details", es: "Ver Detalles" },

  // Attraction detail
  aboutSection: { pt: "Sobre", en: "About", es: "Sobre" },
  highlightsSection: { pt: "Destaques", en: "Highlights", es: "Destacados" },
  informationSection: { pt: "Informações", en: "Information", es: "Información" },
  interestedTitle: { pt: "Interessado?", en: "Interested?", es: "¿Interesado?" },
  interestedDesc: { pt: "Entre em contato para mais informações e reservas", en: "Get in touch for more information and bookings", es: "Contáctanos para más información y reservas" },
  quickResponseGuaranteed: { pt: "Resposta rápida garantida", en: "Quick response guaranteed", es: "Respuesta rápida garantizada" },
  priceLabel: { pt: "Preço", en: "Price", es: "Precio" },
  capacityLabel: { pt: "Capacidade", en: "Capacity", es: "Capacidad" },
  categoryColon: { pt: "Categoria:", en: "Category:", es: "Categoría:" },
  ratingColon: { pt: "Avaliação:", en: "Rating:", es: "Valoración:" },
  priceColon: { pt: "Preço:", en: "Price:", es: "Precio:" },
  attrGastronomy: { pt: "Gastronomia", en: "Gastronomy", es: "Gastronomía" },
  attrAccommodation: { pt: "Hospedagem", en: "Accommodation", es: "Alojamiento" },
  attrTransport: { pt: "Transporte", en: "Transportation", es: "Transporte" },
  attrEvents: { pt: "Eventos", en: "Events", es: "Eventos" },

  // Blog post
  imageGallery: { pt: "Galeria de Imagens", en: "Image Gallery", es: "Galería de Imágenes" },
  sharePost: { pt: "Compartilhar", en: "Share", es: "Compartir" },

  // Passeio / valor-futuro detail (shared strings)
  valoresTitle: { pt: "Valores", en: "Prices", es: "Precios" },
  pricesMayChange: { pt: "Os preços podem sofrer alterações, fale com o agente.", en: "Prices may change, talk to an agent.", es: "Los precios pueden cambiar, consulte al agente." },
  adultLabel: { pt: "Adulto", en: "Adult", es: "Adulto" },
  childLowSeason: { pt: "Criança (Baixa Temporada)", en: "Child (Low Season)", es: "Niño (Temporada Baja)" },
  descriptionSection: { pt: "Descrição", en: "Description", es: "Descripción" },
  locationLabel: { pt: "Localização", en: "Location", es: "Ubicación" },
  includedTransfer: { pt: "Disponível a contratação de transfer", en: "Transfer available upon request", es: "Disponible la contratación de transfer" },
  includedGuide: { pt: "Guia especializado", en: "Specialist guide", es: "Guía especializado" },
  includedEquipment: { pt: "Equipamentos necessários", en: "Necessary equipment", es: "Equipos necesarios" },
  includedInsurance: { pt: "Seguro de acidentes pessoais", en: "Personal accident insurance", es: "Seguro de accidentes personales" },

  // Legal pages shared
  phoneLabel: { pt: "Telefone", en: "Phone", es: "Teléfono" },

  // Termos de Uso page
  termosUsoTitle: { pt: "Termos de Uso", en: "Terms of Use", es: "Términos de Uso" },
  termosUsoDate: { pt: "Última atualização: Janeiro de 2024", en: "Last updated: January 2024", es: "Última actualización: Enero de 2024" },
  termosUso1Title: { pt: "1. Aceitação dos Termos", en: "1. Acceptance of Terms", es: "1. Aceptación de los Términos" },
  termosUso1Body: { pt: "Ao utilizar os serviços da BonitoON, você concorda com estes termos de uso. Se não concordar, não utilize nossos serviços.", en: "By using BonitoON services, you agree to these terms of use. If you do not agree, please do not use our services.", es: "Al utilizar los servicios de BonitoON, usted acepta estos términos de uso. Si no está de acuerdo, no utilice nuestros servicios." },
  termosUso2Title: { pt: "2. Serviços Oferecidos", en: "2. Services Offered", es: "2. Servicios Ofrecidos" },
  termosUso2Body: { pt: "A BonitoON oferece serviços de turismo em Bonito, MS, incluindo:", en: "BonitoON offers tourism services in Bonito, MS, including:", es: "BonitoON ofrece servicios de turismo en Bonito, MS, incluyendo:" },
  termosUso2Li1: { pt: "Organização de passeios e excursões", en: "Organization of tours and excursions", es: "Organización de paseos y excursiones" },
  termosUso2Li2: { pt: "Reservas de hospedagem", en: "Accommodation reservations", es: "Reservas de alojamiento" },
  termosUso2Li3: { pt: "Serviços de transporte", en: "Transportation services", es: "Servicios de transporte" },
  termosUso2Li4: { pt: "Consultoria em turismo", en: "Tourism consulting", es: "Consultoría en turismo" },
  termosUso3Title: { pt: "3. Reservas e Pagamentos", en: "3. Reservations and Payments", es: "3. Reservas y Pagos" },
  termosUso3Body: { pt: "As reservas estão sujeitas à disponibilidade. Os preços podem variar conforme a temporada. O pagamento deve ser realizado conforme as condições acordadas.", en: "Reservations are subject to availability. Prices may vary depending on the season. Payment must be made according to the agreed conditions.", es: "Las reservas están sujetas a disponibilidad. Los precios pueden variar según la temporada. El pago debe realizarse conforme a las condiciones acordadas." },
  termosUso4Title: { pt: "4. Cancelamentos", en: "4. Cancellations", es: "4. Cancelaciones" },
  termosUso4Body: { pt: "Cancelamentos devem ser comunicados com antecedência mínima de 48 horas. Consulte nossa política de cancelamento para detalhes sobre reembolsos.", en: "Cancellations must be communicated at least 48 hours in advance. Please consult our cancellation policy for details on refunds.", es: "Los cancelamientos deben comunicarse con al menos 48 horas de anticipación. Consulte nuestra política de cancelación para obtener detalles sobre reembolsos." },
  termosUso5Title: { pt: "5. Responsabilidades", en: "5. Responsibilities", es: "5. Responsabilidades" },
  termosUso5Body: { pt: "A BonitoON se compromete a fornecer serviços de qualidade, mas não se responsabiliza por fatores externos como condições climáticas ou problemas de terceiros.", en: "BonitoON is committed to providing quality services but is not responsible for external factors such as weather conditions or third-party issues.", es: "BonitoON se compromete a brindar servicios de calidad, pero no se responsabiliza por factores externos como condiciones climáticas o problemas de terceros." },
  termosUso6Title: { pt: "6. Propriedade Intelectual", en: "6. Intellectual Property", es: "6. Propiedad Intelectual" },
  termosUso6Body: { pt: "Todo o conteúdo deste site é propriedade da BonitoON e está protegido por direitos autorais.", en: "All content on this site is the property of BonitoON and is protected by copyright.", es: "Todo el contenido de este sitio es propiedad de BonitoON y está protegido por derechos de autor." },
  termosUso7Title: { pt: "7. Modificações", en: "7. Modifications", es: "7. Modificaciones" },
  termosUso7Body: { pt: "Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.", en: "We reserve the right to modify these terms at any time. Changes will take effect immediately upon publication.", es: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación." },
  termosUso8Title: { pt: "8. Contato", en: "8. Contact", es: "8. Contacto" },
  termosUso8Body: { pt: "Para dúvidas sobre estes termos:", en: "For questions about these terms:", es: "Para dudas sobre estos términos:" },

  // Política de Privacidade page
  politicaPrivTitle: { pt: "Política de Privacidade", en: "Privacy Policy", es: "Política de Privacidad" },
  politicaPrivDate: { pt: "Última atualização: Janeiro de 2024", en: "Last updated: January 2024", es: "Última actualización: Enero de 2024" },
  politicaPriv1Title: { pt: "1. Informações que Coletamos", en: "1. Information We Collect", es: "1. Información que Recopilamos" },
  politicaPriv1Body: { pt: "A BonitoON coleta informações que você nos fornece diretamente, como nome, e-mail, telefone e preferências de viagem quando você entra em contato conosco ou faz uma reserva.", en: "BonitoON collects information you provide directly, such as name, email, phone number and travel preferences when you contact us or make a reservation.", es: "BonitoON recopila la información que nos proporciona directamente, como nombre, correo electrónico, teléfono y preferencias de viaje cuando se pone en contacto con nosotros o realiza una reserva." },
  politicaPriv2Title: { pt: "2. Como Usamos suas Informações", en: "2. How We Use Your Information", es: "2. Cómo Usamos su Información" },
  politicaPriv2Body: { pt: "Utilizamos suas informações para:", en: "We use your information to:", es: "Utilizamos su información para:" },
  politicaPriv2Li1: { pt: "Processar suas reservas e fornecer nossos serviços", en: "Process your reservations and provide our services", es: "Procesar sus reservas y brindar nuestros servicios" },
  politicaPriv2Li2: { pt: "Entrar em contato sobre sua viagem", en: "Get in touch about your trip", es: "Ponernos en contacto sobre su viaje" },
  politicaPriv2Li3: { pt: "Enviar informações sobre ofertas e novidades (com seu consentimento)", en: "Send information about offers and news (with your consent)", es: "Enviar información sobre ofertas y novedades (con su consentimiento)" },
  politicaPriv2Li4: { pt: "Melhorar nossos serviços", en: "Improve our services", es: "Mejorar nuestros servicios" },
  politicaPriv3Title: { pt: "3. Compartilhamento de Informações", en: "3. Sharing of Information", es: "3. Compartición de Información" },
  politicaPriv3Body: { pt: "Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.", en: "We do not sell, rent, or share your personal information with third parties, except when necessary to provide our services or when required by law.", es: "No vendemos, alquilamos ni compartimos su información personal con terceros, excepto cuando sea necesario para prestar nuestros servicios o cuando lo exija la ley." },
  politicaPriv4Title: { pt: "4. Segurança", en: "4. Security", es: "4. Seguridad" },
  politicaPriv4Body: { pt: "Implementamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.", en: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.", es: "Implementamos medidas de seguridad adecuadas para proteger su información personal contra el acceso no autorizado, alteración, divulgación o destrucción." },
  politicaPriv5Title: { pt: "5. Seus Direitos", en: "5. Your Rights", es: "5. Sus Derechos" },
  politicaPriv5Body: { pt: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco para exercer esses direitos.", en: "You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.", es: "Usted tiene el derecho de acceder, corregir o eliminar su información personal. Contáctenos para ejercer estos derechos." },
  politicaPriv6Title: { pt: "6. Contato", en: "6. Contact", es: "6. Contacto" },
  politicaPriv6Body: { pt: "Para questões sobre esta política, entre em contato:", en: "For questions about this policy, please contact:", es: "Para preguntas sobre esta política, contáctenos:" },

  // Política de Cancelamento page
  politicaCancelTitle: { pt: "Política de Cancelamento", en: "Cancellation Policy", es: "Política de Cancelación" },
  politicaCancelSubtitle: { pt: "Condições para cancelamento de reservas", en: "Conditions for reservation cancellations", es: "Condiciones para la cancelación de reservas" },
  politicaCancelSummaryTitle: { pt: "Resumo da Política", en: "Policy Summary", es: "Resumen de la Política" },
  politicaCancelSummaryBody: { pt: "Oferecemos cancelamento gratuito até 48 horas antes do passeio. Cancelamentos com menos antecedência estão sujeitos a taxas.", en: "We offer free cancellation up to 48 hours before the tour. Cancellations with less notice are subject to fees.", es: "Ofrecemos cancelación gratuita hasta 48 horas antes del paseo. Las cancelaciones con menos anticipación están sujetas a cargos." },
  politicaCancelDeadlinesTitle: { pt: "Prazos de Cancelamento", en: "Cancellation Deadlines", es: "Plazos de Cancelación" },
  politicaCancelFullRefund: { pt: "Reembolso Total", en: "Full Refund", es: "Reembolso Total" },
  politicaCancelFullRefundLabel: { pt: "Cancelamento com 48h+ de antecedência", en: "Cancellation with 48h+ in advance", es: "Cancelación con 48h+ de anticipación" },
  politicaCancelFullRefundDesc: { pt: "100% do valor pago será reembolsado", en: "100% of the amount paid will be refunded", es: "Se reembolsará el 100% del valor pagado" },
  politicaCancelPartialRefund: { pt: "Reembolso Parcial", en: "Partial Refund", es: "Reembolso Parcial" },
  politicaCancelPartialRefundLabel: { pt: "Cancelamento entre 24h e 48h", en: "Cancellation between 24h and 48h", es: "Cancelación entre 24h y 48h" },
  politicaCancelPartialRefundDesc: { pt: "50% do valor pago será reembolsado", en: "50% of the amount paid will be refunded", es: "Se reembolsará el 50% del valor pagado" },
  politicaCancelNoRefund: { pt: "Sem Reembolso", en: "No Refund", es: "Sin Reembolso" },
  politicaCancelNoRefundLabel: { pt: "Cancelamento com menos de 24h", en: "Cancellation with less than 24h notice", es: "Cancelación con menos de 24h de anticipación" },
  politicaCancelNoRefundDesc: { pt: "Não há reembolso do valor pago", en: "There is no refund of the amount paid", es: "No hay reembolso del valor pagado" },
  politicaCancelSpecialTitle: { pt: "Condições Especiais", en: "Special Conditions", es: "Condiciones Especiales" },
  politicaCancelWeatherTitle: { pt: "Condições Climáticas", en: "Weather Conditions", es: "Condiciones Climáticas" },
  politicaCancelWeatherBody: { pt: "Em caso de cancelamento por condições climáticas adversas, oferecemos reagendamento gratuito ou reembolso total.", en: "In case of cancellation due to adverse weather conditions, we offer free rescheduling or a full refund.", es: "En caso de cancelación por condiciones climáticas adversas, ofrecemos reprogramación gratuita o reembolso total." },
  politicaCancelMedicalTitle: { pt: "Emergências Médicas", en: "Medical Emergencies", es: "Emergencias Médicas" },
  politicaCancelMedicalBody: { pt: "Cancelamentos por emergências médicas (com comprovação) têm reembolso total, independente do prazo.", en: "Cancellations due to medical emergencies (with documentation) receive a full refund, regardless of the notice period.", es: "Las cancelaciones por emergencias médicas (con comprobante) tienen reembolso total, independientemente del plazo." },
  politicaCancelPromoTitle: { pt: "Pacotes Promocionais", en: "Promotional Packages", es: "Paquetes Promocionales" },
  politicaCancelPromoBody: { pt: "Pacotes com desconto especial podem ter condições de cancelamento diferenciadas. Consulte as condições específicas.", en: "Packages with special discounts may have different cancellation conditions. Please consult the specific conditions.", es: "Los paquetes con descuento especial pueden tener condiciones de cancelación diferenciadas. Consulte las condiciones específicas." },
  politicaCancelHowTitle: { pt: "Como Cancelar", en: "How to Cancel", es: "Cómo Cancelar" },
  politicaCancelStep1: { pt: "Entre em contato via WhatsApp: (67) 99139-5384", en: "Contact us via WhatsApp: (67) 99139-5384", es: "Contáctenos por WhatsApp: (67) 99139-5384" },
  politicaCancelStep2: { pt: "Ou ligue para: (67) 99139-5384", en: "Or call us at: (67) 99139-5384", es: "O llámenos al: (67) 99139-5384" },
  politicaCancelStep3: { pt: "Informe seu nome e número da reserva", en: "Provide your name and reservation number", es: "Informe su nombre y número de reserva" },
  politicaCancelStep4: { pt: "Receba a confirmação do cancelamento por e-mail", en: "Receive the cancellation confirmation by email", es: "Reciba la confirmación del cancelamiento por correo electrónico" },
  politicaCancelRefundsTitle: { pt: "Processamento de Reembolsos", en: "Refund Processing", es: "Procesamiento de Reembolsos" },
  politicaCancelRefundCC: { pt: "Cartão de crédito: até 2 faturas", en: "Credit card: up to 2 billing cycles", es: "Tarjeta de crédito: hasta 2 facturas" },
  politicaCancelRefundDebit: { pt: "Cartão de débito: até 5 dias úteis", en: "Debit card: up to 5 business days", es: "Tarjeta de débito: hasta 5 días hábiles" },
  politicaCancelRefundPix: { pt: "PIX: até 1 dia útil", en: "PIX: up to 1 business day", es: "PIX: hasta 1 día hábil" },
  politicaCancelRefundTransfer: { pt: "Transferência bancária: até 3 dias úteis", en: "Bank transfer: up to 3 business days", es: "Transferencia bancaria: hasta 3 días hábiles" },
  politicaCancelContactTitle: { pt: "Dúvidas sobre Cancelamento?", en: "Questions about Cancellation?", es: "¿Dudas sobre Cancelación?" },
  politicaCancelContactBody: { pt: "Nossa equipe está pronta para ajudar com seu cancelamento ou reagendamento.", en: "Our team is ready to help with your cancellation or rescheduling.", es: "Nuestro equipo está listo para ayudarle con su cancelación o reagendamiento." },
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["pt", "en", "es"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
