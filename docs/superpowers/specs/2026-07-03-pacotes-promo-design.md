# Design — Página `/pacotes-promo`

**Data:** 2026-07-03
**Status:** Aprovado (design), pronto para plano de implementação

## Objetivo

Publicar, na rota `/pacotes-promo` do site atual (Next.js 14 / App Router / Tailwind v3), uma réplica **1:1** da landing page do clone `bonito-on-your-dream-trip/` (projeto Vite + TanStack Router + Tailwind v4), preservando fidelidade visual total, sem alterar o tema nem os estilos do restante do site.

Fonte de verdade do conteúdo e do layout: [`bonito-on-your-dream-trip/src/routes/index.tsx`](../../../bonito-on-your-dream-trip/src/routes/index.tsx) (920 linhas, todas as seções inline) e [`src/styles.css`](../../../bonito-on-your-dream-trip/src/styles.css) (tokens de design em oklch).

## Restrições

- **Zero alteração** em `tailwind.config.ts`, `app/globals.css` ou qualquer componente compartilhado do site.
- **Zero novas dependências**: `embla-carousel-react@^8.6.0` e `lucide-react@^0.294.0` já instalados nas mesmas versões do clone.
- A página **não usa** `SiteLayout` — é self-contained, com Header/Footer próprios do clone.

## O problema central: conflito de tokens

O site define seus tokens em **HSL** e os consome via `hsl(var(--token))` no `tailwind.config.ts`. O clone define os seus em **oklch** (verde da marca, sombras e gradiente próprios). Os valores conflitam diretamente:

| Token | Site (`app/globals.css`) | Clone (`src/styles.css`) |
|---|---|---|
| `--primary` | `221.2 83.2% 53.3%` (azul, HSL) | `oklch(0.68 0.18 152)` (verde) |
| `--secondary` | `210 40% 96%` | `oklch(0.96 0.015 155)` |
| `--background` | `0 0% 100%` | `oklch(0.995 0.005 120)` |
| `--radius` | `0.75rem` | `1rem` |

Reutilizar `bg-primary`, `bg-secondary` etc. diretamente renderizaria as cores erradas (azul/cinza do shadcn padrão) e/ou vazaria cores novas para o resto do site.

**Evidência que habilita a solução:** os componentes shadcn do próprio site já usam modificadores de opacidade em tokens temáticos (`bg-primary/90` em [`components/ui/button.tsx`](../../../components/ui/button.tsx), e mais — 12 ocorrências em 7 arquivos). Isso confirma que, no Tailwind v3.3.5 + config shadcn do site, utilitários como `bg-primary/60` e `bg-secondary/30` **compilam e funcionam**.

## Arquitetura da solução — isolamento em 3 camadas

### Camada 1 — Override de CSS vars escopado (resolve ~120 utilitários sem renomear)

Um arquivo `app/pacotes-promo/promo.css` (importado só nessa página) redefine, **sob a classe wrapper `.promo-scope`**, os tokens que **já existem** no `tailwind.config.ts` do site, com os valores do clone convertidos de oklch para **triplas HSL** (formato `H S% L%`, sem `hsl()`, como o site espera).

Custom properties CSS herdam, então `hsl(var(--primary))` — gerado pelo Tailwind para `bg-primary` — passa a resolver o verde da marca **apenas dentro da subárvore de `.promo-scope`**. Nenhum vazamento para o resto do site (o `:root` global permanece intocado; o override vale só para descendentes da wrapper).

Tokens a sobrescrever em `.promo-scope` (converter os oklch abaixo para triplas HSL na implementação):

```
--background      oklch(0.995 0.005 120)
--foreground      oklch(0.18 0.02 155)
--card            oklch(1 0 0)
--card-foreground oklch(0.18 0.02 155)
--popover / --popover-foreground  (iguais a card)
--primary            oklch(0.68 0.18 152)   /* verde da marca #00B75E */
--primary-foreground oklch(1 0 0)
--secondary            oklch(0.96 0.015 155)
--secondary-foreground oklch(0.25 0.03 155)
--muted            oklch(0.965 0.008 150)
--muted-foreground oklch(0.5 0.02 155)
--accent            oklch(0.94 0.04 155)
--accent-foreground oklch(0.25 0.05 155)
--border  oklch(0.92 0.01 155)
--input   oklch(0.92 0.01 155)
--ring    oklch(0.68 0.18 152)
--radius  1rem
```

Efeito: **todas** as classes de cor padrão do clone (`bg-background`, `bg-card`, `text-primary`, `text-muted-foreground`, `border-border/70`, `bg-secondary/60`, `bg-primary/10`, `bg-primary/85`, `text-foreground/70`, etc. — ~120 ocorrências) ficam **byte-idênticas** ao clone e resolvem corretamente, com opacidade.

