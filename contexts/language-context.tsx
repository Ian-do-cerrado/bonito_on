"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "pt" | "en" | "es" | "zh"

interface Translations {
  [key: string]: {
    pt: string
    en: string
    es: string
    zh: string
  }
}

export const translations: Translations = {
  // Navigation
  home: { pt: "HOME", en: "HOME", es: "INICIO", zh: "首页" },
  tours: { pt: "PASSEIOS", en: "TOURS", es: "PASEOS", zh: "游乐" },
  gastronomy: { pt: "GASTRONOMIA", en: "GASTRONOMY", es: "GASTRONOMÍA", zh: "美食" },
  accommodations: { pt: "HOSPEDAGENS", en: "ACCOMMODATIONS", es: "ALOJAMIENTOS", zh: "住宿" },
  blog: { pt: "BLOG", en: "BLOG", es: "BLOG", zh: "博客" },
  contact: { pt: "CONTATO", en: "CONTACT", es: "CONTACTO", zh: "联系我们" },
  admin: { pt: "Admin", en: "Admin", es: "Admin", zh: "管理" },
  packages: { pt: "PACOTES", en: "PACKAGES", es: "PAQUETES", zh: "套餐" },
  pacotes: { pt: "Pacotes", en: "Packages", es: "Paquetes", zh: "套票" },

  // Hero Section
  heroTitle1: { pt: "Passeios Incríveis", en: "Amazing Tours", es: "Paseos Increíbles", zh: "绝佳的旅行" },
  heroTitle2: { pt: "Esperam Por Você", en: "Await You", es: "Te Esperan", zh: "在这里等您" },
  heroSubtitle: { pt: "Descubra as águas cristalinas, grutas místicas e a natureza exuberante do destino mais encantador do Brasil", en: "Discover the crystal clear waters, mystical caves and lush nature of the most enchanting destination in Brazil", es: "Descubre las aguas cristalinas, grutas místicas y la naturaleza exuberante del destino más encantador de Brasil", zh: "探索巴西最迷人目的地的清澈水域、神秘洞穴和郁郁葱葱的自然" },
  heroButton: { pt: "Fale com um Especialista!", en: "Talk to a Specialist!", es: "¡Habla con un Especialista!", zh: "联系专家！" },

  // Packages Section
  packagesTitle: { pt: "Pacotes Completos", en: "Complete Packages", es: "Paquetes Completos", zh: "完整套餐" },
  packagesSubtitle: {
    pt: "Experiências completas com hospedagem, passeios e muito mais",
    en: "Complete experiences with accommodation, tours and much more",
    es: "Experiencias completas con alojamiento, paseos y mucho más",
    zh: "包含住宿、旅游等更多体验的完整服务"
  },
  seeAllPackages: { pt: "Ver Todos os Pacotes", en: "See All Packages", es: "Ver Todos los Paquetes", zh: "查看所有套餐" },
  noPackagesFound: { pt: "Nenhum pacote encontrado.", en: "No packages found.", es: "No se encontraron paquetes.", zh: "未找到套餐。" },
  contactUs: { pt: "Falar com Atendimento", en: "Talk to Support", es: "Hablar con Soporte", zh: "联系客服" },
  learnMore: { pt: "Saiba Mais", en: "Learn More", es: "Saber Más", zh: "了解更多" },
  bookNow: { pt: "Reservar", en: "Book Now", es: "Reservar", zh: "立即预订" },
  packagesDisclaimer: {
    pt: "*Preços sujeitos a alterações conforme data e disponibilidade. Consulte um especialista.",
    en: "*Prices subject to change based on date and availability. Consult a specialist.",
    es: "*Precios sujetos a cambios según fecha y disponibilidad. Consulte a um especialista.",
    zh: "*价格可能会根据日期和供应情况发生变化。请咨询专家。"
  },
  days: { pt: "dias", en: "days", es: "días", zh: "天" },
  from: { pt: "A partir de", en: "From", es: "Desde", zh: "价格起" },
  includes: { pt: "Inclui", en: "Includes", es: "Incluye", zh: "包含" },
  upTo: { pt: "Até", en: "Up to", es: "Hasta", zh: "最多" },
  people: { pt: "pessoas", en: "people", es: "personas", zh: "人" },
  pkgEconomy: { pt: "Econômico", en: "Economy", es: "Económico", zh: "经济型" },
  pkgPremium: { pt: "Premium", en: "Premium", es: "Premium", zh: "尊享型" },
  pkgLuxury: { pt: "Luxo", en: "Luxury", es: "Lujo", zh: "豪华型" },
  pkgStandard: { pt: "Padrão", en: "Standard", es: "Estándar", zh: "标准型" },

  // Tours Section
  toursInBonito: { pt: "em Bonito", en: "in Bonito", es: "en Bonito", zh: "在博尼图" },
  seeAll: { pt: "Ver todos", en: "See all", es: "Ver todos", zh: "查看全部" },
  seeAllAttractions: { pt: "Ver Todas as Atrações", en: "See All Attractions", es: "Ver Todas las Atracciones", zh: "查看所有景点" },
  discoverAllOptions: {
    pt: "Descubra todas as opções de passeios e atividades em Bonito",
    en: "Discover all tour and activity options in Bonito",
    es: "Descubre todas las opciones de paseos y actividades en Bonito",
    zh: "探索博尼图的所有旅游和活动选择"
  },
  all: { pt: "Todos", en: "All", es: "Todos", zh: "全部" },
  passeios: { pt: "Passeios", en: "Tours", es: "Paseos", zh: "游乐" },
  locations: { pt: "Hospedagens", en: "Accommodations", es: "Alojamientos", zh: "住宿" },
  food: { pt: "Gastronomia", en: "Gastronomy", es: "Gastronomía", zh: "美食" },
  transportation: { pt: "Transporte", en: "Transportation", es: "Transporte", zh: "交通" },
  events: { pt: "Eventos", en: "Events", es: "Eventos", zh: "活动" },
  reserve: { pt: "Reservar", en: "Reserve", es: "Reservar", zh: "预订" },

  // Attractions Section
  attractionsTitle: { pt: "Atrações", en: "Attractions", es: "Atracciones", zh: "景点" },
  attractionsSubtitle: {
    pt: "Gastronomia, hospedagem, transporte e eventos em Bonito",
    en: "Gastronomy, accommodation, transportation and events in Bonito",
    es: "Gastronomía, alojamiento, transporte y eventos en Bonito",
    zh: "在博尼图的美食、住宿、交通及活动"
  },
  noAttractionsTitle: { pt: "Nenhuma atração encontrada", en: "No attraction found", es: "Ninguna atracción encontrada", zh: "未找到任何景点" },
  noAttractionsDesc: { pt: "Não há atrações cadastradas nesta categoria ainda.", en: "There are no attractions registered in this category yet.", es: "Aún no hay atracciones registradas en esta categoría.", zh: "此类目下尚未注册任何景点" },

  // Tarifário Categories
  adventure: { pt: "Aventura", en: "Adventure", es: "Aventura", zh: "探险" },
  contemplation: { pt: "Contemplação", en: "Contemplation", es: "Contemplación", zh: "观赏" },
  waterfall: { pt: "Cachoeira", en: "Waterfall", es: "Cascada", zh: "瀑布" },
  rappelling: { pt: "Rapel", en: "Rappelling", es: "Rappel", zh: "速降" },
  horseback: { pt: "Cavalgada", en: "Horseback Riding", es: "Cabalgata", zh: "骑马" },
  biking: { pt: "Passeio de Bike", en: "Bike Tour", es: "Paseo en Bici", zh: "自行车骑行" },
  scubaDiving: { pt: "Mergulho com Cilindro", en: "Scuba Diving", es: "Buceo con Cilindro", zh: "水肺潜水" },
  resort: { pt: "Balneário", en: "Resort", es: "Balneario", zh: "度假村" },
  floating: { pt: "Flutuação", en: "Floating", es: "Flotación", zh: "漂浮" },
  pantanal: { pt: "Pantanal", en: "Pantanal", es: "Pantanal", zh: "潘塔纳尔湿地" },
  cave: { pt: "Gruta", en: "Cave", es: "Gruta", zh: "洞穴" },
  cultural: { pt: "Cultural", en: "Cultural", es: "Cultural", zh: "文化" },
  family: { pt: "Família", en: "Family", es: "Familia", zh: "家庭" },

  // Tarifário Page
  priceList: { pt: "Tarifário", en: "Price List", es: "Tarifario", zh: "价格表" },
  priceListSubtitle: {
    pt: "Confira todos os nossos passeios e atividades organizados por categoria",
    en: "Check out all our tours and activities organized by category",
    es: "Consulta todos nuestros paseos y actividades organizados por categoría",
    zh: "查看按类别的所有旅游与活动详情"
  },
  backToHome: { pt: "Voltar ao Início", en: "Back to Home", es: "Volver al Inicio", zh: "返回首页" },
  searchPlaceholder: { pt: "Pesquisar passeio", en: "Search for tour", es: "Buscar paseo", zh: "搜索游乐" },

  // Blog Section
  blogTitle: { pt: "Blog", en: "Blog", es: "Blog", zh: "博客" },
  blogSubtitle: {
    pt: "Descubra dicas, guias e histórias sobre Bonito e o turismo na região",
    en: "Discover tips, guides and stories about Bonito and tourism in the region",
    es: "Descubre consejos, guías e historias sobre Bonito y el turismo en la región",
    zh: "在博尼图探索有关旅游的提示、指南和故事"
  },
  blogPageTitle: { pt: "Blog Bonito ON", en: "Bonito ON Blog", es: "Blog Bonito ON", zh: "博尼图 ON 博客" },
  blogPageSubtitle: {
    pt: "Descubra dicas, guias e histórias sobre Bonito e região",
    en: "Discover tips, guides and stories about Bonito and the region",
    es: "Descubre consejos, guías e historias sobre Bonito y la región",
    zh: "探索关于博尼图及其地区的建议、指南和故事"
  },
  searchPosts: { pt: "Buscar posts...", en: "Search posts...", es: "Buscar publicaciones...", zh: "搜索文章..." },
  allPosts: { pt: "Todos os Posts", en: "All Posts", es: "Todas las Publicaciones", zh: "所有文章" },
  noPostsFound: { pt: "Nenhum post encontrado", en: "No posts found", es: "No se encontraron publicaciones", zh: "未找到文章" },
  tryDifferentSearch: {
    pt: "Tente uma busca diferente ou remova os filtros",
    en: "Try a different search or remove the filters",
    es: "Intente una búsqueda diferente o elimine los filtros",
    zh: "尝试不同的搜索或删除过滤器"
  },
  readMore: { pt: "Ler", en: "Read", es: "Leer", zh: "阅读" },
  readTime: { pt: "min de leitura", en: "min read", es: "min de lectura", zh: "分钟阅读" },
  viewAllPosts: { pt: "Ver Todos os Posts", en: "View All Posts", es: "Ver Todas las Publicaciones", zh: "查看所有文章" },

  // Reviews Section
  reviewsTitle: { pt: "O que nossos clientes dizem", en: "What our clients say", es: "Lo que dicen nuestros clientes", zh: "客户评论" },
  reviewsSubtitle: {
    pt: "Confira as avaliações reais de quem já viveu experiências incríveis conosco em Bonito",
    en: "Check out real reviews from those who have already lived incredible experiences with us in Bonito",
    es: "Consulta las reseñas reales de quienes ya han vivido experiencias increíbles con nosotros en Bonito",
    zh: "看一看那些曾在博尼图与我们度过不可思议经历的客户的真实评价"
  },
  googleReviews: { pt: "Google Reviews", en: "Google Reviews", es: "Google Reviews", zh: "Google评论" },
  reviews: { pt: "avaliações", en: "reviews", es: "reseñas", zh: "评价" },
  seeOnGoogle: { pt: "Ver no Google", en: "See on Google", es: "Ver en Google", zh: "在Google查看" },
  joinStories: {
    pt: "Quer fazer parte dessas histórias?",
    en: "Want to be part of these stories?",
    es: "¿Quieres ser parte de estas historias?",
    zh: "想要在这里留下你的故事吗？"
  },
  joinStoriesDesc: {
    pt: "Planeje sua viagem dos sonhos para Bonito conosco e crie memórias inesquecíveis!",
    en: "Plan your dream trip to Bonito with us and create unforgettable memories!",
    es: "¡Planifica tu viaje de ensueño a Bonito con nosotros y crea recuerdos inolvidables!",
    zh: "与我们计划前往博尼图的梦幻之旅，创造难忘的记忆！"
  },

  // Tour Cards
  knowMore: { pt: "Saiba mais", en: "Learn more", es: "Saber más", zh: "了解更多" },
  perPerson: { pt: "por pessoa", en: "per person", es: "por persona", zh: "每人" },

  // Categories
  allToursTitle: { pt: "Todos os Itens", en: "All Items", es: "Todos los Elementos", zh: "所有项目" },
  passeiosTitle: { pt: "Passeios", en: "Tours", es: "Paseos", zh: "游乐" },
  locationsTitle: { pt: "Hospedagens", en: "Accommodations", es: "Alojamientos", zh: "住宿" },
  foodTitle: { pt: "Gastronomia", en: "Gastronomy", es: "Gastronomía", zh: "美食" },
  transportationTitle: { pt: "Transporte", en: "Transportation", es: "Transporte", zh: "交通" },

  // Admin
  adminPanel: { pt: "Painel Administrativo", en: "Administrative Panel", es: "Panel Administrativo", zh: "管理面板" },
  backToSite: { pt: "Voltar ao Site", en: "Back to Site", es: "Volver al Sitio", zh: "返回网站" },
  addTour: { pt: "Adicionar Item", en: "Add Item", es: "Agregar Elemento", zh: "添加项目" },
  addNewTour: { pt: "Adicionar Novo Item", en: "Add New Item", es: "Agregar Nuevo Elemento", zh: "添加新项目" },
  noToursFound: {
    pt: "Nenhum item encontrado nesta categoria.",
    en: "No items found in this category.",
    es: "No se encontraron elementos en esta categoría.",
    zh: "在该类别中未找到项目。"
  },
  addFirstTour: { pt: "Adicionar Primeiro Item", en: "Add First Item", es: "Agregar Primer Elemento", zh: "添加第一个项目" },

  // Form fields
  title: { pt: "Título", en: "Title", es: "Título", zh: "标题" },
  description: { pt: "Descrição", en: "Description", es: "Descripción", zh: "描述" },
  price: { pt: "Preço (R$)", en: "Price (R$)", es: "Precio (R$)", zh: "价格 (R$)" },
  rating: { pt: "Avaliação", en: "Rating", es: "Calificación", zh: "评分" },
  category: { pt: "Categoria", en: "Category", es: "Categoría", zh: "类别" },
  imageUrl: { pt: "URL da Imagem", en: "Image URL", es: "URL de Imagen", zh: "图片网址" },
  cancel: { pt: "Cancelar", en: "Cancel", es: "Cancelar", zh: "取消" },
  save: { pt: "Salvar", en: "Save", es: "Guardar", zh: "保存" },

  // Language change notification
  languageChanged: {
    pt: "Idioma alterado para Português",
    en: "Language changed to English",
    es: "Idioma cambiado a Español",
    zh: "语言已更改为中文"
  },
  translate: { pt: "Traduzir", en: "Translate", es: "Traducir", zh: "翻译" },
  autoTranslate: { pt: "Traduzir Auto", en: "Auto Translate", es: "Traducir Auto", zh: "自动翻译" },

  footerSlogan: { pt: "Sua aventura em Bonito começa aqui", en: "Your adventure in Bonito starts here", es: "Tu aventura en Bonito comienza aquí", zh: "您在博尼图的冒险从这里开始" },
  footerAbout: { pt: "Especialistas em ecoturismo oferecendo os melhores passeios da região de Bonito, MS. Experiências inesquecíveis com segurança e qualidade garantidas.", en: "Ecotourism specialists offering the best tours in the Bonito, MS region. Unforgettable experiences with guaranteed safety and quality.", es: "Especialistas en ecoturismo ofreciendo los mejores paseos de la región de Bonito, MS. Experiencias inolvidables con seguridad y calidad garantizadas.", zh: "生态旅游专家，为您提供博尼图区域最佳旅游。保证安全和质量的难忘经历。" },
  satisfiedCustomers: { pt: "Clientes satisfeitos", en: "Satisfied customers", es: "Clientes satisfechos", zh: "满意的客户" },
  
  // Footer translations
  quickLinks: { pt: "Links Rápidos", en: "Quick Links", es: "Enlaces Rápidos", zh: "快速链接" },
  completePackages: { pt: "Pacotes Completos", en: "Complete Packages", es: "Paquetes Completos", zh: "完整套餐" },
  footerToursInBonito: { pt: "Passeios em Bonito", en: "Tours in Bonito", es: "Paseos en Bonito", zh: "在博尼图的旅游" },
  localGastronomy: { pt: "Gastronomia Local", en: "Local Gastronomy", es: "Gastronomía Local", zh: "当地美食" },
  blogAndTips: { pt: "Blog e Dicas", en: "Blog & Tips", es: "Blog y Consejos", zh: "博客与建议" },
  popularTours: { pt: "Passeios Populares", en: "Popular Tours", es: "Paseos Populares", zh: "热门游乐" },
  footerContact: { pt: "Contato", en: "Contact", es: "Contacto", zh: "联系我们" },
  address: { pt: "Endereço", en: "Address", es: "Dirección", zh: "地址" },
  phones: { pt: "Telefones", en: "Phones", es: "Teléfonos", zh: "电话" },
  email: { pt: "E-mail", en: "E-mail", es: "E-mail", zh: "电子邮件" },
  schedule: { pt: "Horário", en: "Schedule", es: "Horario", zh: "营业时间" },
  emergency24h: { pt: "Emergência 24h", en: "24h Emergency", es: "Emergencia 24h", zh: "24小时紧急服务" },
  socialMedia: { pt: "Redes Sociais", en: "Social Media", es: "Redes Sociales", zh: "社交媒体" },
  contactUsNow: { pt: "Fale Conosco Agora", en: "Contact Us Now", es: "Contáctanos Ahora", zh: "现在联系我们" },
  basedOnGoogleReviews: {
    pt: "Baseado em 500+ avaliações no Google",
    en: "Based on 500+ Google reviews",
    es: "Basado en 500+ reseñas de Google",
    zh: "基于500+条Google评价"
  },
  seeAllReviews: { pt: "Ver todas as avaliações", en: "See all reviews", es: "Ver todas las reseñas", zh: "查看所有评价" },
  copyright: {
    pt: "© 2024 BonitoON Turismo. Todos os direitos reservados.",
    en: "© 2024 BonitoON Tourism. All rights reserved.",
    es: "© 2024 BonitoON Turismo. Todos los derechos reservados.",
    zh: "© 2024 BonitoON Turismo。保留所有权利。"
  },
  privacyPolicy: { pt: "Política de Privacidade", en: "Privacy Policy", es: "Política de Privacidad", zh: "隐私政策" },
  termsOfUse: { pt: "Termos de Uso", en: "Terms of Use", es: "Términos de Uso", zh: "使用条款" },
  cancellationPolicy: { pt: "Política de Cancelamento", en: "Cancellation Policy", es: "Política de Cancelación", zh: "取消政策" },
  weAccept: { pt: "Aceitamos:", en: "We accept:", es: "Aceptamos:", zh: "我们接受：" },

  // Tour Details Page
  itemNotFound: { pt: "Item não encontrado", en: "Item not found", es: "Elemento no encontrado", zh: "未找到项目" },
  packageNotFound: { pt: "Pacote não encontrado", en: "Package not found", es: "Paquete no encontrado", zh: "未找到套餐" },
  postNotFound: { pt: "Post não encontrado", en: "Post not found", es: "Publicación no encontrada", zh: "未找到文章" },
  backToPackages: { pt: "Voltar aos Pacotes", en: "Back to Packages", es: "Volver a los Paquetes", zh: "返回套票" },
  back: { pt: "Voltar", en: "Back", es: "Volver", zh: "返回" },
  location: { pt: "Localização", en: "Location", es: "Ubicación", zh: "位置" },
  duration: { pt: "Duração", en: "Duration", es: "Duración", zh: "时长" },
  fullDay: { pt: "Dia inteiro", en: "Full day", es: "Día completo", zh: "全天" },
  group: { pt: "Grupo", en: "Group", es: "Grupo", zh: "团队" },
  upTo15: { pt: "Até 15 pessoas", en: "Up to 15 people", es: "Hasta 15 personas", zh: "最多15人" },
  whatsIncluded: { pt: "O que está incluído", en: "What's included", es: "Qué está incluido", zh: "包含内容" },
  includedTransport: { pt: "Transporte ida e volta", en: "Round trip transport", es: "Transporte ida y vuelta", zh: "往返交通" },
  includedGuide: { pt: "Guia especializado", en: "Specialized guide", es: "Guía especializado", zh: "专业导游" },
  includedEquipment: { pt: "Equipamentos necessários", en: "Necessary equipment", es: "Equipamiento necesario", zh: "所需设备" },
  includedInsurance: { pt: "Seguro de acidentes pessoais", en: "Personal accident insurance", es: "Seguro de accidentes personales", zh: "个人意外保障" },
  reserveNow: { pt: "Reserve agora", en: "Reserve now", es: "Reserva ahora", zh: "现在预订" },
  reservePackage: { pt: "Reserve este pacote", en: "Reserve this package", es: "Reserva este paquete", zh: "预订此套餐" },
  talkToAgent: { pt: "Falar com agente especializado", en: "Talk to a specialized agent", es: "Hablar con un agente especializado", zh: "联系专业代理" },
  talkToSpecialist: { pt: "Falar com especialista", en: "Talk to a specialist", es: "Hablar con un especialista", zh: "联系专业人士" },
  needHelp: { pt: "Precisa de ajuda?", en: "Need help?", es: "¿Necesitas ayuda?", zh: "需要帮助？" },
  overview: { pt: "Visão Geral", en: "Overview", es: "Visión General", zh: "概览" },
  difficulty: { pt: "Dificuldade", en: "Difficulty", es: "Dificultad", zh: "难度" },
  easy: { pt: "Fácil", en: "Easy", es: "Fácil", zh: "简单" },
  moderate: { pt: "Moderado", en: "Moderate", es: "Moderado", zh: "中等" },
  hard: { pt: "Difícil", en: "Hard", es: "Difícil", zh: "困难" },
  notInformed: { pt: "Não informado", en: "Not informed", es: "No informado", zh: "未注明" },
  packageHighlights: { pt: "Destaques do Pacote", en: "Package Highlights", es: "Aspectos Destacados del Paquete", zh: "套餐亮点" },
  bestSeasonToVisit: { pt: "Melhor Época para Visitar", en: "Best Season to Visit", es: "Mejor Época para Visitar", zh: "最佳游览季节" },
  detailedItinerary: { pt: "Roteiro Detalhado", en: "Detailed Itinerary", es: "Itinerario Detallado", zh: "详细行程" },
  activities: { pt: "Atividades:", en: "Activities:", es: "Actividades:", zh: "活动：" },
  accommodationDetails: { pt: "Acomodação:", en: "Accommodation:", es: "Alojamiento:", zh: "住宿：" },
  savingsOf: { pt: "Economia de", en: "Savings of", es: "Ahorro de", zh: "节省" },
  importantInfo: { pt: "Informações importantes", en: "Important information", es: "Información importante", zh: "重要信息" },
  infoCancel: { pt: "Cancelamento gratuito até 48h antes", en: "Free cancellation up to 48h before", es: "Cancelación gratuita hasta 48h antes", zh: "提前48小时免费取消" },
  infoConfirm: { pt: "Confirmação imediata por WhatsApp", en: "Immediate confirmation via WhatsApp", es: "Confirmación inmediata por WhatsApp", zh: "通过WhatsApp即刻确认" },
  infoGuides: { pt: "Guias especializados e certificados", en: "Specialized and certified guides", es: "Guías especializados y certificados", zh: "认证专业导游" },
  infoInsurance: { pt: "Seguro de acidentes pessoais incluído", en: "Personal accident insurance included", es: "Seguro de accidentes personales incluido", zh: "包含个人意外保险" },
  share: { pt: "Compartilhar", en: "Share", es: "Compartir", zh: "分享" },
  imageGallery: { pt: "Galeria de Imagens", en: "Image Gallery", es: "Galería de Imágenes", zh: "图库" },
  loading: { pt: "Carregando...", en: "Loading...", es: "Cargando...", zh: "加载中..." },
  contentUnavailable: { pt: "Conteúdo indisponível.", en: "Content unavailable.", es: "Contenido no disponible.", zh: "内容不可用" },
  
  // Attraction Details Page
  about: { pt: "Sobre", en: "About", es: "Sobre", zh: "关于" },
  highlights: { pt: "Destaques", en: "Highlights", es: "Destacados", zh: "亮点" },
  information: { pt: "Informações", en: "Information", es: "Información", zh: "信息" },
  capacity: { pt: "Capacidade", en: "Capacity", es: "Capacidad", zh: "容量" },
  interested: { pt: "Interessado?", en: "Interested?", es: "¿Interesado?", zh: "想报名？" },
  contactForMoreInfo: { pt: "Entre em contato para mais informações e reservas", en: "Contact us for more information and reservations", es: "Contáctenos para más información y reservas", zh: "联系我们以获取更多信息并预订" },
  priceTitle: { pt: "Preço", en: "Price", es: "Precio", zh: "价格" },
  checkPrices: { pt: "Consultar Preços", en: "Check Prices", es: "Consultar Precios", zh: "查看价格" },
  priceOnRequest: { pt: "Valor a consultar", en: "On request", es: "Consultar precio", zh: "询价" },
  contactForQuote: { pt: "Entre em contato para orçamento", en: "Contact us for a quote", es: "Contáctenos para un presupuesto", zh: "联系我们获取报价" },
  quickResponseGuaranteed: { pt: "Resposta rápida garantida", en: "Quick response guaranteed", es: "Respuesta rápida garantizada", zh: "保证快速回复" },

  // Tour Prices Sidebar
  adult: { pt: "Adulto", en: "Adult", es: "Adulto", zh: "成人" },
  childElderly: { pt: "Criança/Terceira Idade", en: "Child/Senior", es: "Niño/Tercera Edad", zh: "儿童/老人" },
  childPriceNotFound: { pt: "Preço de criança não cadastrado.", en: "Child price not registered.", es: "Precio de niño no registrado.", zh: "儿童价格未录入。" },
  pillion: { pt: "Garupa", en: "Pillion", es: "Pasajero", zh: "后座/随行者" },
  driver: { pt: "Piloto", en: "Driver", es: "Piloto", zh: "驾驶员" },
  validity: { pt: "Vigência", en: "Validity", es: "Vigencia", zh: "有效期" },
  child: { pt: "Criança", en: "Child", es: "Niño", zh: "儿童" },
  otherPrices: { pt: "Outros preços", en: "Other prices", es: "Otros precios", zh: "其他价格" },

  // Season Section
  seasonTitle: { pt: "Temporada Atual", en: "Current Season", es: "Temporada Actual", zh: "当前季节" },
  highSeason: { pt: "Alta Temporada", en: "High Season", es: "Temporada Alta", zh: "旅游旺季" },
  lowSeason: { pt: "Baixa Temporada", en: "Low Season", es: "Temporada Baja", zh: "旅游淡季" },
  highSeasonDesc: {
    pt: "Período de maior movimento turístico com preços mais elevados",
    en: "Peak tourist period with higher prices",
    es: "Período de mayor movimiento turístico con precios más altos",
    zh: "旅游的高峰期，价格较高"
  },
  lowSeasonDesc: {
    pt: "Período com menos movimento e preços mais acessíveis",
    en: "Period with less movement and more affordable prices",
    es: "Período con menos movimiento y precios más accesibles",
    zh: "旅客较少，价格更实惠的时期"
  },
  highSeasonPeriod: { pt: "Períodos específicos", en: "Specific periods", es: "Períodos específicos", zh: "特定时期" },
  lowSeasonPeriod: { pt: "Demais períodos", en: "Other periods", es: "Otros períodos", zh: "其他时期" },
  advantages: { pt: "Vantagens", en: "Advantages", es: "Ventajas", zh: "优势" },
  considerations: { pt: "Considerações", en: "Considerations", es: "Consideraciones", zh: "注意事项" },
  highSeasonAdvantages: {
    pt: "• Mais opções de passeios\n• Programação cultural\n• Melhor infraestrutura",
    en: "• More tour options\n• Cultural programming\n• Better infrastructure",
    es: "• Más opciones de paseos\n• Programación cultural\n• Mejor infraestructura",
    zh: "• 更多旅游选项\n• 文化活动\n• 更佳的基础设施"
  },
  highSeasonConsiderations: {
    pt: "• Preços mais elevados\n• Maior movimento turístico\n• Necessário reservar com antecedência",
    en: "• Higher prices\n• More tourist traffic\n• Need to book in advance",
    es: "• Precios más altos\n• Mayor movimiento turístico\n• Necesario reservar con anticipación",
    zh: "• 更高的价格\n• 人流更多\n• 需提前预订"
  },
  lowSeasonAdvantages: {
    pt: "• Preços mais acessíveis\n• Menos multidões\n• Atendimento mais personalizado",
    en: "• More affordable prices\n• Fewer crowds\n• More personalized service",
    es: "• Precios más accesibles\n• Menos multitudes\n• Servicio más personalizado",
    zh: "• 价格更实惠\n• 人流较少\n• 服务更有针对性"
  },
  lowSeasonConsiderations: {
    pt: "• Menos opções de passeios\n• Alguns estabelecimentos fechados\n• Menos eventos culturais",
    en: "• Fewer tour options\n• Some establishments closed\n• Fewer cultural events",
    es: "• Menos opciones de paseos\n• Algunos establecimientos cerrados\n• Menos eventos culturales",
    zh: "• 旅游选择变少\n• 一些店铺关闭\n• 文化活动较少"
  },
  planYourTrip: { pt: "Ver Calendário de Temporadas", en: "View Season Calendar", es: "Ver Calendario de Temporadas", zh: "查看季节日历" },
  seasonCalendar: {
    pt: "Calendário de Temporadas 2026",
    en: "2026 Season Calendar",
    es: "Calendario de Temporadas 2026",
    zh: "2026 季节日历"
  },
  january: { pt: "Janeiro", en: "January", es: "Enero", zh: "一月" },
  february: { pt: "Fevereiro", en: "February", es: "Febrero", zh: "二月" },
  march: { pt: "Março", en: "March", es: "Marzo", zh: "三月" },
  april: { pt: "Abril", en: "April", es: "Abril", zh: "四月" },
  may: { pt: "Maio", en: "May", es: "Mayo", zh: "五月" },
  june: { pt: "Junho", en: "June", es: "Junio", zh: "六月" },
  july: { pt: "Julho", en: "July", es: "Julio", zh: "七月" },
  august: { pt: "Agosto", en: "August", es: "Agosto", zh: "八月" },
  september: { pt: "Setembro", en: "September", es: "Septiembre", zh: "九月" },
  october: { pt: "Outubro", en: "October", es: "Octubre", zh: "十月" },
  november: { pt: "Novembro", en: "November", es: "Noviembre", zh: "十一月" },
  december: { pt: "Dezembro", en: "December", es: "Diciembre", zh: "十二月" },
  schoolHolidays: { pt: "Férias Escolares", en: "School Holidays", es: "Vacaciones Escolares", zh: "学校假期" },
  carnival: { pt: "Carnaval", en: "Carnival", es: "Carnaval", zh: "狂欢节" },
  easterHoliday: { pt: "Semana Santa", en: "Easter Holiday", es: "Semana Santa", zh: "复活节" },
  laborDay: { pt: "Dia do Trabalho", en: "Labor Day", es: "Día del Trabajo", zh: "劳动节" },
  corpusChristi: { pt: "Corpus Christi", en: "Corpus Christi", es: "Corpus Christi", zh: "基督圣体节" },
  independence: { pt: "Independência do Brasil", en: "Brazil Independence Day", es: "Independencia de Brasil", zh: "巴西独立日" },
  nsAparecida: { pt: "N. Sra. Aparecida", en: "Our Lady of Aparecida", es: "N. Sra. Aparecida", zh: "阿帕雷西达圣母节" },
  finados: { pt: "Finados", en: "All Souls' Day", es: "Día de los Difuntos", zh: "万灵节" },
  conscienciaNegra: { pt: "Dia da Consciência Negra", en: "Black Consciousness Day", es: "Día de la Conciencia Negra", zh: "黑人觉醒日" },
  closeCalendar: { pt: "Fechar Calendário", en: "Close Calendar", es: "Cerrar Calendario", zh: "关闭日历" },
  
  // Day abbreviations
  sunShort: { pt: "D", en: "S", es: "D", zh: "日" },
  monShort: { pt: "S", en: "M", es: "L", zh: "一" },
  tueShort: { pt: "T", en: "T", es: "M", zh: "二" },
  wedShort: { pt: "Q", en: "W", es: "M", zh: "三" },
  thuShort: { pt: "Q", en: "T", es: "J", zh: "四" },
  friShort: { pt: "S", en: "F", es: "V", zh: "五" },
  satShort: { pt: "S", en: "S", es: "S", zh: "六" },

  highSeasonSummary: { 
    pt: "Resumo: Datas de Alta Temporada", 
    en: "Summary: High Season Dates", 
    es: "Resumen: Fechas de Temporada Alta",
    zh: "摘要：旺季日期"
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  initialValueType: 'main_activity' | 'min_price'
  setInitialValueType: (type: 'main_activity' | 'min_price') => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")
  const [initialValueType, setInitialValueType] = useState<'main_activity' | 'min_price'>('main_activity')

  useEffect(() => {
    // Fetch initial value type setting from API or Server Action
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/initial-value-type')
        if (res.ok) {
          const data = await res.json()
          if (data.type) {
            setInitialValueType(data.type)
          }
        }
      } catch (err) {
        console.error("Error fetching initialValueType setting:", err)
      }
    }
    fetchSettings()

    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["pt", "en", "es", "zh"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      if (typeof navigator !== "undefined") {
        const browserLang = navigator.language.toLowerCase()
        let detectedLang: Language = "pt"

        if (browserLang.startsWith("en")) {
          detectedLang = "en"
        } else if (browserLang.startsWith("es")) {
          detectedLang = "es"
        } else if (browserLang.startsWith("zh")) {
          detectedLang = "zh"
        } else if (browserLang.startsWith("pt")) {
          detectedLang = "pt"
        }
        
        setLanguage(detectedLang)
        localStorage.setItem("language", detectedLang)
      } else {
        setLanguage("pt")
      }
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const handleSetInitialValueType = (type: 'main_activity' | 'min_price') => {
    setInitialValueType(type)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, initialValueType, setInitialValueType: handleSetInitialValueType }}>
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
