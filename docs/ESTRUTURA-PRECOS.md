# Estrutura de Preços do Site Bonitoon

## Visão Geral

Os preços vêm da view `atrativo_atividade_precos` no Supabase e são vinculados aos passeios (tours) por correspondência de **atrativo** + **atividade** com o título/slug do tour. Uma linha principal (`mainPriceRow`) é escolhida para exibir em destaque; as demais ficam em "Outros preços".

---

## Fluxo de Dados

```mermaid
flowchart TB
    subgraph Supabase
        View[atrativo_atividade_precos]
        Tours[tours]
    end

    subgraph Services
        getAllPrices[getAllPricesFromView]
        getTours[getAllTours / getTourBySlug]
        findPrices[findPricesForTour]
        getPricesForTours[getPricesForTours]
        pickMain[pickMainPriceRow]
    end

    subgraph UI
        TourCard[tour-card.tsx]
        Sidebar[TourPricesSidebar]
        Page[passeios/[slug]/page.tsx]
    end

    View --> getAllPrices
    getAllPrices --> findPrices
    Tours --> getTours
    getTours --> getPricesForTours
    getPricesForTours --> findPrices
    findPrices --> pickMain
    findPrices --> Tour
    Tour --> TourCard
    Tour --> Sidebar
    Tour --> Page
```

---

## 1. Fonte de Dados

**View Supabase:** `atrativo_atividade_precos`

- Baseada em: `btms_tabelas_preco`, `btms_atrativos`, `btms_atividades`
- Ordenação: `vig_inicio` ascendente

**Campos principais de preço:**

| Campo                          | Uso                                                                    |
| ------------------------------ | ---------------------------------------------------------------------- |
| `atrativo`                     | Local/atrativo (ex: "Abismo Anhumas")                                  |
| `atividade`                    | Tipo de experiência (ex: "Abismo Flutuação", "Mergulho")               |
| `nome_tabela_preco`            | BT = Baixa temporada, MS = Sul-mato-grossense, demais = Alta temporada |
| `vig_inicio`, `vig_fim`        | Vigência                                                               |
| `publico_pax`                  | Preço adulto (público geral)                                           |
| `publico_chd`                  | Preço criança/terceira idade (uso exclusivo na aba Criança)            |
| `publico_crt`                  | Tarifa MS (sul-mato-grossense)                                         |
| `atrativo_pax`, `atrativo_chd` | Fallback para adulto/tarifa MS quando `publico_*` for nulo            |

---

## 2. Serviço de Preços

**[services/supabase-prices.ts](services/supabase-prices.ts)**

### 2.1 Carregamento

- `getAllPricesFromView(client?)` — busca todas as linhas da view
- `getPricesForTours(tours[])` — em lote para a home
- `getPricesByTourSlug(slug, title)` — para a página do passeio

### 2.2 Matching (`matchesTour`)

Uma linha é considerada compatível com o tour se algum slug gerado da linha corresponder ao slug/título do tour:

```
Candidatos: slug(atrativo), slug(atividade), slug("atrativo - atividade"), etc.
Match se: candidato === tourSlug OU tourSlug.includes(candidato) OU tourTitleSlug.includes(candidato)
```

Ex.: Tour `"flutuacao-abismo-anhumas"` combina com linha `atrativo="Abismo Anhumas"` porque `"abismo-anhumas"` está contido no slug do tour.

### 2.3 Escolha da linha principal (`pickMainPriceRow`)

Ordem de prioridade:

1. **Fase Atividade** — linhas onde `atividade` tem boa correspondência com o tour (prioridade à atividade sobre o atrativo)
2. **Fase Atrativo** — fallback quando não há match por atividade; linhas onde `atrativo` corresponde
3. Dentro de cada fase: pontuação por similaridade (`nameSimilarity`), threshold 0.2
4. Desempate: preferir tabelas sem BT/MS (alta temporada), depois menor `adulto`
5. **Fase 3** — sem match: menor preço entre linhas de alta temporada

### 2.4 Conversão para exibição (`toDisplayRow`)

- `adulto` ← `publico_pax ?? atrativo_pax`
- `crianca` ← `publico_chd` (exclusivo; sem fallback para atrativo_chd)
- `tarifaMs` ← `publico_crt ?? atrativo_crt`
- `isNormal` ← tabela sem BT e sem MS

---

## 3. Integração com Tours