> Conversão oklch→HSL: será feita na implementação com precisão suficiente para fidelidade visual (as triplas HSL não precisam ser exatas ao pixel do oklch, mas devem reproduzir o verde da marca e os cinzas esverdeados). Registrar os valores finais no `promo.css`.

### Camada 2 — Classes `.promo-*` para o que NÃO está no config (~31 ocorrências)

Tokens/utilitários do clone que **não existem** no `tailwind.config.ts` do site precisam de classes dedicadas no `promo.css` e de find/replace mecânico no JSX copiado:

| Uso no clone | Substituir por | Definição no `promo.css` |
|---|---|---|
| `bg-primary-dark`, `hover:bg-primary-dark`, `text-primary-dark` | `.promo-bg-primary-dark` etc. | cor `oklch(0.42 0.13 155)` → HSL |
| `shadow-soft` | `.promo-shadow-soft` | `0 4px 20px -6px oklch(0.55 0.15 155 / 0.15)` |
| `shadow-card` | `.promo-shadow-card` | `0 12px 40px -12px oklch(0.35 0.1 155 / 0.18)` |
| `shadow-premium` | `.promo-shadow-premium` | `0 30px 60px -20px oklch(0.35 0.15 155 / 0.35)` |
| `bg-hero-gradient` | `.promo-hero-gradient` | gradiente linear oklch do clone (styles.css:111–118) |
| `bg-whatsapp`, `bg-whatsapp/40` | `.promo-bg-whatsapp`, `.promo-bg-whatsapp-40` | cor `oklch(0.72 0.17 148)` → com/sem alpha |
| `text-balance` | `.promo-text-balance` | `text-wrap: balance` (não existe no Tailwind v3.3) |
| `bg-[oklch(0.18_0.03_155)]` e `.../95` (Header, Footer) | `.promo-bg-brand-dark`, `.promo-bg-brand-dark-95` | verde escuro do topo/rodapé |

- Variantes com hover (`hover:promo-bg-primary-dark`) são cobertas por classes CSS com `:hover` próprio ou por regra `.promo-scope ...:hover`, definidas no `promo.css`.
- **turquoise** e **sand** estão no `@theme` do clone mas **não são usados** no `index.tsx` — ignorados.

### Camada 3 — Fontes self-contained

O clone usa `body { font: Inter }` + `h1–h4 { font: Sora }`. O site aplica **Sora global no `<body>`** via `next/font`. Para não depender disso (e evitar que a wrapper sobrescreva Sora nos headings com Inter):

- Carregar **Sora e Inter** via `next/font/google` no `page.tsx`, expostos como CSS variables (`--promo-font-display`, `--promo-font-sans`).
- No `promo.css`: `.promo-scope { font-family: var(--promo-font-sans) }` e `.promo-scope h1, h2, h3, h4 { font-family: var(--promo-font-display); letter-spacing: -0.02em }`.

## Estrutura de arquivos

```
app/pacotes-promo/
  page.tsx          # 'use client'? — ver nota abaixo. Wrapper .promo-scope + fontes + import promo.css
  promo.css         # tokens escopados (camadas 1 e 2) + fontes (camada 3)
  components/        # (dir já existe, vazio) — seções, ver "Componentização"
  config/            # (dir já existe, vazio) — dados (packages, faqs, etc.), ver abaixo

public/pacotes-promo/
  logo.svg
  hero-bonito.jpg  rio-da-prata.jpg  estancia-mimosa.jpg
  gruta-mimoso.jpg  boia-cross.jpg  estrela-formoso.jpg   # 6 reais (binários no clone)
  pkg2-1.webp  pkg2-2.webp  pkg2-3.jpg  pkg2-4.jpg  pkg2-5.webp  pkg2-6.jpg   # baixadas
  pkg34-1.jpeg  pkg34-2.jpeg                                                   # baixadas
```

### Componentização

O clone tem tudo num arquivo de 920 linhas. Para a página ficar legível e testável, quebrar em componentes por seção dentro de `app/pacotes-promo/components/`, cada um replicando 1:1 o JSX correspondente do clone:

`Header`, `Hero` (+ `Stat`), `WhyUs`, `Packages` (+ `PackageCard`, `PackageCarousel`), `Comparison`, `HowItWorks`, `IncludedSection`, `Differentials`, `Gallery`, `FAQ` (+ `FAQItem`), `FinalCTA`, `Footer`, `WhatsAppFloat`, e o helper `WhatsAppIcon`.

