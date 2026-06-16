# Full UI Translation — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Traduzir integralmente todos os labels e textos estáticos das páginas públicas do site para PT/EN/ES, estendendo o sistema de tradução existente sem alterar sua arquitetura.

**Fora de escopo:**
- Conteúdo dinâmico do banco (títulos, descrições de passeios/pacotes) — permanece em PT
- Páginas do admin — permanecem em PT
- Estrutura do `LanguageProvider` e função `t()` — sem alterações

---

## Arquitetura

O sistema existente em `contexts/language-context.tsx` é estendido com ~80 novas chaves de tradução. Nenhuma dependência nova é adicionada. Componentes públicos que hoje têm texto hardcoded passam a importar `useLanguage` e usar `t("chave")`.

**Regra para `WhatsAppCtaButton`:** o componente recebe `label` como prop. A tradução acontece no call site — cada componente passa `label={t("bookWhatsApp")}`. O componente em si não usa `useLanguage`.

**Páginas server components** (`app/pacotes/[slug]/page.tsx`, `app/passeios/[slug]/page.tsx`, etc.) são wrappers que não renderizam texto — a tradução fica nos client components `index.tsx` que eles carregam.

---

## Novas chaves de tradução

### Botões WhatsApp (call sites)
| Chave | PT | EN | ES |
|---|---|---|---|
| `bookWhatsApp` | Reservar pelo WhatsApp | Book via WhatsApp | Reservar por WhatsApp |
| `consultWhatsApp` | Consultar pelo WhatsApp | Consult via WhatsApp | Consultar por WhatsApp |
| `contactWhatsApp` | Fale Conosco pelo WhatsApp | Contact Us via WhatsApp | Contáctenos por WhatsApp |
| `specialistWhatsApp` | Falar com Especialista | Talk to a Specialist | Hablar con un Especialista |

### Navegação e voltar
| Chave | PT | EN | ES |
|---|---|---|---|
| `backToTours` | Voltar aos Passeios | Back to Tours | Volver a los Paseos |
| `backToPackages` | Voltar aos Pacotes | Back to Packages | Volver a los Paquetes |
| `backToBlog` | Voltar ao Blog | Back to Blog | Volver al Blog |
| `backBtn` | Voltar | Back | Volver |

### Detalhes de passeio/pacote (sidebar e cards de info)
| Chave | PT | EN | ES |
|---|---|---|---|
| `overview` | Visão Geral | Overview | Vista General |
| `packageHighlights` | Destaques do Pacote | Package Highlights | Destacados del Paquete |
| `whatsIncluded` | O que está incluído | What's included | Qué está incluido |
| `bestSeasonVisit` | Melhor Época para Visitar | Best Time to Visit | Mejor Época para Visitar |
| `detailedItinerary` | Roteiro Detalhado | Detailed Itinerary | Itinerario Detallado |
| `reserveThisPackage` | Reserve este pacote | Reserve this package | Reserva este paquete |
| `reserveThisTour` | Reserve este passeio | Reserve this tour | Reserva este paseo |
| `durationLabel` | Duração | Duration | Duración |
| `groupLabel` | Grupo | Group | Grupo |
| `difficultyLabel` | Dificuldade | Difficulty | Dificultad |
| `savingsOf` | Economia de | Savings of | Ahorro de |
| `cancellationFree` | Cancelamento gratuito até 48h antes | Free cancellation up to 48h before | Cancelación gratuita hasta 48h antes |
| `whatsappConfirmation` | Confirmação imediata por WhatsApp | Immediate WhatsApp confirmation | Confirmación inmediata por WhatsApp |
| `certifiedGuides` | Guias especializados e certificados | Certified specialist guides | Guías especializados y certificados |
| `personalAccident` | Seguro de acidentes pessoais incluído | Personal accident insurance included | Seguro de accidentes personales incluido |
| `needHelp` | Precisa de ajuda? | Need help? | ¿Necesita ayuda? |
| `importantInfo` | Informações importantes | Important information | Información importante |
| `dayLabel` | Dia | Day | Día |
| `activitiesLabel` | Atividades | Activities | Actividades |
| `mealsLabel` | Refeições | Meals | Comidas |
| `accommodationLabel` | Acomodação | Accommodation | Alojamiento |

### Dificuldade
| Chave | PT | EN | ES |
|---|---|---|---|
| `difficultyEasy` | Fácil | Easy | Fácil |
| `difficultyModerate` | Moderado | Moderate | Moderado |
| `difficultyHard` | Difícil | Difficult | Difícil |
| `difficultyUnknown` | Não informado | Not informed | No informado |

### Filtros e busca (`/pacotes`)
| Chave | PT | EN | ES |
|---|---|---|---|
| `searchPackagesPlaceholder` | Buscar pacotes... | Search packages... | Buscar paquetes... |
| `allCategories` | Todas as categorias | All categories | Todas las categorías |
| `sortByLabel` | Ordenar por | Sort by | Ordenar por |
| `sortLowestPrice` | Menor preço | Lowest price | Menor precio |
| `sortHighestPrice` | Maior preço | Highest price | Mayor precio |
| `sortShortestDuration` | Menor duração | Shortest duration | Menor duración |
| `sortLongestDuration` | Maior duração | Longest duration | Mayor duración |
| `sortBestRating` | Melhor avaliação | Best rating | Mejor valoración |
| `packagesFoundPlural` | pacotes encontrados | packages found | paquetes encontrados |
| `packagesFoundSingular` | pacote encontrado | package found | paquete encontrado |
| `noPackagesFiltered` | Nenhum pacote encontrado | No packages found | No se encontraron paquetes |
| `tryAdjustFilters` | Tente ajustar os filtros ou buscar por outros termos. | Try adjusting the filters or searching for other terms. | Intente ajustar los filtros o buscar otros términos. |
| `clearFilters` | Limpar filtros | Clear filters | Limpiar filtros |
| `completePackagesTitle` | Pacotes Completos | Complete Packages | Paquetes Completos |
| `completePackagesSubtitle` | Experiências completas em Bonito com hospedagem, passeios e refeições inclusos | Complete experiences in Bonito with accommodation, tours and meals included | Experiencias completas en Bonito con alojamiento, paseos y comidas incluidas |
| `seeDetails` | Ver Detalhes | See Details | Ver Detalles |
| `noPackageFound` | Pacote não encontrado | Package not found | Paquete no encontrado |
| `loadingPackages` | Carregando pacotes... | Loading packages... | Cargando paquetes... |
| `loadingLabel` | Carregando... | Loading... | Cargando... |

