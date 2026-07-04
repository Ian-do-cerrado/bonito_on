# Página /pacotes-promo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar a rota `/pacotes-promo` como réplica visual 1:1 da landing do clone `bonito-on-your-dream-trip/`, isolada dos estilos do site.

**Architecture:** Página self-contained em `app/pacotes-promo/`. Isolamento em 3 camadas: (1) override de CSS vars escopado sob `.promo-scope` no `promo.css` reaproveita os utilitários de cor do Tailwind v3 do site; (2) classes `.promo-*` para tokens fora do config (sombras, `primary-dark`, `whatsapp`, hero-gradient, `text-balance`, fundos oklch do Header/Footer); (3) fontes Sora/Inter via `next/font` como CSS variables. Componentização por seção; conteúdo copiado literalmente do clone.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS v3.3.5, `embla-carousel-react@^8.6.0`, `lucide-react@^0.294.0`, `next/font/google`.

## Global Constraints

- **Zero alteração** em `tailwind.config.ts`, `app/globals.css`, ou qualquer componente compartilhado do site.
- **Zero novas dependências** (usar só o que já está em `package.json`).
- Página **não usa** `SiteLayout`.
- Imagens via `<img>` (sem `next/image`), servidas de `public/pacotes-promo/`.
- Conteúdo (textos, WhatsApp `5567991395384`, links, FAQ) = cópia literal do clone.
- Fonte de verdade do JSX: `bonito-on-your-dream-trip/src/routes/index.tsx`.

### Tabela de conversão de classes (aplicar ao copiar o JSX do clone)

Classes do clone que **permanecem idênticas** (resolvidas pela Camada 1): todas as `bg-/text-/border-/ring-` de `background, foreground, card, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, border, input, ring`, **incluindo variantes de opacidade** (`bg-primary/10`, `bg-secondary/60`, `border-border/70`, `text-foreground/70`, etc.) e utilitários de layout puro.

Classes do clone que **devem ser trocadas** (Camada 2):

| Classe no clone | Trocar por |
|---|---|
| `shadow-soft` | `promo-shadow-soft` |
| `shadow-card` | `promo-shadow-card` |
| `shadow-premium` | `promo-shadow-premium` |
| `hover:shadow-card` | `hover:promo-shadow-card` |
| `bg-primary-dark` | `promo-bg-primary-dark` |
| `hover:bg-primary-dark` | `hover:promo-bg-primary-dark` |
| `text-primary-dark` | `promo-text-primary-dark` |
| `bg-hero-gradient` | `promo-hero-gradient` |
| `text-balance` | `promo-text-balance` |
| `bg-whatsapp` | `promo-bg-whatsapp` |
| `bg-whatsapp/40` | `promo-bg-whatsapp-40` |
| `bg-[oklch(0.18_0.03_155)]/95` | `promo-bg-brand-dark-95` |
| `bg-[oklch(0.18_0.03_155)]` | `promo-bg-brand-dark` |

### Tabela de paths de imagem (aplicar ao copiar o JSX)

| Import/uso no clone | Trocar por |
|---|---|
| `src={heroBonito}` | `src="/pacotes-promo/hero-bonito.jpg"` |
| `src={rioDaPrata}` | `src="/pacotes-promo/rio-da-prata.jpg"` |
| `src={estanciaMimosa}` | `src="/pacotes-promo/estancia-mimosa.jpg"` |
| `src={grutaMimoso}` | `src="/pacotes-promo/gruta-mimoso.jpg"` |
| `src={boiaCross}` | `src="/pacotes-promo/boia-cross.jpg"` |
| `src={estrelaFormoso}` | `src="/pacotes-promo/estrela-formoso.jpg"` |
| `pkg2_1.url` … `pkg2_6.url` | `"/pacotes-promo/pkg2-1.webp"` … `pkg2-6.jpg` |
| `pkg34_1.url`, `pkg34_2.url` | `"/pacotes-promo/pkg34-1.jpeg"`, `pkg34-2.jpeg` |
| `src="/logo.svg"` (Header/Footer) | `src="/pacotes-promo/logo.svg"` |

Extensões exatas das imagens de pacote: `pkg2-1.webp`, `pkg2-2.webp`, `pkg2-3.jpg`, `pkg2-4.jpg`, `pkg2-5.webp`, `pkg2-6.jpg`, `pkg34-1.jpeg`, `pkg34-2.jpeg`.