`page.tsx` monta a wrapper `.promo-scope` e ordena as seções exatamente como o clone (`Header` → `main` com Hero…FinalCTA → `Footer` → `WhatsAppFloat`).

Dados estáticos (array `packages`, `faqs`, linhas do `Comparison`, `steps`, listas de `WhyUs`/`Differentials`/`IncludedSection`, constantes `WHATSAPP_NUMBER`/`WHATSAPP_MESSAGE`) ficam em `app/pacotes-promo/config/` — cópia literal do clone.

### Carousel

Reusar `Carousel`, `CarouselContent`, `CarouselItem` de [`components/ui/carousel.tsx`](../../../components/ui/carousel.tsx) (já existe, mesma lógica embla do clone). Os botões prev/next (`CarouselPrevious`/`CarouselNext` do site) puxam o `Button` compartilhado com cores cinza do site — **re-implementar prev/next localmente** dentro de `components/pacotes-promo`, com as cores do promo, preservando o comportamento (posição `left-3`/`right-3`, `opacity-0 group-hover:opacity-100`).

### `'use client'`

`FAQItem` usa `useState` (acordeão). A página inteira, ou pelo menos os componentes com estado/interação, precisam ser Client Components. Decisão de implementação: marcar `page.tsx` como client (`'use client'`) para simplicidade, dado que é uma landing puramente apresentacional — ou isolar só `FAQItem` como client se preferir manter o resto server. **Default recomendado: `page.tsx` client.**

## Imagens

- **6 reais** (`hero-bonito.jpg`, `rio-da-prata.jpg`, `estancia-mimosa.jpg`, `gruta-mimoso.jpg`, `boia-cross.jpg`, `estrela-formoso.jpg`): binários já presentes em `bonito-on-your-dream-trip/src/assets/` — copiar para `public/pacotes-promo/`.
- **8 de pacotes** (`pkg2-1..6`, `pkg34-1..2`): no clone são descritores `.asset.json`, não binários. Baixar dos hosts Lovable montando `<host>/__l5e/assets-v1/<asset_id>/<filename>` a partir do campo `url` de cada `.asset.json`. Hosts a tentar: `https://bonito-dream-weaver.lovable.app` e `https://id-preview--eb71d3e7-2391-4a66-a7e1-a81c766f4301.lovable.app`.
- `logo.svg`: copiar de `bonito-on-your-dream-trip/public/logo.svg`.
- Todas referenciadas via `<img src="/pacotes-promo/...">` (sem `next/image`, como no clone, para comportamento idêntico). Ajustar os caminhos de import do clone (`@/assets/...`) para os paths absolutos em `public/`.

## Conteúdo (cópia literal do clone)

- WhatsApp: `WHATSAPP_NUMBER = "5567991395384"`, mensagem padrão e mensagens por pacote (`buildMsg`) idênticas.
- Redes/links do Footer: Instagram `@agenciabonitoon`, Facebook, e-mail `contato@bonitoon.com.br`, endereço (Rua Coronel Pilad Rebuá, 1997 — Centro, Bonito/MS — CEP 79290-000), Google Maps `share.google/S9y7N8Jmn3QaLboUF`.
- FAQ, comparativo, passos, textos das seções: literais.

### Metadados / SEO

Exportar `metadata` no `page.tsx` (App Router) replicando o `head` do clone ([`__root.tsx`](../../../bonito-on-your-dream-trip/src/routes/__root.tsx):75–101): title "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS", description, OG e Twitter tags. Ajustar `og:image` para um asset servido pelo próprio site (ex.: `/pacotes-promo/logo.svg`) em vez do host Lovable.

## Fora de escopo (YAGNI)

- Não replicar `NotFoundComponent`/`ErrorComponent` do clone (o site já tem tratamento próprio).
- Não integrar com Supabase, admin, nem tornar o conteúdo editável — é página estática.
- Não adicionar link para `/pacotes-promo` na navegação do site (é landing de campanha, acesso por URL direta) — a menos que solicitado depois.
- Não portar `lovable-error-reporting`, TanStack Query, nem o roteador do clone.

## Critérios de sucesso

1. `/pacotes-promo` renderiza todas as seções na ordem do clone, visualmente fiel (cores verdes da marca, sombras, gradiente do hero, fontes Sora/Inter, cards de pacote com carrossel, acordeão de FAQ funcional).
2. Nenhuma cor/estilo do promo vaza para as demais rotas do site (verificar uma página existente antes/depois).
3. `npm run build` e `npm run type-check` passam.
4. As 14 imagens carregam de `public/pacotes-promo/`.
