# Documentação do site BonitoON – Agência de Turismo

Documentação técnica do projeto do site da agência de turismo BonitoON (Bonito, MS). O site é uma aplicação **Next.js 14** com App Router, React 18, TypeScript, Tailwind CSS e Supabase.

---

## 1. Visão geral do projeto

| Item | Descrição |
|------|-----------|
| **Nome** | bonito-travel-agency (BonitoON) |
| **Framework** | Next.js 14.0.4 (App Router) |
| **Linguagem** | TypeScript |
| **UI** | React 18, Tailwind CSS, Radix UI, Lucide Icons |
| **Backend/Dados** | Supabase (auth, banco) |
| **E-mail** | Resend (formulário de contato e testes) |
| **Node** | >= 18.17.0 |

### Scripts principais

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — servidor de produção
- `npm run lint` — ESLint
- `npm run type-check` — checagem de tipos (tsc)

---

## 2. Estrutura de pastas (código-fonte)

```
site-bonitoon/
├── app/                    # App Router (rotas, layouts, ações)
│   ├── layout.tsx           # Layout raiz (providers, Toaster, ContactModal)
│   ├── page.tsx             # Página inicial (home)
│   ├── metadata.ts          # SEO e metadados globais
│   ├── globals.css          # Estilos globais e variáveis CSS
│   ├── actions/             # Server Actions (contato, newsletter, auth)
│   ├── api/                 # Rotas API (testes Supabase e Resend)
│   ├── admin/               # Painel administrativo (login, dashboard)
│   ├── pacotes/             # Listagem e detalhe de pacotes
│   ├── passeios/            # Detalhe de passeio por slug
│   ├── atracoes/            # Página de atração por slug (SSR)
│   ├── blog/                # Listagem e post do blog
│   ├── tarifario/           # Tarifário de passeios (1º semestre)
│   ├── tarifario-2o-semestre/
│   ├── politica-privacidade/
│   ├── termos-uso/
│   └── politica-cancelamento/
├── components/              # Componentes React
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── sections/            # Seções da home (atrações, tours, pacotes)
│   ├── site-layout.tsx      # Layout com Navigation + Footer + Modal
│   ├── navigation.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── contact-modal.tsx
│   ├── tour-card.tsx, package-card.tsx, blog-card.tsx
│   └── admin-* / add-*-dialog  # Componentes do admin
├── contexts/                # Contextos React
│   ├── language-context.tsx # i18n (pt, en, es)
│   └── contact-modal-context.tsx
├── hooks/                   # Hooks customizados
│   ├── use-contact-modal.tsx
│   └── use-toast.ts
├── lib/                     # Utilitários e cliente Supabase
│   ├── supabase/            # client, server, types
│   └── utils.ts             # cn() (clsx + tailwind-merge)
├── services/                # Acesso a dados (Supabase)
│   ├── supabase-tours.ts
│   ├── supabase-packages.ts
│   ├── supabase-attractions.ts
│   ├── supabase-blog.ts
│   └── admin-supabase.ts    # CRUD admin (tours, packages, attractions, blog)
├── types/                   # Tipos TypeScript
│   ├── package.ts           # Package, ItineraryDay
│   └── index.ts
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.js
├── package.json
└── atrativo-atividade-preco.md   # Doc da tabela de preços (Supabase/n8n)
```

---

## 3. Configuração e ambiente

### 3.1 Next.js (`next.config.mjs`)

- **Imagens:** `remotePatterns` com `https://**`; domínio `placeholder.svg` permitido.
- **Otimização:** `optimizePackageImports: ['lucide-react']`.
- **Build:** `eslint.ignoreDuringBuilds: true` e `typescript.ignoreBuildErrors: true` (útil para desenvolvimento; em produção é melhor corrigir erros).

### 3.2 Tailwind (`tailwind.config.ts`)

- **Dark mode:** `class`.
- **Content:** `pages`, `components`, `app`, `src`, raiz.
- **Cores:** sistema semântico (border, input, ring, background, primary, etc.) + tema `bonito` (blue, green, orange, yellow).
- **Animações:** accordion, fade-in, slide-in; plugin `tailwindcss-animate`.

### 3.3 Variáveis de ambiente esperadas

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (server/admin) |
| `RESEND_API_KEY` | Envio de e-mails (Resend) |
| `CONTACT_EMAIL` | E-mail de destino do formulário de contato |