---

## Task 1: Assets em `public/pacotes-promo/`

**Files:**
- Create dir: `public/pacotes-promo/`
- Copy: 6 imagens reais + `logo.svg` do clone
- Download: 8 imagens de pacote dos hosts Lovable

**Interfaces:**
- Produces: 15 arquivos em `public/pacotes-promo/` referenciados pelo JSX das tasks seguintes.

- [ ] **Step 1: Copiar imagens reais e logo do clone**

```bash
mkdir -p public/pacotes-promo
cp bonito-on-your-dream-trip/src/assets/hero-bonito.jpg public/pacotes-promo/
cp bonito-on-your-dream-trip/src/assets/rio-da-prata.jpg public/pacotes-promo/
cp bonito-on-your-dream-trip/src/assets/estancia-mimosa.jpg public/pacotes-promo/
cp bonito-on-your-dream-trip/src/assets/gruta-mimoso.jpg public/pacotes-promo/
cp bonito-on-your-dream-trip/src/assets/boia-cross.jpg public/pacotes-promo/
cp bonito-on-your-dream-trip/src/assets/estrela-formoso.jpg public/pacotes-promo/
cp bonito-on-your-dream-trip/public/logo.svg public/pacotes-promo/
```

- [ ] **Step 2: Baixar as 8 imagens de pacote**

Cada `.asset.json` tem um campo `url` como `/__l5e/assets-v1/<asset_id>/<file>`. Baixar de `https://bonito-dream-weaver.lovable.app<url>`; se retornar 404/HTML, tentar `https://id-preview--eb71d3e7-2391-4a66-a7e1-a81c766f4301.lovable.app<url>`.

```bash
BASE1="https://bonito-dream-weaver.lovable.app"
BASE2="https://id-preview--eb71d3e7-2391-4a66-a7e1-a81c766f4301.lovable.app"
DIR="bonito-on-your-dream-trip/src/assets"
for f in pkg2/pkg2-1.webp pkg2/pkg2-2.webp pkg2/pkg2-3.jpg pkg2/pkg2-4.jpg pkg2/pkg2-5.webp pkg2/pkg2-6.jpg pkg34/pkg34-1.jpeg pkg34/pkg34-2.jpeg; do
  url=$(node -e "console.log(require('./$DIR/$f.asset.json').url)")
  out="public/pacotes-promo/$(basename $f)"
  curl -fsSL "$BASE1$url" -o "$out" || curl -fsSL "$BASE2$url" -o "$out"
  echo "$out -> $(wc -c < "$out") bytes"
done
```

- [ ] **Step 3: Verificar que os 15 arquivos existem e não estão vazios**

Run: `ls -l public/pacotes-promo/ && find public/pacotes-promo -size 0`
Expected: 15 arquivos listados (6 jpg + logo.svg + 8 pkg); o `find` não retorna nada (nenhum arquivo vazio). Se algum pkg vier como HTML (tamanho pequeno/errado), investigar o host antes de prosseguir.

- [ ] **Step 4: Commit**

```bash
git add public/pacotes-promo/
git commit -m "feat(pacotes-promo): assets (imagens e logo)"
```

---

## Task 2: `promo.css` — tokens, classes e fontes

**Files:**
- Create: `app/pacotes-promo/promo.css`

**Interfaces:**
- Produces: classe wrapper `.promo-scope` (override de tokens + font-family), classes `.promo-shadow-{soft,card,premium}`, `.promo-bg-primary-dark`, `.promo-text-primary-dark`, `.promo-hero-gradient`, `.promo-text-balance`, `.promo-bg-whatsapp`, `.promo-bg-whatsapp-40`, `.promo-bg-brand-dark`, `.promo-bg-brand-dark-95`. Consome as CSS vars `--promo-font-sans` e `--promo-font-display` (definidas no `page.tsx`, Task 9).

- [ ] **Step 1: Criar `app/pacotes-promo/promo.css`**