### Cards de passeio e pacote
| Chave | PT | EN | ES |
|---|---|---|---|
| `knowMoreBtn` | Saber mais | Learn more | Saber más |
| `freeUpToYear` | Grátis até: | Free up to: | Gratis hasta: |
| `noPackagesAvailable` | Nenhum pacote disponível no momento. | No packages available at the moment. | No hay paquetes disponibles en este momento. |

### Blog (labels de navegação — não conteúdo)
| Chave | PT | EN | ES |
|---|---|---|---|
| `publishedAt` | Publicado em | Published on | Publicado el |
| `minReadLabel` | min de leitura | min read | min de lectura |
| `sharePost` | Compartilhar | Share | Compartir |
| `relatedPosts` | Posts relacionados | Related posts | Posts relacionados |

### Página de contato
| Chave | PT | EN | ES |
|---|---|---|---|
| `contactPageTitle` | Entre em Contato | Get in Touch | Póngase en Contacto |
| `contactPageSubtitle` | Estamos prontos para ajudar a planejar sua viagem | We're ready to help plan your trip | Estamos listos para ayudar a planificar su viaje |
| `contactFieldName` | Nome | Name | Nombre |
| `contactFieldEmail` | E-mail | E-mail | E-mail |
| `contactFieldPhone` | Telefone | Phone | Teléfono |
| `contactFieldMessage` | Mensagem | Message | Mensaje |
| `contactSendBtn` | Enviar mensagem | Send message | Enviar mensaje |
| `contactSuccessMsg` | Mensagem enviada com sucesso! | Message sent successfully! | ¡Mensaje enviado con éxito! |

### Atração detalhe
| Chave | PT | EN | ES |
|---|---|---|---|
| `backToAttractions` | Voltar às Atrações | Back to Attractions | Volver a las Atracciones |
| `attractionNotFound` | Atração não encontrada | Attraction not found | Atracción no encontrada |
| `pricesFrom` | A partir de | From | Desde |
| `capacityLabel` | Capacidade | Capacity | Capacidad |

### Valor futuro
| Chave | PT | EN | ES |
|---|---|---|---|
| `currentSemesterPrices` | Preços - Semestre Atual | Prices - Current Semester | Precios - Semestre Actual |
| `nextSemesterPrices` | Preços - Próximo Semestre | Prices - Next Semester | Precios - Próximo Semestre |
| `priceMS` | Meia Temporada | Mid Season | Temporada Media |
| `priceHS` | Alta Temporada | High Season | Temporada Alta |
| `tourNotFound` | Passeio não encontrado | Tour not found | Paseo no encontrado |

---

## Componentes e páginas em escopo

| Arquivo | Ação |
|---|---|
| `contexts/language-context.tsx` | Adicionar todas as novas chaves |
| `components/tour-card.tsx` | Adicionar `useLanguage`, substituir strings |
| `components/package-card.tsx` | Adicionar `useLanguage`, substituir strings |
| `components/attraction-detail-page.tsx` | Adicionar `useLanguage`, substituir strings |
| `components/TourDetailPage.tsx` | Completar strings que faltam |
| `components/packages-section.tsx` | Substituir strings hardcoded remanescentes |
| `components/attractions-section.tsx` | Substituir strings hardcoded remanescentes |
| `app/pacotes/page.tsx` | Adicionar `useLanguage`, substituir todas as strings |
| `app/pacotes/[slug]/index.tsx` | Adicionar `useLanguage`, substituir todas as strings |
| `app/passeios/[slug]/index.tsx` | Completar strings que faltam |
| `app/atracoes/[slug]/page.tsx` | Adicionar `useLanguage`, substituir strings |
| `app/blog/[slug]/index.tsx` | Adicionar `useLanguage`, substituir labels de navegação |
| `app/contato/page.tsx` | Adicionar `useLanguage`, substituir todas as strings |
| `app/valor-futuro/[slug]/index.tsx` | Completar strings que faltam |

---

## Regras de implementação

1. **Nunca traduzir** títulos, descrições ou dados vindos do banco — renderizar como recebidos
2. **Call sites do `WhatsAppCtaButton`** passam `label={t("bookWhatsApp")}` — o componente em si não usa `useLanguage`
3. **Strings com variáveis** — o `t()` não faz interpolação. Usar template literal combinando chaves atômicas: `` `${t("upTo")} ${pkg.maxPeople} ${t("people")}` `` ou `` `${t("freeUpToYear")} ${tour.min_child_age} ano(s)` ``
4. **Chaves não encontradas** retornam a própria chave pelo `t()` existente — comportamento de fallback já implementado
5. **Componentes server** não recebem `useLanguage` — apenas os client components `"use client"` correspondentes