---

## 4. Camada de dados (Supabase e serviços)

### 4.1 Cliente Supabase

- **`lib/supabase/client.ts`** — Cliente browser (`createBrowserClient` do `@supabase/ssr`), usado em componentes e serviços no cliente.
- **`lib/supabase/server.ts`** — Cliente servidor com cookies (`createServerClient`), usado em Server Components e Server Actions que precisam de sessão/RLS.
- **`lib/supabase/types.ts`** — Interfaces do banco: `DatabaseTour`, `DatabasePackage`, `DatabaseAttraction`, `PackageHighlight`, `PackageIncluded`, `PackageBestSeason`, `PackageItinerary`, `ItineraryActivity`, `ItineraryMeal`, `AttractionHighlight`.

### 4.2 Tabelas utilizadas

- **tours** — Passeios (título, descrição, preço, imagem, galeria, rating, categoria, slug).
- **packages** — Pacotes completos (título, subtítulo, descrição, duração, preço, imagem, categoria, rating, max_people, difficulty, slug, etc.).
- **attractions** — Atrações (título, descrição, imagem, categoria, localização, duração, capacidade, preço, rating, slug).
- **package_highlights**, **package_included**, **package_best_seasons**, **package_itinerary** (e atividades/refeições) — Dados relacionados a pacotes.
- **attraction_highlights** — Destaques de atrações.
- **Blog** — Armazenamento via Supabase e/ou `localStorage` (conforme implementação em `blog-section` e página do blog).

### 4.3 Serviços (`services/`)

- **supabase-tours.ts** — `getAllTours()`, `getTourBySlug(slug)`. Transformação de dados do banco para o tipo `Tour` (inclui `gallery`). Fallback para dados locais em caso de erro.
- **supabase-packages.ts** — `getAllPackages()`, `getPackageBySlug(slug)` (pacotes com highlights, included, bestSeason, itinerary).
- **supabase-attractions.ts** — `getAllAttractions()`, `getAttractionBySlug(slug)` (usado na rota `atracoes/[slug]` em SSR).
- **supabase-blog.ts** — Acesso a posts do blog (quando persistidos no Supabase).
- **admin-supabase.ts** — CRUD para tours, packages, attractions e blog (create, update, delete), usando cliente com permissões de admin.

Slugs são gerados a partir do título (normalização NFD, remoção de acentos e caracteres especiais, espaços → hífen).

### 4.4 Operacao de precos S1/S2

- Migrations novas:
  - `migrations/add_semester_pricing_governance.sql`
- SQL operacional:
  - `supabase/semester_price_sources.sql`
- Novas estruturas:
  - `tours.manual_price_2o_semester`
  - `tours.price_display_overrides` (labels, vigencia e idades por semestre)
  - `price_sync_runs` (auditoria de execucoes)
- Sync protegido:
  - `POST /api/sync-prices` e `syncTourPrices()` validam admin antes de executar.
  - Sync registra auditoria e nao sobrescreve campos manuais de S1/S2.

---

## 5. Rotas e páginas (App Router)

### 5.1 Layout raiz (`app/layout.tsx`)

- **"use client"** — Componente cliente.
- **Font:** Google Sora (pesos 100–800).
- **Head:** favicon (`/bonitoon.svg`), apple-touch-icon, manifest.
- **Body:** `ScrollToTop`, `LanguageProvider`, `ContactModalProvider`, `{children}`, `Toaster`, `ContactModal`.
- **Observação:** O layout importa `useContactModal` de `@/hooks/use-contact-modal`, mas o estado exibido pelo `ContactModal` vem do `ContactModalContext`. Ou seja, o estado do hook no layout não controla o modal; o modal é controlado apenas pelo contexto. O `SiteLayout` (navbar + footer) não está no layout raiz; cada página que precisa de navbar/footer usa `<SiteLayout>` por volta do conteúdo.

### 5.2 Página inicial (`app/page.tsx`)

- Seções em ordem: `HeroSection`, `PackagesSection`, `ToursSection`, `AttractionsSection`, `SeasonSection`, `BlogSection`, `ReviewsSection`.
- Tudo envolto em `<SiteLayout>` (navbar + main + footer).

### 5.3 Pacotes