```css
/* Tokens do clone (oklch convertido para HSL) escopados na landing.
   Herdam para toda a subárvore de .promo-scope — não vazam pro resto do site. */
.promo-scope {
  --background: 77.8 63.7% 98.9%;
  --foreground: 140.4 32.5% 6%;
  --card: 0 0% 100%;
  --card-foreground: 140.4 32.5% 6%;
  --popover: 0 0% 100%;
  --popover-foreground: 140.4 32.5% 6%;
  --primary: 150.5 100% 35.7%;
  --primary-foreground: 0 0% 100%;
  --secondary: 137.1 34.5% 94%;
  --secondary-foreground: 140.8 27.4% 11.7%;
  --muted: 128.8 20.5% 95.1%;
  --muted-foreground: 137.9 6.3% 37.9%;
  --accent: 137.9 55.7% 90%;
  --accent-foreground: 145.7 62.4% 9.8%;
  --border: 137 12.5% 89.1%;
  --input: 137 12.5% 89.1%;
  --ring: 150.5 100% 35.7%;
  --radius: 1rem;

  font-family: var(--promo-font-sans), ui-sans-serif, system-ui, sans-serif;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

.promo-scope h1,
.promo-scope h2,
.promo-scope h3,
.promo-scope h4 {
  font-family: var(--promo-font-display), var(--promo-font-sans), ui-sans-serif, sans-serif;
  letter-spacing: -0.02em;
}

/* --- Camada 2: tokens fora do tailwind.config do site --- */

.promo-shadow-soft { box-shadow: 0 4px 20px -6px oklch(0.55 0.15 155 / 0.15); }
.promo-shadow-card { box-shadow: 0 12px 40px -12px oklch(0.35 0.1 155 / 0.18); }
.promo-shadow-premium { box-shadow: 0 30px 60px -20px oklch(0.35 0.15 155 / 0.35); }
.hover\:promo-shadow-card:hover { box-shadow: 0 12px 40px -12px oklch(0.35 0.1 155 / 0.18); }

.promo-bg-primary-dark { background-color: hsl(146.5 100% 18.9%); }
.hover\:promo-bg-primary-dark:hover { background-color: hsl(146.5 100% 18.9%); }
.promo-text-primary-dark { color: hsl(146.5 100% 18.9%); }

.promo-hero-gradient {
  background: linear-gradient(
    180deg,
    oklch(0.15 0.05 155 / 0.15) 0%,
    oklch(0.15 0.05 155 / 0.55) 60%,
    oklch(0.12 0.05 155 / 0.85) 100%
  );
}

.promo-text-balance { text-wrap: balance; }

.promo-bg-whatsapp { background-color: hsl(133.6 49% 51.9%); }
.promo-bg-whatsapp-40 { background-color: hsl(133.6 49% 51.9% / 0.4); }

.promo-bg-brand-dark { background-color: hsl(141.8 56.2% 5.4%); }
.promo-bg-brand-dark-95 { background-color: hsl(141.8 56.2% 5.4% / 0.95); }
```

- [ ] **Step 2: Verificar sintaxe do CSS**

Run: `npx --yes lightningcss-cli app/pacotes-promo/promo.css 2>&1 | head -20 || echo "(lightningcss indisponível — validação ocorre no build da Task 9)"`
Expected: sem erros de sintaxe, ou a mensagem de fallback. Validação real acontece no `next build` da Task 9.

- [ ] **Step 3: Commit**

```bash
git add app/pacotes-promo/promo.css
git commit -m "feat(pacotes-promo): tokens escopados e classes promo-*"
```

---

## Task 3: `config/` — dados estáticos

**Files:**
- Create: `app/pacotes-promo/config/data.ts`

**Interfaces:**
- Produces: `WHATSAPP_NUMBER: string`, `WHATSAPP_MESSAGE: string`, `whatsappUrl: string`, `type Pkg`, `packages: Pkg[]`, e (para as seções) os arrays `whyUsItems`, `comparisonRows`, `howItWorksSteps`, `includedItems`, `notIncludedItems`, `differentialsItems`, `galleryShots`, `faqs`. Ícones (`lucide-react`) referenciados nos itens ficam nos componentes, não aqui — aqui só dados serializáveis (strings). Os componentes mapeiam título→ícone.

- [ ] **Step 1: Criar `app/pacotes-promo/config/data.ts`**