**[services/supabase-tours.ts](services/supabase-tours.ts)**

- `getAllTours()` — busca tours, chama `getPricesForTours()`, anexa `prices` a cada tour
- `getTourBySlug()` — busca tour, chama `getPricesByTourSlug()`, anexa `prices`

O tipo `Tour` inclui:

```ts
prices?: {
  rows: TourPriceRowDisplay[]
  precoMinimo: number
  mainPriceRow?: TourPriceRowDisplay
}
```

---

## 4. Exibição na UI

### Cards da home e hero da página

- **Fonte:** `getDisplayPrice(tour)` → `mainPriceRow?.adulto ?? precoMinimo ?? tour.price`
- **Arquivos:** [components/tour-card.tsx](components/tour-card.tsx), [app/passeios/[slug]/page.tsx](app/passeios/[slug]/page.tsx)
- **Helper:** [lib/tour-price-utils.ts](lib/tour-price-utils.ts)

### Sidebar da página do passeio

**[components/tour-prices-sidebar.tsx](components/tour-prices-sidebar.tsx)**

- **Abas:** Adulto | Criança/Terceira Idade
- **Preço principal:** `mainPriceRow.adulto` (aba Adulto) ou `mainPriceRow.crianca` (aba Criança; exclusivamente `publico_chd`)
- **Fallback criança:** Se `mainPriceRow` não tiver `crianca`, usa outra linha da mesma `atividade` com `crianca`, ou a primeira linha com preço de criança
- **Outros preços:** demais linhas compatíveis com filtro por tipo (adulto/criança)

### Labels de tabela

**[lib/table-name-map.ts](lib/table-name-map.ts)**

- BT → "Preço Baixa temporada"
- MS → "Preço para sul-mato-grossense"
- Sem BT/MS → "Preço Alta temporada"

---

## 5. Sincronização

A action `sync-prices` (Admin ou `POST /api/sync-prices`) atualiza `tours.price` com `precoMinimo` e remove preços obsoletos das descrições. Esse valor é usado como fallback quando não há match em `atrativo_atividade_precos`.

---

## 6. Arquivos Principais

| Arquivo | Função |
| --- | --- |
| [lib/supabase/price-columns.ts](lib/supabase/price-columns.ts) | Tipos e mapeamento de colunas |
| [services/supabase-prices.ts](services/supabase-prices.ts) | Lógica de fetch, matching e seleção da linha principal |
| [services/supabase-tours.ts](services/supabase-tours.ts) | Integração tours + preços |
| [lib/table-name-map.ts](lib/table-name-map.ts) | Labels amigáveis das tabelas |
| [lib/tour-price-utils.ts](lib/tour-price-utils.ts) | Helper `getDisplayPrice()` |
| [lib/utils.ts](lib/utils.ts) | `createSlug()` para normalização de strings |
| [components/tour-prices-sidebar.tsx](components/tour-prices-sidebar.tsx) | Exibição detalhada (Adulto/Criança) |
| [components/tour-card.tsx](components/tour-card.tsx) | Preço resumido nos cards |

---

## 7. Modelo S1/S2 (Novo)

- Fontes independentes por semestre:
  - `btms_prices_1o_semestre` + `atrativo_atividade_precos_s1`
  - `btms_prices_2o_semestre` + `atrativo_atividade_precos_s2`
- O resolver escolhe fonte por semestre com fallback em cadeia:
  - S1: `btms_prices_1o_semestre` -> `atrativo_atividade_precos_s1` -> `atrativo_atividade_precos`
  - S2: `btms_prices_2o_semestre` -> `atrativo_atividade_precos_s2` -> `atrativo_atividade_precos`
- Data de corte configuravel: `admin_settings.key = semester_split`.
- Prioridade de exibicao:
  - S1: `manual_price` -> override `s1:alta:adulto` -> preferred -> BTMS -> `price`
  - S2: `manual_price_2o_semester` -> override `s2:alta:adulto` -> preferred -> BTMS -> `price_2o_semester`

## 8. Governanca de Sync

- Cada execucao registra trilha em `price_sync_runs`.
- `sync-prices` agora:
  1. valida usuario admin;
  2. cria run `running`;
  3. tenta `refresh_btms_semester_tables(split_date)`;
  4. sincroniza S1 e S2 sem sobrescrever campos manuais;
  5. conclui run como `valid` ou `error`.
- API `/api/sync-prices` tambem exige admin autenticado.