- **`/pacotes`** (`app/pacotes/page.tsx`) — Listagem de pacotes: busca, filtro por categoria (economico, premium, luxo), ordenação (preço, duração, avaliação). Dados via `packageService.getAllPackages()`; fallback em `localStorage`. Layout: `SiteLayout`, hero, filtros, grid de cards.
- **`/pacotes/[slug]`** (`app/pacotes/[slug]/page.tsx`) — Detalhe do pacote por slug: visão geral, destaques, incluídos, melhor época, roteiro dia a dia. Sidebar com preço e botões “Reservar” / “Falar com especialista”. Dados via `packageService.getPackageBySlug(slug)`; fallback em `localStorage`.

### 5.4 Passeios (tarifário)

- **`/tarifario`** — Página de tarifário (lista de passeios por categoria). Implementação pode usar o mesmo padrão de listagem de tours.
- **`/tarifario-2o-semestre`** — Tarifário do segundo semestre.
- **`/passeios/[slug]`** (`app/passeios/[slug]/page.tsx`) — Detalhe do passeio: galeria (carrossel), descrição (com formatação markdown-like: ##, ###, listas, citações), “O que está incluído”, sidebar com preço e reserva. Dados via `getTourBySlug(slug)`; fallback em `localStorage`. `ContactModal` pode receber o nome do passeio para contexto.

### 5.5 Atrações

- **`/atracoes/[slug]`** — Rota **Server Component**: chama `getAttractionBySlug(params.slug)` no servidor, gera metadados com `generateMetadata`, retorna `notFound()` se não existir, e renderiza `<AttractionDetailPage attraction={attraction} />`. O componente de detalhe está em `components/attraction-detail-page.tsx`.

### 5.6 Blog

- **`/blog`** — Listagem com busca e filtro por tag. Posts vêm de `localStorage` (chave `blogPosts`); há suporte a Supabase em `supabase-blog.ts` conforme evolução do projeto.
- **`/blog/[slug]`** — Página do post individual (conteúdo e metadados).

### 5.7 Admin

- **`/admin/login`** — Login (Supabase Auth). Redirecionamento para `/admin` após sucesso.
- **`/admin/unauthorized`** — Acesso negado.
- **`/admin`** — Painel: abas Tours, Blog, Pacotes, Atrações; listagem e CRUD (create, update, delete) para cada entidade. Usa `createClient()` do Supabase para checar sessão; se não houver sessão, redireciona para `/admin/login`. Diálogos: `AddTourDialog`, `AddBlogDialog`, `AddPackageDialog`, `AddAttractionDialog`. Cards de listagem: `AdminTourCard`, `AdminBlogCard`, `AdminPackageCard`, `AdminAttractionCard`.

### 5.8 Páginas institucionais

- **`/politica-privacidade`**, **`/termos-uso`**, **`/politica-cancelamento`** — Conteúdo estático (e possíveis layouts próprios).

### 5.9 Testes de integração

- **`/test-integrations`** — Página para testar integrações (Supabase, Resend, etc.).
- **`/api/test-supabase`** (GET) — Testa conexão ao Supabase e existência de tabelas (tours, packages, attractions, package_highlights, package_included, etc.); retorna JSON com status e amostra de dados.
- **`/api/test-resend`** (POST) — Envio de e-mail de teste via Resend (body: `to`, `subject`, `message`).

---

## 6. Server Actions e API

### 6.1 Formulário de contato (`app/actions/contact.ts`)

- **`submitContactForm(data: SubmitContactFormData)`** — Server Action.
- Campos: `name`, `whatsapp`, `email`, `checkin`, `guests`, `attraction`.
- Valida `RESEND_API_KEY` e `CONTACT_EMAIL`.
- Formata número WhatsApp, gera link `wa.me` e envia e-mail HTML (template BonitoON) para a equipe, com plano de ação e links de resposta.
- Retorno: `{ success, emailId?, message? }` ou `{ success: false, error }` com mensagens amigáveis (configuração, rate limit, rede, genérico).

### 6.2 Outras actions

- **`app/actions/newsletter.ts`** — Inscrição/gestão de newsletter (conforme implementação).
- **`app/actions/auth.ts`** — Ações de autenticação (login/logout/admin).

---

## 7. Contextos e estado global

### 7.1 LanguageContext (`contexts/language-context.tsx`)

- **Idiomas:** `pt`, `en`, `es`.
- **Persistência:** `localStorage` (chave `language`).
- **API:** `language`, `setLanguage(lang)`, `t(key)` para traduções.
- **Uso:** Navbar, footer, seções, botões, labels em todo o site.

### 7.2 ContactModalContext (`contexts/contact-modal-context.tsx`)

- **Estado:** `isOpen`, `attraction` (opcional, para contexto do modal).
- **Métodos:** `openModal(attraction?)`, `closeModal()`.
- **Comportamento:** Modal de contato pode abrir automaticamente após 4s na primeira visita (flag em `sessionStorage`: `autoModalShown`). Ao fechar, a flag é removida.
- **Uso:** `ContactModal`, `HeroSection`, botões “Reservar” e “Fale conosco” em várias páginas.

### 7.3 Hook useContactModal (`hooks/use-contact-modal.tsx`)

- Mantém estado local `isOpen` e lógica de abertura automática (4s, `sessionStorage`).
- **Importante:** O `ContactModal` renderizado no layout usa **apenas** o `ContactModalContext`. O hook é usado no **Footer** (e no layout, mas sem efeito no modal). Para que “Fale conosco” no footer abra o mesmo modal, o Footer deveria usar `useContext(ContactModalContext)` ou um hook que consuma o contexto, não o `useContactModal` do `hooks/`, a menos que esse hook seja alterado para usar o contexto internamente.

---

## 8. Componentes principais

### 8.1 Layout e navegação

- **SiteLayout** — Envolve conteúdo com `Navigation`, `main` e `Footer`; exibe `ContactModal` controlado pelo contexto. Usado na home e nas páginas de pacotes, passeios, etc.
- **Navigation** — Barra fixa no topo; esconde ao rolar para baixo e reaparece ao rolar para cima ou ao mover o mouse no topo. Links: Pacotes, Passeios (tarifário), Gastronomia, Hospedagens, Blog. Seletor de idioma (pt, en, es). Menu mobile (drawer). **Nota:** A navbar não é exibida em `/test-integrations` e em rotas diferentes de `/` (conforme condicional no código).
- **Footer** — Gradiente verde escuro, links rápidos, contato (endereço, telefone, e-mail, horário), emergência 24h, redes (Facebook, Instagram, YouTube, WhatsApp), resumo de avaliações Google, políticas (privacidade, termos, cancelamento), formas de pagamento. Usa `useContactModal` de `@/hooks/use-contact-modal` para o CTA de contato.

### 8.2 Seções da home

- **HeroSection** — Vídeo de fundo (`/file.mp4`), overlay, título “Descubra Bonito”, CTA “Fale Conosco” (abre modal). Scroll suave para a seção de pacotes.
- **PackagesSection** — Destaque de pacotes com link para `/pacotes`.
- **ToursSection** — Abas por categoria (all, resort, floating, adventure, waterfall, etc.), grid de `TourCard`, link “Ver todas as atrações” para `/tarifario`. Escuta evento `changeTourCategory` para sincronizar categoria.
- **AttractionsSection** — Gastronomia, hospedagens, etc., com categorias e cards.
- **SeasonSection** — Informações de alta/baixa temporada e calendário.
- **BlogSection** — Últimos posts; link para `/blog`.
- **ReviewsSection** — Depoimentos e link para avaliações no Google.

### 8.3 Cards e listas

- **TourCard** — Imagem, título, preço, rating, categoria; link para `/passeios/[slug]` e botão de reserva.
- **PackageCard** — Usado na listagem de pacotes (imagem, título, preço, duração, etc.).
- **BlogCard** — Título, excerpt, tags, tempo de leitura; link para `/blog/[slug]`.

### 8.4 Modal de contato

- **ContactModal** — Dialog (Radix) com formulário: nome, telefone/WhatsApp, e-mail, check-in, número de hóspedes, atração de interesse. Submit chama `submitContactForm` (Server Action); toast de sucesso/erro e fechamento do modal. Controlado por `ContactModalContext`.

### 8.5 UI (shadcn/ui)

- Componentes em `components/ui/`: Button, Card, Input, Label, Select, Tabs, Dialog, Badge, Accordion, Carousel, etc. Baseados em Radix UI + Tailwind, com utilitário `cn()` de `lib/utils.ts`.

---

## 9. Estilos e acessibilidade

### 9.1 `app/globals.css`

- Variáveis CSS para tema claro e `.dark` (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, radius, chart).
- Scroll suave, `overflow-x: hidden` no `html`/`body` para evitar barra horizontal.
- Utilitários: touch (touch-manipulation, touch-target), animações (fadeInUp, slideInLeft/Right, scaleIn, bounceSubtle, float, glow), delays de animação, scrollbar-hide, gradient-text, glass, hover-lift, skeleton loading, container responsivo, safe-area, redução de movimento (`prefers-reduced-motion`), focus-visible para acessibilidade.
- Mobile: tamanhos de fonte, espaçamento, botões full-width, blur reduzido em telas pequenas.

### 9.2 Acessibilidade

- Focus visível com `outline-primary`.
- Uso de componentes Radix (dialog, tabs, etc.) com suporte a teclado e ARIA.
- Estrutura semântica (header, main, footer, sections).

---

## 10. SEO e metadados

- **`app/metadata.ts`** — `metadataBase`: `https://bonitoon.com.br`. Título padrão “BonitoON - Turismo em Bonito MS”, template “%s | BonitoON”, description, keywords, authors, Open Graph e Twitter Card, alternates (canonical, pt-BR, en-US), robots “index, follow”, verificação Google.
- Páginas que precisam de SEO dinâmico (ex.: `atracoes/[slug]`) usam `generateMetadata` com dados da atração.

---

## 11. Integração com fluxos externos (n8n / Onofre)

O arquivo **`atrativo-atividade-preco.md`** descreve a tabela **`atrativo_atividade_precos`** no Supabase, usada no fluxo de pré-vendas (chatbot Onofre):

- Preços por atrativo/atividade, data/temporada e perfil (adulto/criança).
- Dados carregados pelo nó “Buscar preços atrativos (Supabase)” e enviados ao LLM no campo **DADOS_ATRATIVOS_PRECOS** (~12.000 caracteres).
- Regras: usar apenas esses dados para preços e sugestões de pacote; considerar horário, distância e ordem lógica; não inventar valores.

O site consome a view `atrativo_atividade_precos` diretamente para exibir preços nos passeios. A documentação detalhada do fluxo (matching, seleção da linha principal, exibição na UI) está em **`docs/ESTRUTURA-PRECOS.md`**.

---

## 12. Resumo de dependências principais

- **next**, **react**, **react-dom** — Core.
- **@supabase/ssr** (e Supabase JS no backend) — Auth e banco.
- **resend** — E-mail (contato e testes).
- **Radix UI** (accordion, alert-dialog, avatar, dialog, dropdown-menu, label, select, slot, tabs, toast) — Componentes acessíveis.
- **class-variance-authority**, **clsx**, **tailwind-merge** — Estilos e variantes.
- **lucide-react** — Ícones.
- **tailwindcss-animate** — Animações Tailwind.

---

## 13. Pontos de atenção e melhorias sugeridas

1. **Modal de contato:** Unificar controle do modal em um único lugar (recomendado: apenas `ContactModalContext`). Fazer o Footer e qualquer outro CTA usarem o contexto em vez do hook `use-contact-modal.tsx`, ou fazer o hook delegar ao contexto.
2. **Layout:** O root layout não inclui navbar/footer; isso fica a cargo do `SiteLayout`. Páginas como `/blog` podem não usar `SiteLayout` — conferir se todas as páginas públicas que precisam de navbar/footer estão envolvidas por `SiteLayout`.
3. **Blog:** Fonte de dados atualmente em `localStorage` na listagem; alinhar com `supabase-blog` e persistência no Supabase quando o recurso estiver ativo.
4. **Navigation:** A condição que esconde a nav em rotas diferentes de `/` pode fazer a navbar sumir em `/pacotes`, `/tarifario`, etc. Vale revisar se a intenção é esconder apenas em `/test-integrations` ou em todas as rotas exceto home.
5. **Build:** Remover ou restringir `ignoreDuringBuilds` e `ignoreBuildErrors` em produção e corrigir erros de lint e TypeScript.
6. **Tipos:** Garantir que os tipos em `lib/supabase/types.ts` e em `types/package.ts` estejam alinhados com o schema real do Supabase e com os retornos dos serviços.

---

*Documentação gerada com base na análise do código-fonte do repositório. Para detalhes de schema do banco e variáveis de ambiente, consulte o Supabase e o `.env.example` (se existir).*