Copiar de `bonito-on-your-dream-trip/src/routes/index.tsx`:
- `WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE`, `whatsappUrl` (linhas 72–75).
- `type Pkg` e `packages` (linhas 246–302), **trocando** cada `src` de imagem pelos paths de `public/` (tabela de paths). Ex.: `{ src: "/pacotes-promo/pkg2-1.webp", alt: "Gruta do Mimoso" }`.
- Os textos das listas das seções (`WhyUs` 202–209, `Comparison` rows 451–460, `HowItWorks` steps 530–536, `IncludedSection` 570–571, `Differentials` 624–631, `Gallery` shots 667–672, `FAQ` faqs 711–732).

Para itens com ícone (`WhyUs`, `Differentials`): exportar só `{ title, desc }` e mapear o ícone por título no componente (Task 5), OU exportar um campo `icon: string` com o nome do ícone e resolver via um dicionário no componente. **Escolha:** exportar `icon` como string com o nome do componente lucide (ex.: `icon: "Headphones"`) e o componente resolve num objeto `{ Headphones, Sparkles, ... }`.

- [ ] **Step 2: Verificar type-check**

Run: `npm run type-check`
Expected: PASS (sem erros). O arquivo é só dados; nenhum import de React.

- [ ] **Step 3: Commit**

```bash
git add app/pacotes-promo/config/data.ts
git commit -m "feat(pacotes-promo): dados estáticos das seções"
```

---

## Task 4: Chrome — `WhatsAppIcon`, `Header`, `WhatsAppFloat`, `Footer`

**Files:**
- Create: `app/pacotes-promo/components/whatsapp-icon.tsx`
- Create: `app/pacotes-promo/components/header.tsx`
- Create: `app/pacotes-promo/components/whatsapp-float.tsx`
- Create: `app/pacotes-promo/components/footer.tsx`

**Interfaces:**
- Consumes: `whatsappUrl` de `../config/data`.
- Produces: `WhatsAppIcon({ className }: { className?: string })`, `Header()`, `WhatsAppFloat()`, `Footer()` (default ou named exports — usar **named exports** para consistência).

- [ ] **Step 1: `whatsapp-icon.tsx`** — copiar o componente `WhatsAppIcon` (index.tsx:24–36) verbatim. Named export.

- [ ] **Step 2: `header.tsx`** — copiar `Header` (index.tsx:100–120). Aplicar tabela de classes: `bg-[oklch(0.18_0.03_155)]/95`→`promo-bg-brand-dark-95`, `shadow-soft`→`promo-shadow-soft`, `hover:bg-primary-dark`→`hover:promo-bg-primary-dark`, `hover:shadow-card`→`hover:promo-shadow-card`. Trocar `src="/logo.svg"`→`src="/pacotes-promo/logo.svg"`. Importar `WhatsAppIcon` e `whatsappUrl`.

- [ ] **Step 3: `whatsapp-float.tsx`** — copiar `WhatsAppFloat` (index.tsx:907–919). Trocar `bg-whatsapp`→`promo-bg-whatsapp`, `shadow-premium`→`promo-shadow-premium`, `bg-whatsapp/40`→`promo-bg-whatsapp-40`.

- [ ] **Step 4: `footer.tsx`** — copiar `Footer` (index.tsx:819–903). Trocar `bg-[oklch(0.18_0.03_155)]`→`promo-bg-brand-dark`, `src="/logo.svg"`→`src="/pacotes-promo/logo.svg"`. Manter links (Instagram, Facebook, e-mail, endereço, Google Maps) literais. Importar `WhatsAppIcon`, `whatsappUrl`, e ícones `Mail, MapPin, Instagram, Facebook` de `lucide-react`.

