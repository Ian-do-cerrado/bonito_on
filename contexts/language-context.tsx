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