- [ ] **Step 5: Verificar type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/pacotes-promo/components/whatsapp-icon.tsx app/pacotes-promo/components/header.tsx app/pacotes-promo/components/whatsapp-float.tsx app/pacotes-promo/components/footer.tsx
git commit -m "feat(pacotes-promo): header, footer, whatsapp float e icon"
```

---

## Task 5: `Hero` e seções de cards — `WhyUs`, `Differentials`

**Files:**
- Create: `app/pacotes-promo/components/hero.tsx`
- Create: `app/pacotes-promo/components/why-us.tsx`
- Create: `app/pacotes-promo/components/differentials.tsx`

**Interfaces:**
- Consumes: `whyUsItems`, `differentialsItems` de `../config/data`.
- Produces: `Hero()`, `WhyUs()`, `Differentials()` (named exports). `Hero` inclui o helper local `Stat`.

- [ ] **Step 1: `hero.tsx`** — copiar `Hero` (index.tsx:123–188) e `Stat` (191–198). Trocar: `src={heroBonito}`→`src="/pacotes-promo/hero-bonito.jpg"`, `bg-hero-gradient`→`promo-hero-gradient`, todos `text-balance`→`promo-text-balance`, `shadow-soft`→`promo-shadow-soft` (botão), `shadow-premium`→`promo-shadow-premium`, `hover:bg-primary-dark`→`hover:promo-bg-primary-dark`. Importar `MapPin, Check, ArrowRight` de `lucide-react`.

- [ ] **Step 2: `why-us.tsx`** — copiar `WhyUs` (index.tsx:201–242). Resolver ícones via dicionário local `{ Headphones, Sparkles, Compass, ShieldCheck, Clock, Users }` a partir de `item.icon` (string). Trocar `text-balance`→`promo-text-balance`, `hover:shadow-card`→`hover:promo-shadow-card`.

- [ ] **Step 3: `differentials.tsx`** — copiar `Differentials` (index.tsx:623–662). Mesmo padrão de dicionário de ícones `{ Mountain, Sparkles, Clock, Users, Compass, Headphones }`. Trocar `text-balance`→`promo-text-balance`, `hover:shadow-card`→`hover:promo-shadow-card`.

- [ ] **Step 4: Verificar type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/pacotes-promo/components/hero.tsx app/pacotes-promo/components/why-us.tsx app/pacotes-promo/components/differentials.tsx
git commit -m "feat(pacotes-promo): hero, why-us, differentials"
```

---

## Task 6: `Packages` + `PackageCard` + `PackageCarousel` (com prev/next locais)

**Files:**
- Create: `app/pacotes-promo/components/package-carousel.tsx`
- Create: `app/pacotes-promo/components/package-card.tsx`
- Create: `app/pacotes-promo/components/packages.tsx`

**Interfaces:**
- Consumes: `packages`, `type Pkg`, `WHATSAPP_NUMBER` de `../config/data`; `Carousel, CarouselContent, CarouselItem` de `@/components/ui/carousel`; `useCarousel`? não — usar botões locais via ref do embla exposto pelo `Carousel`.
- Produces: `Packages()`, `PackageCard({ pkg }: { pkg: Pkg })`, `PackageCarousel({ images }: { images: { src: string; alt: string }[] })`.

> Nota: o `CarouselPrevious`/`CarouselNext` do site usam o `Button` compartilhado (cores cinza). Para fidelidade, re-implementar prev/next localmente com `useCarousel()` exportado por `@/components/ui/carousel` (verificar se é exportado; se não, usar o contexto via os componentes `CarouselPrevious`/`CarouselNext` passando `className` e `variant`/`size` que neutralizem as cores — mas preferir botões próprios). O comportamento visual: setas em `left-3`/`right-3`, `opacity-0 transition-opacity group-hover:opacity-100`.

- [ ] **Step 1: Confirmar API do carousel do site**

Run: `grep -nE "export|useCarousel|CarouselPrevious|CarouselNext" components/ui/carousel.tsx`
Expected: identificar se `useCarousel` é exportado. Registrar o resultado para decidir a implementação dos botões no Step 2.

- [ ] **Step 2: `package-carousel.tsx`** — copiar a estrutura de `PackageCarousel` (index.tsx:330–351): `<Carousel opts={{ loop: true }} className="group relative">` com `CarouselContent`/`CarouselItem` e `<img>` `aspect-square object-cover`. Substituir `CarouselPrevious`/`CarouselNext` por dois botões locais posicionados (`absolute left-3`/`right-3 top-1/2 -translate-y-1/2`, `opacity-0 transition-opacity group-hover:opacity-100`), com `ChevronLeft`/`ChevronRight` de `lucide-react`, cor `bg-card/80 text-foreground` e `promo-shadow-soft`, que chamam a API do embla identificada no Step 1 (via `useCarousel()` se exportado; senão, reusar `CarouselPrevious`/`CarouselNext` com `className` cobrindo as cores). Marcar o arquivo `'use client'`.

- [ ] **Step 3: `package-card.tsx`** — copiar `PackageCard` (index.tsx:353–447). Trocar: `shadow-premium`→`promo-shadow-premium`, `shadow-soft`→`promo-shadow-soft`, `hover:shadow-card`→`hover:promo-shadow-card`, `hover:bg-primary-dark`→`hover:promo-bg-primary-dark`. Importar `Waves, Check, X, Star` de `lucide-react`, `WhatsAppIcon`, `PackageCarousel`, `WHATSAPP_NUMBER`, `type Pkg`.

- [ ] **Step 4: `packages.tsx`** — copiar `Packages` (index.tsx:304–328). Trocar `text-balance`→`promo-text-balance`. Importar `packages` e `PackageCard`.

- [ ] **Step 5: Verificar type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/pacotes-promo/components/package-carousel.tsx app/pacotes-promo/components/package-card.tsx app/pacotes-promo/components/packages.tsx
git commit -m "feat(pacotes-promo): pacotes com carrossel (prev/next locais)"
```

---

## Task 7: `Comparison`, `HowItWorks`, `IncludedSection`

**Files:**
- Create: `app/pacotes-promo/components/comparison.tsx`
- Create: `app/pacotes-promo/components/how-it-works.tsx`
- Create: `app/pacotes-promo/components/included-section.tsx`

**Interfaces:**
- Consumes: `comparisonRows`, `howItWorksSteps`, `includedItems`, `notIncludedItems` de `../config/data`.
- Produces: `Comparison()`, `HowItWorks()`, `IncludedSection()`.

- [ ] **Step 1: `comparison.tsx`** — copiar `Comparison` (index.tsx:450–526). Trocar `text-balance`→`promo-text-balance`, `shadow-soft`→`promo-shadow-soft`, `text-primary-dark`→`promo-text-primary-dark`. Manter a lógica de destaque da coluna do meio (`i === 1`) idêntica.

- [ ] **Step 2: `how-it-works.tsx`** — copiar `HowItWorks` (index.tsx:529–566). Trocar `text-balance`→`promo-text-balance`, `shadow-soft`→`promo-shadow-soft`.

- [ ] **Step 3: `included-section.tsx`** — copiar `IncludedSection` (index.tsx:569–620). Trocar `text-balance`→`promo-text-balance`, `text-primary-dark`→`promo-text-primary-dark`. Importar `Check, X` de `lucide-react`.

- [ ] **Step 4: Verificar type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/pacotes-promo/components/comparison.tsx app/pacotes-promo/components/how-it-works.tsx app/pacotes-promo/components/included-section.tsx
git commit -m "feat(pacotes-promo): comparativo, como funciona, incluso"
```

---

## Task 8: `Gallery`, `FAQ` (+`FAQItem`), `FinalCTA`

**Files:**
- Create: `app/pacotes-promo/components/gallery.tsx`
- Create: `app/pacotes-promo/components/faq.tsx`
- Create: `app/pacotes-promo/components/final-cta.tsx`

**Interfaces:**
- Consumes: `galleryShots`, `faqs`, `whatsappUrl` de `../config/data`.
- Produces: `Gallery()`, `FAQ()` (inclui `FAQItem`), `FinalCTA()`.

- [ ] **Step 1: `gallery.tsx`** — copiar `Gallery` (index.tsx:666–707). Trocar `text-balance`→`promo-text-balance`. Imagens já vêm com paths de `public/` via `galleryShots`.

- [ ] **Step 2: `faq.tsx`** — copiar `FAQ` (index.tsx:710–753) e `FAQItem` (755–781). Marcar `'use client'` (usa `useState`). Trocar `text-balance`→`promo-text-balance`. Importar `ChevronDown` de `lucide-react`.

- [ ] **Step 3: `final-cta.tsx`** — copiar `FinalCTA` (index.tsx:784–816). Trocar `src={estrelaFormoso}`→`src="/pacotes-promo/estrela-formoso.jpg"`, `text-balance`→`promo-text-balance`, `shadow-premium`→`promo-shadow-premium`. Importar `WhatsAppIcon`, `whatsappUrl`.

- [ ] **Step 4: Verificar type-check**

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/pacotes-promo/components/gallery.tsx app/pacotes-promo/components/faq.tsx app/pacotes-promo/components/final-cta.tsx
git commit -m "feat(pacotes-promo): galeria, faq, cta final"
```

---

## Task 9: `page.tsx` — montagem, fontes, metadata e verificação end-to-end

**Files:**
- Create: `app/pacotes-promo/page.tsx`

**Interfaces:**
- Consumes: todos os componentes de `./components/*`.
- Produces: a rota `/pacotes-promo`.

- [ ] **Step 1: Criar `app/pacotes-promo/page.tsx`**

```tsx
"use client";

import { Sora, Inter } from "next/font/google";
import "./promo.css";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { WhyUs } from "./components/why-us";
import { Packages } from "./components/packages";
import { Comparison } from "./components/comparison";
import { HowItWorks } from "./components/how-it-works";
import { IncludedSection } from "./components/included-section";
import { Differentials } from "./components/differentials";
import { Gallery } from "./components/gallery";
import { FAQ } from "./components/faq";
import { FinalCTA } from "./components/final-cta";
import { Footer } from "./components/footer";
import { WhatsAppFloat } from "./components/whatsapp-float";

const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700", "800"], display: "swap", variable: "--promo-font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--promo-font-sans" });

export default function PacotesPromoPage() {
  return (
    <div className={`promo-scope min-h-screen ${sora.variable} ${inter.variable}`}>
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Packages />
        <Comparison />
        <HowItWorks />
        <IncludedSection />
        <Differentials />
        <Gallery />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
```

> Nota metadata: como `page.tsx` é Client Component, o `export const metadata` não é permitido no mesmo arquivo. Se SEO for necessário, adicionar `app/pacotes-promo/layout.tsx` (Server Component) com `export const metadata` replicando title/description/OG do clone (`__root.tsx`:75–101), com `og:image: "/pacotes-promo/logo.svg"`. Incluir esse layout neste step.

- [ ] **Step 2: Criar `app/pacotes-promo/layout.tsx` com metadata**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS",
  description:
    "Roteiros prontos para Bonito/MS com flutuações, cachoeiras e grutas. Escolha entre pacotes de 2, 3 ou 4 dias e fale com um especialista pelo WhatsApp.",
  openGraph: {
    title: "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS",
    description:
      "Conheça Bonito do jeito mais completo possível. Pacotes prontos, atendimento especializado, melhores atrações.",
    type: "website",
    images: ["/pacotes-promo/logo.svg"],
  },
  twitter: { card: "summary_large_image", title: "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS" },
};

export default function PacotesPromoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 3: type-check + build**

Run: `npm run type-check && npm run build`
Expected: ambos PASS; o output do build lista a rota `/pacotes-promo`.

- [ ] **Step 4: Verificação visual no dev server**

Run: `npm run dev` (background) e abrir `http://localhost:3000/pacotes-promo`.
Expected (checar manualmente ou com o skill `verify`/browser):
- Header verde-escuro fixo com logo e botão verde "Solicitar Orçamento".
- Hero com imagem de fundo + gradiente escuro, título grande em Sora, stats.
- Cards de pacote com carrossel (setas aparecem no hover), card do meio destacado ("Mais escolhido").
- Acordeão do FAQ abre/fecha.
- Sombras e verde da marca presentes; corpo em Inter, headings em Sora.
- WhatsApp float verde no canto inferior direito com animação ping.

- [ ] **Step 5: Verificar ausência de vazamento de estilo**

Abrir uma rota existente (ex.: `http://localhost:3000/` e `/pacotes`) e confirmar que **as cores/tema do site permanecem inalterados** (nada ficou verde). Parar o dev server.

- [ ] **Step 6: Commit**

```bash
git add app/pacotes-promo/page.tsx app/pacotes-promo/layout.tsx
git commit -m "feat(pacotes-promo): montagem da página, fontes e metadata"
```

---

## Task 10: Integração final — merge na `main`

**Files:** nenhum (operação git).

- [ ] **Step 1: Rodar verificação final**

Run: `npm run type-check && npm run build`
Expected: PASS. Não prosseguir se falhar.

- [ ] **Step 2: Merge na `main` e commit final**

```bash
git checkout main
git merge --no-ff feat/pacotes-promo -m "feat: página /pacotes-promo (réplica isolada da landing do clone)"
git log --oneline -5
```

Expected: merge concluído sem conflitos; histórico mostra os commits das tasks.

---

## Notas de verificação por task

Como a página é apresentacional (sem lógica de negócio testável por unidade), a verificação de cada task é **`npm run type-check`** (e `npm run build` na Task 9). A fidelidade visual é verificada manualmente/por browser na Task 9. Não criar testes unitários artificiais para JSX estático (YAGNI).
