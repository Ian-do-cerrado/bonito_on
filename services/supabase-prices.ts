/**
 * Serviço de preços de passeios.
 * Fonte única de preços: view `atrativo_atividade_precos`.
 * getAllPricesFromView → findPricesForTour → pickMainPriceRow → TourPriceInfo.
 */
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { createSlug } from "@/lib/utils"
import { getFriendlyTableName } from "@/lib/table-name-map"
import {
  isBaixaTemporadaTable,
  preferSecondSemesterAltaRow,
} from "@/lib/price-season-utils"
import { simplifyActivityName } from "@/lib/activity-name-simplifier"
import type {
  AtrativoAtividadePrecoRow,
  TourPriceInfo,
  TourPriceRowDisplay,
} from "@/lib/supabase/price-columns"
import { isExtraRowEntry, parseExtraRow } from "@/lib/price-table-extra-rows"
import { isManualOverride } from "@/lib/price-overrides"

/** Pontuação de similaridade entre título do tour e nome da atividade (0-1) */
function nameSimilarity(tourTitle: string, atividade: string): number {
  const t = createSlug(tourTitle)
  const a = createSlug(atividade)
  if (!a) return 0
  const tourWords = t.split("-").filter((w) => w.length >= 2)
  const activityWords = a.split("-").filter((w) => w.length >= 2 && !/^\d+$/.test(w))
  if (activityWords.length === 0) return 0
  let matches = 0
  for (const aw of activityWords) {
    if (tourWords.some((tw) => tw.includes(aw) || aw.includes(tw))) matches++
  }
  let score = matches / activityWords.length
  const primaryWord = tourWords[0]
  if (primaryWord && a.includes(primaryWord)) score += 0.15
  return Math.min(1, score)
}

const supabase = createClient()
import { DEFAULT_SEMESTER_SPLIT_DATE } from "@/lib/semester-config"
const DEFAULT_SEMESTER_SPLIT = DEFAULT_SEMESTER_SPLIT_DATE
/** View completa do BTMS — fonte canônica para catálogo e picker do admin. */
const CANONICAL_PRICE_SOURCE = "atrativo_atividade_precos"

function getSemesterSourceCandidates(preferNextSemester?: boolean): string[] {
  if (preferNextSemester) {
    return ["btms_prices_2o_semestre", "atrativo_atividade_precos_s2", CANONICAL_PRICE_SOURCE]
  }
  return ["btms_prices_1o_semestre", "atrativo_atividade_precos_s1", CANONICAL_PRICE_SOURCE]
}

function sortDisplayRowsBySemester(
  displayRows: TourPriceRowDisplay[],
  preferNextSemester?: boolean
): void {
  if (preferNextSemester) {
    displayRows.sort((a, b) => {
      const aIsSecondSem = isOnOrAfter(a.vigInicio, DEFAULT_SEMESTER_SPLIT)
      const bIsSecondSem = isOnOrAfter(b.vigInicio, DEFAULT_SEMESTER_SPLIT)
      if (aIsSecondSem && !bIsSecondSem) return -1
      if (!aIsSecondSem && bIsSecondSem) return 1
      return 0
    })
  } else {
    displayRows.sort((a, b) => {
      const aIsFirstSem = !!a.vigInicio && !isOnOrAfter(a.vigInicio, DEFAULT_SEMESTER_SPLIT)
      const bIsFirstSem = !!b.vigInicio && !isOnOrAfter(b.vigInicio, DEFAULT_SEMESTER_SPLIT)
      if (aIsFirstSem && !bIsFirstSem) return -1
      if (!aIsFirstSem && bIsFirstSem) return 1
      return 0
    })
  }
}

function dedupePriceRows(rows: AtrativoAtividadePrecoRow[]): AtrativoAtividadePrecoRow[] {
  const seen = new Set<string>()
  const out: AtrativoAtividadePrecoRow[] = []
  for (const row of rows) {
    const key = [
      row.atrativo ?? "",
      row.atividade ?? "",
      row.nome_tabela_preco ?? "",
      row.vig_inicio ?? "",
    ].join("|")
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
  }
  return out
}

async function queryAllPriceRowsFromSource(
  db: SupabaseClient,
  source: string
): Promise<AtrativoAtividadePrecoRow[] | null> {
  const { data, error } = await db
    .from(source)
    .select("*")
    .order("vig_inicio", { ascending: true })
  if (error || !data?.length) return null
  return data as AtrativoAtividadePrecoRow[]
}

async function queryPriceRowsForAtrativoFromSource(
  db: SupabaseClient,
  source: string,
  atrativo: string
): Promise<AtrativoAtividadePrecoRow[] | null> {
  const { data, error } = await db
    .from(source)
    .select("*")
    .ilike("atrativo", `%${atrativo}%`)
    .order("vig_inicio", { ascending: true })
  if (error || !data?.length) return null
  return data as AtrativoAtividadePrecoRow[]
}

function isOnOrAfter(date: string | null | undefined, split: string): boolean {
  if (!date) return false
  return date >= split
}

/** Parse value that may come as string from DB (Supabase/JSON) */
function parsePrice(val: unknown): number | null {
  if (val == null) return null
  if (typeof val === "number" && !Number.isNaN(val)) return val
  if (typeof val === "string") {
    const n = parseFloat(val.replace(",", "."))
    return Number.isNaN(n) ? null : n
  }
  return null
}

/** Get raw price from row: prefer publico_*, fallback to atrativo_* */
function getPrice(
  row: AtrativoAtividadePrecoRow,
  type: "pax" | "chd" | "chd_free" | "crt" | "garupa_pax" | "garupa_chd"
): number | null {
  if (type === "pax") {
    return parsePrice(row.publico_pax) ?? parsePrice(row.atrativo_pax) ?? null
  }
  /** Criança/Terceira Idade: coluna publico_chd (uso exclusivo; sem fallback para atrativo_chd) */
  if (type === "chd") {
    return parsePrice(row.publico_chd) ?? null
  }
  if (type === "chd_free") {
    const val = parsePrice(row.publico_chd_free) ?? parsePrice(row.atrativo_chd_free)
    return val === 0 ? 0 : val
  }
  if (type === "garupa_pax") {
    return parsePrice(row.publico_garupa_pax) ?? null
  }
  if (type === "garupa_chd") {
    return parsePrice(row.publico_garupa_chd) ?? null
  }
  return parsePrice(row.publico_crt) ?? parsePrice(row.atrativo_crt) ?? null
}

/**
 * Check if table is "normal" (general tourist price).
 * Excludes: Bonitense/Bodoquenense (local resident), Sul-Mato-Grossense/MS (state resident),
 *           Grupo/GP (group pricing), Operadora (tour operator).
 * NOTE: "BT" = Baixa Temporada (low season) — this IS a valid tourist price table.
 *       "AT" = Alta Temporada (high season) — also valid.
 */
function isNormalTable(nomeTabelaPreco: string | null): boolean {
  const raw = (nomeTabelaPreco ?? "").toUpperCase()
  // Resident/local pricing = never "normal" for tourists
  if (raw.includes("BONITENSE") || raw.includes("BODOQUENENSE")) return false
  if (raw.includes("SUL-MATO") || raw.includes("SUL MATO")) return false
  // "MS" as standalone word = Sul-Mato-Grossense resident pricing
  // But "BT MS" or "AT MS" combinations are handled by isSulMatoGrossense separately
  if (/\bMS\b/.test(raw)) return false
  // Operator/group tables = not standard tourist pricing
  if (raw.includes("OPERADORA") || raw.includes("ACORDO")) return false
  if (/\bGP\b/.test(raw) || raw.includes("GRUPO")) return false
  return true
}

/** Tabela Bonitense = preço local, NUNCA deve ser preço principal */
function isBonitense(row: { nomeTabela: string }): boolean {
  return (row.nomeTabela ?? "").toUpperCase().includes("BONITENSE")
}

/** Tabela sul-mato-grossense/MS = preço residente, NUNCA preço principal para turistas */
function isSulMatoGrossense(row: { nomeTabela: string }): boolean {
  const t = (row.nomeTabela ?? "").toUpperCase()
  return t.includes("MS") || t.includes("SUL-MATO") || t.includes("SUL MATO")
}

/** Tabela GP/GRUPO = preço por grupo, NUNCA como principal (confunde cliente - preço individual) */
function isTabelaGrupo(row: { nomeTabela: string }): boolean {
  const t = (row.nomeTabela ?? "").toUpperCase()
  return t.includes("GP") || t.includes("GRUPO")
}

/** Tabela Tab com período (ex: Tab (15) JAN-2026/DEZ-2026) = preço individual preferido */
function isTabelaTabIndividual(row: { nomeTabela: string }): boolean {
  const t = (row.nomeTabela ?? "").toUpperCase()
  return t.includes("TAB") && (/\d{4}/.test(t) || t.includes("JAN") || t.includes("DEZ"))
}

/** Convert raw row to display row */
function toDisplayRow(
  row: AtrativoAtividadePrecoRow,
  tourSlug?: string,
  tourTitle?: string
): TourPriceRowDisplay {
  const adulto = getPrice(row, "pax")
  const crianca = getPrice(row, "chd")
  const criancaFree = getPrice(row, "chd_free")
  const tarifaMs = getPrice(row, "crt")
  const garupaAdulto = getPrice(row, "garupa_pax")
  const garupaCrianca = getPrice(row, "garupa_chd")
  const nomeTabelaRaw = row.nome_tabela_preco ?? ""
  const atrativo = row.atrativo ?? ""
  const atividade = row.atividade ?? row.atrativo ?? ""
  const temporada = row.temporada ?? null

  // Label legível: "Atrativo – Atividade"
  const atividadeSimples = simplifyActivityName(atividade, tourTitle)
  const atrativoTrimmed = atrativo.trim()
  const atividadeTrimmed = atividade.trim()
  const atividadeLabel =
    atrativoTrimmed &&
    atividadeTrimmed &&
    atrativoTrimmed.toLowerCase() !== atividadeTrimmed.toLowerCase()
      ? `${atrativoTrimmed} \u2013 ${atividadeSimples}`
      : atividadeSimples || atrativoTrimmed

  return {
    vigInicio: row.vig_inicio ?? "",
    vigFim: row.vig_fim ?? "",
    nomeTabela: nomeTabelaRaw,
    temporada,
    atrativo,
    atividade,
    atividadeAmigavel: atividadeSimples,
    atividadeLabel,
    nomeTabelaAmigavel:
      tourSlug === "bio-park" ||
      tourSlug?.includes("bio-park") ||
      tourSlug?.includes("sao-miguel") ||
      tourSlug?.includes("nascente-azul-combo-adventure") ||
      tourSlug?.includes("parque-das-cachoeiras")
        ? nomeTabelaRaw
        : getFriendlyTableName(nomeTabelaRaw, row.temporada),
    // isNormal means "Standard Tourist Price" (not Resident/Group/Combo)
    isNormal: isNormalTable(nomeTabelaRaw),
    adulto,
    crianca,
    criancaFree: criancaFree ?? undefined,
    tarifaMs,
    garupaAdulto: garupaAdulto ?? undefined,
    garupaCrianca: garupaCrianca ?? undefined,
  }
}

/** Get all prices from the view (single query). Optional client for server-side use. */
export async function getAllPricesFromView(
  client?: SupabaseClient,
  preferNextSemester?: boolean
): Promise<AtrativoAtividadePrecoRow[]> {
  const db = client ?? supabase
  try {
    const canonical = await queryAllPriceRowsFromSource(db, CANONICAL_PRICE_SOURCE)
    if (canonical) return canonical

    for (const source of getSemesterSourceCandidates(preferNextSemester)) {
      if (source === CANONICAL_PRICE_SOURCE) continue
      const rows = await queryAllPriceRowsFromSource(db, source)
      if (rows) return rows
    }
    return []
  } catch (err) {
    console.error("Error in getAllPricesFromView:", err)
    return []
  }
}

/**
 * Retorna TODAS as linhas da view para um atrativo específico, convertidas para TourPriceRowDisplay.
 * Sem filtros de matchesTour — usado no painel admin para selecionar qualquer valor do atrativo.
 */
export async function getAllDisplayRowsForAtrativo(
  atrativo: string,
  client?: SupabaseClient,
  preferNextSemester?: boolean
): Promise<TourPriceRowDisplay[]> {
  const db = client ?? supabase
  const needle = atrativo.trim()
  if (!needle) return []

  try {
    let rawRows =
      (await queryPriceRowsForAtrativoFromSource(db, CANONICAL_PRICE_SOURCE, needle)) ?? []

    if (rawRows.length === 0) {
      for (const source of getSemesterSourceCandidates(preferNextSemester)) {
        if (source === CANONICAL_PRICE_SOURCE) continue
        const rows = await queryPriceRowsForAtrativoFromSource(db, source, needle)
        if (rows) {
          rawRows = rows
          break
        }
      }
    }

    const displayRows = dedupePriceRows(rawRows).map((row) => toDisplayRow(row))
    sortDisplayRowsBySemester(displayRows, preferNextSemester)
    return displayRows
  } catch (err) {
    console.error("Error in getAllDisplayRowsForAtrativo:", err)
    return []
  }
}

/**
 * Verifica se a linha de preço corresponde ao tour.
 * Regra geral: exige AMBOS atrativo E atividade para evitar preços de outros passeios.
 * Exceção: quando o atrativo tem match FORTE (ex.: tour "Balneário Municipal" = atrativo "Balneário Municipal"),
 * inclui todas as atividades desse atrativo (Balneário + Churrasqueira) para exibir na tabela "Outros preços".
 * pickMainPriceRow priorizará a atividade que melhor corresponde ao tour (Balneário > Churrasqueira).
 */
function matchesTour(
  row: AtrativoAtividadePrecoRow,
  tourSlug: string,
  tourTitleSlug: string
): boolean {
  const atividade = row.atividade ?? row.atrativo ?? ""
  const atrativo = row.atrativo ?? ""
  const ativSlug = atividade ? createSlug(atividade) : ""
  const atrSlug = atrativo ? createSlug(atrativo) : ""
  const tourForSimilarity = tourTitleSlug.replace(/-/g, " ")

  const ativSlugInTour =
    ativSlug &&
    (tourSlug.includes(ativSlug) || tourTitleSlug.includes(ativSlug) || ativSlug.includes(tourSlug))
  const atrSlugInTour =
    atrSlug &&
    (tourSlug.includes(atrSlug) || tourTitleSlug.includes(atrSlug) || atrSlug.includes(tourSlug))
  const ativSimilarity = atividade ? nameSimilarity(tourForSimilarity, atividade) : 0
  const atrSimilarity = atrativo ? nameSimilarity(tourForSimilarity, atrativo) : 0

  const atrativoMatch = atrSlugInTour || atrSimilarity >= 0.25
  const atividadeMatch = ativSlugInTour || ativSimilarity >= 0.25

  if (!atrativo.trim() && !atividade.trim()) return false

  // Rota Aventura: APENAS atrativo "Rota Aventura"
  if (tourSlug === "rota-aventura" || tourSlug.endsWith("-rota-aventura")) {
    if (atrSlug !== "rota-aventura") return false
  }

  // Refúgio da Barra: APENAS atrativo "Refugio da Barra"
  if (tourSlug === "refugio-da-barra" || tourSlug.endsWith("-refugio-da-barra")) {
    if (atrSlug !== "refugio-da-barra") return false
  }

  // Pantanal Experiência: APENAS atrativo "Pantanal Experiência"
  if (tourSlug === "pantanal-experiencia" || tourSlug.endsWith("-pantanal-experiencia")) {
    if (atrSlug !== "pantanal-experiencia") return false
  }

  // Quadriciclo Serra Da Bodoquena: APENAS atrativo "Cachoeiras S. Bodoquena"
  if (tourSlug === "quadriciclo-serra-da-bodoquena") {
    if (atrSlug !== "cachoeiras-s-bodoquena") return false
  }

  // Quadriciclo Trilha Boiadeira: APENAS atrativo "Trilha Boiadeira"
  if (tourSlug === "quadriciclo-trilha-boiadeira") {
    if (atrSlug !== "trilha-boiadeira") return false
  }

  // Praia da Figueira (qualquer variante): APENAS atrativo "Praia da Figueira"
  if (tourSlug === "praia-da-figueira" || tourSlug.includes("praia-da-figueira")) {
    if (atrSlug !== "praia-da-figueira") return false
  }

  // Gruta do Lago Azul (qualquer variante): APENAS atrativo "Gruta do Lago Azul"
  if (tourSlug === "gruta-do-lago-azul" || tourSlug.includes("gruta-do-lago-azul")) {
    if (atrSlug !== "gruta-do-lago-azul") return false
  }

  // Balneário do Sol: APENAS atrativo "Balneário do Sol"
  if (tourSlug === "balneario-do-sol" || tourSlug.includes("balneario-do-sol")) {
    if (atrSlug !== "balneario-do-sol") return false
  }

  // Fazenda San Francisco: APENAS atrativo "Fazenda San Francisco"
  if (tourSlug === "fazenda-san-francisco") {
    if (atrSlug !== "fazenda-san-francisco") return false
  }

  // Projeto Salobra: APENAS atrativo "Projeto Salobra" (PROJETO SALOBRA)
  if (tourSlug === "projeto-salobra" || tourSlug.includes("projeto-salobra")) {
    if (atrSlug !== "projeto-salobra") return false
  }

  // Cânions do Salobra: APENAS atrativo "Canions do Salobra" (CANIONS DO SALOBRA)
  if (tourSlug === "canions-do-salobra" || tourSlug.includes("canions-do-salobra")) {
    if (atrSlug !== "canions-do-salobra") return false
  }

  // Cavalgada - Estância Mimosa: APENAS atrativo "Estância Mimosa"
  if (tourSlug.includes("estancia-mimosa")) {
    if (atrSlug !== "estancia-mimosa") return false
  }

  // Quadriciclo + Balneário No Estrela Do Formoso: APENAS atrativo "Estrela do Formoso"
  if (tourSlug.includes("estrela-do-formoso")) {
    if (atrSlug !== "estrela-do-formoso") return false
  }

  // Rio da Prata (passeio genérico): APENAS atrativo "Rio da Prata"
  if (tourSlug === "rio-da-prata") {
    if (atrSlug !== "rio-da-prata") return false
  }

  // Mergulho Com Cilindro No Rio Da Prata: APENAS atrativo "Rio da Prata"
  if (tourSlug.includes("mergulho") && tourSlug.includes("rio-da-prata")) {
    if (atrSlug !== "rio-da-prata") return false
  }

  // Nascente Azul (qualquer variante): APENAS atrativo "Nascente Azul"
  if (tourSlug === "nascente-azul" || tourSlug.includes("nascente-azul")) {
    if (atrSlug !== "nascente-azul") return false
  }

  // Bosque das Águas: APENAS atrativo "Bosque das Águas"
  if (tourSlug === "bosque-das-aguas" || tourSlug.includes("bosque-das-aguas")) {
    if (atrSlug !== "bosque-das-aguas") return false
  }

  // Bio Park: APENAS atrativo "Bio Park"
  if (tourSlug === "bio-park" || tourSlug.includes("bio-park")) {
    if (atrSlug !== "bio-park") return false
  }

  // Gruta De São Miguel: APENAS atrativo "Gruta Catedral" ou "Museu"
  if (tourSlug.includes("sao-miguel")) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    // Accept "Catedral" or "Museu"
    if (!atrNorm.includes("CATEDRAL") && !atrNorm.includes("MUSEU")) return false
  }

  // Barra Do Sucuri: APENAS atrativo "Barra Do Sucuri"
  if (tourSlug === "barra-do-sucuri" || tourSlug.includes("barra-do-sucuri")) {
    if (atrSlug !== "barra-do-sucuri") return false
  }

  // Cavalgada Recanto do Peão: APENAS atrativo "Cavalgada do Peão"
  if (tourSlug.includes("cavalgada-recanto-do-peao")) {
    if (atrSlug !== "cavalgada-do-peao" && !atrSlug.includes("peao")) return false
  }

  // Cachoeiras Rio Do Peixe: APENAS atrativo "Rio do Peixe"
  if (tourSlug.includes("cachoeiras-rio-do-peixe") || tourSlug === "rio-do-peixe") {
    if (atrSlug !== "rio-do-peixe" && !atrSlug.includes("rio-do-peixe")) return false
  }

  // Lagoa Misteriosa: APENAS atrativo "Rio da Prata" (ou que contenha rio da prata)
  if (tourSlug.includes("lagoa-misteriosa")) {
    if (!atrSlug.includes("rio-da-prata")) return false
  }

  // Gruta do Mimoso (qualquer variante): APENAS atrativo "Gruta do Mimoso"
  if (tourSlug === "gruta-do-mimoso" || tourSlug.includes("gruta-do-mimoso")) {
    if (!atrSlug.includes("gruta-do-mimoso")) return false
  }

  // Gruta da Catedral: APENAS atrativo "Gruta Catedral/Museu" + excluir uso interno
  if (tourSlug.includes("gruta-da-catedral")) {
    if (!atrSlug.includes("gruta-catedral") && !atrSlug.includes("gruta-catedral-museu")) return false
    // "Acordo tarifa" e "Operadora" = uso interno/B2B, não exibir ao público
    const tabelaUp = (row.nome_tabela_preco ?? "").toUpperCase()
    if (tabelaUp.includes("ACORDO") || tabelaUp.includes("OPERADORA")) return false
  }

  // Formoso Adventure: APENAS atrativo "P.E. Rio Formoso" + atividade "Formoso Adventure"
  if (tourSlug.includes("formoso-adventure")) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (!atrNorm.includes("RIO FORMOSO") && !atrNorm.includes("P.E.")) return false
    const ativUpper = (atividade ?? "").toUpperCase()
    if (!ativUpper.includes("FORMOSO ADVENTURE")) return false
  }

  // Eco Serrana: APENAS atrativo "ECO SERRANA PARK"
  if (tourSlug.includes("eco-serrana")) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (!atrNorm.includes("ECO SERRANA")) return false
    // Com Almoço: exige atividade receptivo/almoco
    if (tourSlug.includes("com-almoco")) {
      const ativUpper = (atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      if (!ativUpper.includes("ALMOCO") && !ativUpper.includes("RECEPTIVO")) return false
    }
  }

  // Fazenda Ceita Core: APENAS atrativo "Ceita Core"
  if (tourSlug.includes("ceita-core")) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (!atrNorm.includes("CEITA CORE")) return false
  }

  // Parque das Cachoeiras: APENAS atrativo "Parque das Cachoeiras"
  if (tourSlug.includes("parque-das-cachoeiras")) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (!atrNorm.includes("PARQUE DAS CACHOEIRAS")) return false
  }

  // Bike Boat Eco Park Porto Da Ilha: APENAS atrativo "Porto da Ilha"
  if (tourSlug.includes("bike-boat") && tourSlug.includes("porto-da-ilha")) {
    if (!atrSlug.includes("porto-da-ilha")) return false
  }

  // Cachoeiras Serra da Bodoquena: APENAS atrativo "Cachoeiras S. Bodoquena"
  if (tourSlug.includes("cachoeiras-serra-da-bodoquena")) {
    if (!atrSlug.includes("bodoquena")) return false
    
    // Se for o com almoço, exija ALMOÇO na atividade
    if (tourSlug.includes("com-almoco")) {
      const ativUpper = (atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      if (!ativUpper.includes("ALMOCO")) return false
    }
  }

  // Boca Da Onça - Trilha Adventure: APENAS atrativo "Boca da Onça"
  if (tourSlug.includes("boca-da-onca") || tourSlug.includes("trilha-adventure")) {
    if (atrSlug !== "boca-da-onca") return false

    // Buraco do Macaco: restringir à atividade COMBO MEIA TRILHA BURACO DO MACACO
    if (tourSlug.includes("buraco-do-macaco")) {
      const ativUpper = (atividade ?? "").toUpperCase()
      if (!ativUpper.includes("BURACO DO MACACO")) return false
    }
  }

  // Abismo Anhumas (Mergulho e Flutuação): APENAS atrativo "Abismo Anhumas"
  // Cobrir "abismo-anhumas", "abismo-flutuacao", "mergulho-com-cilindro-abismo-anhumas", etc.
  if (
    tourSlug.includes("abismo-anhumas") ||
    (tourSlug.includes("abismo") && (tourSlug.includes("flutuacao") || tourSlug.includes("mergulho")))
  ) {
    if (atrSlug !== "abismo-anhumas") return false
  }

  // Cavalgada - Rio Da Prata: APENAS atrativo "Rio da Prata" + atividade cavalo
  if (tourSlug.includes("cavalgada") && tourSlug.includes("rio-da-prata")) {
    if (atrSlug !== "rio-da-prata") return false
  }

  // Parque Ecológico - Boia Cross: APENAS atrativo "P.E. Rio Formoso"
  const isParqueEcologicoBoiaCross =
    tourSlug === "parque-ecologico-boia-cross" ||
    (tourSlug.includes("parque-ecologico") && tourSlug.includes("boia-cross"))
  if (isParqueEcologicoBoiaCross) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const isPeRioFormoso =
      (atrNorm.includes("RIO") && atrNorm.includes("FORMOSO")) ||
      atrNorm.includes("P.E. RIO FORMOSO") ||
      (atrNorm.includes("PARQUE") && atrNorm.includes("ECOLOGICO") && atrNorm.includes("RIO") && atrNorm.includes("FORMOSO"))
    if (!isPeRioFormoso) return false
  }

  // Porto da Ilha (Bote, Stand Up, Passaporte, Boia, Bike): APENAS atrativo "Porto da Ilha" + atividades relacionadas
  if (tourSlug.includes("porto-da-ilha")) {
    const atrNorm = (atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (!atrNorm.includes("PORTO DA ILHA") && atrSlug !== "porto-da-ilha") return false
    
    const ativUpper = (atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const relacionada =
      ativUpper.includes("BOTE") ||
      ativUpper.includes("BIKE") ||
      ativUpper.includes("COMBO") ||
      ativUpper.includes("PORTO") ||
      ativUpper.includes("ILHA") ||
      ativUpper.includes("STAND") ||
      ativUpper.includes("PADDLE") ||
      ativUpper.includes("SUP") ||
      ativUpper.includes("PASSAPORTE") ||
      ativUpper.includes("BOIA") ||
      ativUpper.includes("BARCO") ||
      ativUpper.includes("ELETRICO") ||
      ativUpper.includes("ELÉTRICO")
    if (!relacionada) return false
  }

  // Atrativos com tours separados (Mergulho vs Flutuação) - NÃO usar strong match
  const ATRATIVOS_MULTI_TOUR = ["abismo-anhumas", "rio-da-prata"]
  const ehMultiTour = ATRATIVOS_MULTI_TOUR.some((a) => tourSlug.includes(a))

  // Match forte: slug exato OU tour termina com atrativo (ex: "quadriciclo-rotta-zagaia" → atrativo "Rotta Zagaia")
  const strongAtrativoMatch =
    !ehMultiTour &&
    atrSlug &&
    (tourSlug === atrSlug || (atrSlug.length >= 6 && tourSlug.endsWith("-" + atrSlug)))

  if (atrativo.trim() && atividade.trim()) {
    // Quando atrativo tem match forte, inclui a linha mesmo se atividade não corresponder
    // (ex: Balneário Municipal inclui Churrasqueira para exibir em "Outros preços")
    if (strongAtrativoMatch) return true
    return atrativoMatch && atividadeMatch
  }

  return atrativoMatch || atividadeMatch
}

const SIMILARITY_THRESHOLD = 0.2

/** Atividades consideradas add-ons: não devem ser preço principal se o tour não as menciona */
const ADDON_ATIVIDADES = ["churrasqueira", "almoço", "lanche", "café da manhã"]

function isAddonAtividade(atividade: string, tourSlug: string): boolean {
  const slug = createSlug(atividade)
  if (!slug) return false
  if (!ADDON_ATIVIDADES.some((a) => slug.includes(a) || a.includes(slug))) return false
  return !tourSlug.includes(slug)
}

/** Escolhe melhor linha por similaridade; desempate: isNormal, depois menor preço */
function pickBestFromScored(
  scored: { row: TourPriceRowDisplay; score: number }[],
  threshold: number
): TourPriceRowDisplay | null {
  const above = scored.filter((s) => s.score >= threshold)
  if (above.length === 0) return null
  return above.reduce((a, b) => {
    if (a.score > b.score) return a
    if (a.score < b.score) return b
    return a.row.isNormal && !b.row.isNormal
      ? a
      : !a.row.isNormal && b.row.isNormal
        ? b
        : (a.row.adulto ?? Infinity) <= (b.row.adulto ?? Infinity)
          ? a
          : b
  }).row
}

/**
 * Encontra a linha de preço principal.
 * Prioridade: 1) correspondência por ATIVIDADE (database)  2) fallback por ATRATIVO (database)  3) menor alta temporada
 */
/** Day-Use tabela BT26/BT 2026 = preço principal preferido (não Bonitense) */
function isDayUseBt26(row: TourPriceRowDisplay): boolean {
  const ativ = (row.atividade ?? "").toUpperCase().replace(/-/g, " ")
  const tabela = (row.nomeTabela ?? "").toUpperCase()
  const atividadeDayUse = ativ.includes("DAY") && ativ.includes("USE")
  const tabelaBt =
    tabela.includes("BT") &&
    (tabela.includes("2026") || tabela.includes("BT26") || tabela.includes("BT 26"))
  return atividadeDayUse && tabelaBt
}

function pickMainPriceRow(
  displayRows: TourPriceRowDisplay[],
  tourTitle: string,
  tourSlug: string,
  selectedSeason?: "ALTA" | "BAIXA" | null
): TourPriceRowDisplay | null {
  const withPrice = displayRows.filter(
    (r) =>
      (r.adulto != null && r.adulto > 0) ||
      (r.garupaAdulto != null && r.garupaAdulto > 0)
  )
  // Bonitense, sul-mato-grossense e GP (grupo) = NUNCA como principal para turistas
  const semLocais = withPrice.filter(
    (r) => !isBonitense(r) && !isSulMatoGrossense(r) && !isTabelaGrupo(r)
  )
  let pool = semLocais.length > 0 ? semLocais : withPrice

  // Se uma temporada específica foi solicitada, filtra o pool para priorizá-la
  if (selectedSeason) {
    const s = selectedSeason.toUpperCase()
    const seasonMatches = pool.filter((r) => (r.temporada ?? "").toUpperCase() === s)
    if (seasonMatches.length > 0) {
      pool = seasonMatches
    }
  }

  if (pool.length === 0) return null

  // Abismo Anhumas: escolher PRIMEIRO por atividade (Mergulho vs Flutuação) para não ser sobrescrito por Tab/Day-Use
  // Cobrir "abismo-anhumas", "abismo-flutuacao", "mergulho-com-cilindro-abismo-anhumas"
  const ehAbismoAnhumas =
    tourSlug.includes("abismo-anhumas") ||
    (tourSlug.includes("abismo") && (tourSlug.includes("flutuacao") || tourSlug.includes("mergulho")))
  if (ehAbismoAnhumas) {
    if (tourSlug.includes("mergulho")) {
      const mergulho = pool.find((r) => {
        const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return ativ.includes("MERGULHO")
      })
      if (mergulho) return mergulho
    }
    if (tourSlug.includes("flutuacao")) {
      const flutuacao = pool.find((r) => {
        const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return ativ.includes("FLUTUACAO")
      })
      if (flutuacao) return flutuacao
    }
  }

  // Parque Ecológico - Boia Cross: preço principal = Bóia Cross + Alta temporada (R$ 198 adulto), não sul-mato-grossense
  if (
    tourSlug === "parque-ecologico-boia-cross" ||
    (tourSlug.includes("parque-ecologico") && tourSlug.includes("boia-cross"))
  ) {
    const boiaCrossAlta = pool.filter((r) => {
      const ativ = (r.atividade ?? "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      const isBoiaCross = (ativ.includes("BOIA") || ativ.includes("BOYA")) && ativ.includes("CROSS")
      return isBoiaCross && r.isNormal
    })
    if (boiaCrossAlta.length > 0) {
      return boiaCrossAlta.reduce((a, b) =>
        (a.adulto ?? Infinity) <= (b.adulto ?? Infinity) ? a : b
      )
    }
    const boiaCross = pool.find((r) => {
      const ativ = (r.atividade ?? "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      return (ativ.includes("BOIA") || ativ.includes("BOYA")) && ativ.includes("CROSS")
    })
    if (boiaCross) return boiaCross
  }

  // Preferências globais (Day-Use e Tabela Tab) foram movidas para depois das regras específicas


  // Balneário Municipal: atividade Day-Use da tabela BT 2026
  if (tourSlug === "balneario-municipal") {
    const dayUseBt = pool.find((r) => isDayUseBt26(r))
    if (dayUseBt) return dayUseBt
  }

  // Balneário do Sol: preço principal = atividade Day-Use
  if (tourSlug === "balneario-do-sol" || tourSlug.includes("balneario-do-sol")) {
    const dayUse = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      return ativ.includes("DAY USE") || ativ.includes("DAY U")
    })
    if (dayUse) return dayUse
  }

  // Stand Up Paddle Eco Park Porto Da Ilha: atrativo Porto da Ilha, principal = atividade stand-up
  if (tourSlug.includes("stand-up-paddle") || tourSlug.includes("stand-up-paddle-eco-park")) {
    const standUp = pool.find(
      (r) =>
        (r.atividade ?? "").toUpperCase().includes("STAND") &&
        ((r.atividade ?? "").toUpperCase().includes("UP") || (r.atividade ?? "").toUpperCase().includes("PADDLE") || (r.atividade ?? "").toUpperCase().includes("SUP"))
    )
    if (standUp) return standUp
  }

  // Eco Park Porto Da Ilha (Passeio Genérico): Atração Porto da Ilha, principal = COMBO BOTE ou PASSEIO DE BOTE
  if (tourSlug === "eco-park-porto-da-ilha" || tourSlug === "porto-da-ilha") {
    const portoPool = pool.filter(r => createSlug(r.atrativo).includes("porto-da-ilha"))
    const finalPool = portoPool.length > 0 ? portoPool : pool
    
    const bote = finalPool.find(r => {
      const ativ = (r.atividade ?? "").toUpperCase()
      return (ativ.includes("COMBO") || ativ.includes("PASSEIO")) && ativ.includes("BOTE")
    })
    if (bote) return bote
  }

  // Boia Cross Eco Park Porto Da Ilha: preço principal = atividade "Passeio de Boia"
  if (tourSlug.includes("boia-cross") && tourSlug.includes("porto-da-ilha")) {
    const passeioBoia = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return ativ.includes("PASSEIO") && (ativ.includes("BOIA") || ativ.includes("BOYA"))
    })
    if (passeioBoia) return passeioBoia
  }

  // Passaporte Eco Park Porto Da Ilha: preço principal = atividade "Passaporte"
  if (tourSlug.includes("passaporte") && tourSlug.includes("porto-da-ilha")) {
    const passaporte = pool.find((r) =>
      (r.atividade ?? "").toUpperCase().includes("PASSAPORTE")
    )
    if (passaporte) return passaporte
  }

  // Passeio De Bote No Porto Da Ilha: preços da atividade Porto da Ilha, principal = COMBO BOTE
  if (tourSlug === "passeio-de-bote-no-porto-da-ilha") {
    const comboBote = pool.find(
      (r) => (r.atividade ?? "").toUpperCase().includes("COMBO") && (r.atividade ?? "").toUpperCase().includes("BOTE")
    )
    if (comboBote) return comboBote
  }

  // Barco Elétrico Eco Park Porto Da Ilha: preço principal = atividade "Barco Eletrico"
  if (tourSlug.includes("barco-eletrico") && tourSlug.includes("porto-da-ilha")) {
    const barco = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return ativ.includes("BARCO") && ativ.includes("ELETRICO")
    })
    if (barco) return barco
  }

  // Quadriciclo Serra Da Bodoquena: preço principal = atividade QUADRICICLO COM ALMOÇO
  if (tourSlug === "quadriciclo-serra-da-bodoquena") {
    const quadriciclo = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      return ativ.includes("QUADRICICLO") && ativ.includes("ALMOCO")
    })
    if (quadriciclo) return quadriciclo
  }

  // Quadriciclo Trilha Boiadeira: preço principal = atividade 420 CC - ADULTO
  if (tourSlug === "quadriciclo-trilha-boiadeira") {
    const quadriciclo = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      return ativ.includes("420") || (ativ.includes("QUADRICICLO") && ativ.includes("ADULTO"))
    })
    if (quadriciclo) return quadriciclo
  }

  // Balneário Estrela Do Formoso: preço principal = atividade "ESTRELA DO FORMOSO - DAY USE", tabela "BAIXA - 2026"
  if (
    tourSlug.includes("estrela-do-formoso") &&
    tourSlug.includes("balneario") &&
    !tourSlug.includes("quadriciclo")
  ) {
    const dayUseBaixa = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      const tabela = (r.nomeTabela ?? "").toUpperCase()
      const isDayUse = ativ.includes("ESTRELA DO FORMOSO") && (ativ.includes("DAY USE") || ativ.includes("DAY U"))
      const isBaixa2026 = tabela.includes("BAIXA") && tabela.includes("2026")
      return isDayUse && isBaixa2026
    })
    if (dayUseBaixa) return dayUseBaixa
    const dayUse = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      return ativ.includes("ESTRELA DO FORMOSO") && (ativ.includes("DAY USE") || ativ.includes("DAY U"))
    })
    if (dayUse) return dayUse
  }

  // Quadriciclo + Balneário Estrela do Formoso: preço principal = atividade "ESTRELA DO FORMOSO - TRILHA DE QUADRICICLO + DAY U"
  if (tourSlug.includes("estrela-do-formoso")) {
    const estrelaAtiv = pool.find(
      (r) =>
        (r.atividade ?? "").toUpperCase().includes("ESTRELA DO FORMOSO") &&
        (r.atividade ?? "").toUpperCase().includes("TRILHA") &&
        (r.atividade ?? "").toUpperCase().includes("QUADRICICLO") &&
        ((r.atividade ?? "").toUpperCase().includes("DAY U") ||
          (r.atividade ?? "").toUpperCase().includes("DAY USE"))
    )
    if (estrelaAtiv) return estrelaAtiv
  }

  // Quadriciclo Rotta Zagaia: preço principal = 420 CC - ADULTO, NÃO 250 CC - INFANTO JUVENIL
  if (tourSlug === "quadriciclo-rotta-zagaia" || tourSlug.endsWith("-rotta-zagaia")) {
    const temAdulto = (r: TourPriceRowDisplay) =>
      (r.nomeTabela ?? "").toUpperCase().includes("ADULTO") ||
      (r.atividade ?? "").toUpperCase().includes("ADULTO")
    const temInfanto = (r: TourPriceRowDisplay) =>
      (r.nomeTabela ?? "").toUpperCase().includes("INFANTO") ||
      (r.nomeTabela ?? "").toUpperCase().includes("JUVENIL") ||
      (r.atividade ?? "").toUpperCase().includes("INFANTO") ||
      (r.atividade ?? "").toUpperCase().includes("JUVENIL")
    const linhasAdulto = pool.filter((r) => temAdulto(r) && !temInfanto(r))
    const candidatos = linhasAdulto.length > 0 ? linhasAdulto : pool.filter((r) => !temInfanto(r))
    if (candidatos.length > 0) {
      const altaEntre = candidatos.filter((r) => r.isNormal)
      const pool = altaEntre.length > 0 ? altaEntre : candidatos
      return pool.reduce((a, b) => ((a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b))
    }
  }

  // Mergulho Rio da Prata: preferir atividade Mergulho
  if (tourSlug.includes("rio-da-prata") && tourSlug.includes("mergulho")) {
    const mergulho = pool.find((r) =>
      (r.atividade ?? "").toUpperCase().includes("MERGULHO")
    )
    if (mergulho) return mergulho
  }

  // Cavalgada - Rio Da Prata: preço principal = atividade "Prata - Passeio a cavalo"
  if (tourSlug.includes("cavalgada") && tourSlug.includes("rio-da-prata")) {
    const cavalo = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return ativ.includes("PRATA") && ativ.includes("PASSEIO") && ativ.includes("CAVALO")
    })
    if (cavalo) return cavalo
  }

  // Flutuação Rio da Prata: preferir atividade Flutuação
  if (tourSlug.includes("rio-da-prata") && tourSlug.includes("flutuacao")) {
    const flutuacao = pool.find((r) =>
      (r.atividade ?? "").toUpperCase().includes("FLUTUACAO") ||
      (r.atividade ?? "").toUpperCase().includes("FLUTUAÇÃO")
    )
    if (flutuacao) return flutuacao
  }

  // Nascente Azul (passeio genérico): preço principal = atividade Flutuação (337,00)
  if (tourSlug === "nascente-azul") {
    const flutuacao = withPrice.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const tab = (r.nomeTabela ?? "").toUpperCase()
      return (ativ.includes("FLUTUACAO") || ativ.includes("FLUTUAÇÃO")) && !tab.includes("BONITENSE")
    })
    if (flutuacao) return flutuacao
  }

  // Balneário Nascente Azul: preço principal = atividade Balneário
  if (tourSlug === "balneario-nascente-azul") {
    const balneario = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return ativ.includes("BALNEARIO") || ativ.includes("BALNE")
    })
    if (balneario) return balneario
  }

  // Nascente Azul Flutuação Com Balneário: preferir atividade Flutuação da tabela 2026-BAIXA
  if (tourSlug.includes("nascente-azul") && tourSlug.includes("flutuacao")) {
    const flutuacaoBaixa = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      const tabela = (r.nomeTabela ?? "").toUpperCase()
      const isFlutuacao = ativ.includes("FLUTUACAO") || ativ.includes("FLUTUAÇÃO")
      const isBaixa2026 = (tabela.includes("BAIXA") && tabela.includes("2026")) || tabela === "2026-BAIXA"
      return isFlutuacao && isBaixa2026
    })
    if (flutuacaoBaixa) return flutuacaoBaixa
    const flutuacao = pool.find((r) => {
      const ativ = (r.atividade ?? "").toUpperCase()
      return ativ.includes("FLUTUACAO") || ativ.includes("FLUTUAÇÃO")
    })
    if (flutuacao) return flutuacao
  }

  // Aquário Natural: preferir atividade Aquário
  if (tourSlug.includes("aquario-natural") || tourSlug === "aquario-natural") {
    const aquario = pool.find((r) =>
      (r.atividade ?? "").toUpperCase().includes("AQUARIO") ||
      (r.atividade ?? "").toUpperCase().includes("AQUÁRIO")
    )
    if (aquario) return aquario
  }

  // Rota Aventura: atrativo Rota Aventura, preferir alta temporada / menor preço adulto
  if (tourSlug === "rota-aventura" || tourSlug.endsWith("-rota-aventura")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "rota-aventura")
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const pool = alta.length > 0 ? alta : doAtrativo
      return pool.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Bosque das Águas: atrativo Bosque das Águas, preferir alta temporada / menor preço adulto
  if (tourSlug === "bosque-das-aguas" || tourSlug.includes("bosque-das-aguas")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "bosque-das-aguas")
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Bio Park: atrativo Bio Park, preferir alta temporada / menor preço adulto
  if (tourSlug === "bio-park" || tourSlug.includes("bio-park")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "bio-park")
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Boca Da Onça Rapel + Trilha Adventure: atrativo Boca da Onça, preço principal = COMBO RAPEL + TRILHA ADVENTURE BT 2026
  if (tourSlug.includes("boca-da-onca") && tourSlug.includes("rapel")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "boca-da-onca")
    if (doAtrativo.length > 0) {
      const comboRapel = doAtrativo.find((r) => {
        const ativ = (r.atividade ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return ativ.includes("RAPEL") && ativ.includes("TRILHA");
      })
      if (comboRapel) return comboRapel
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Boca Da Onça - Trilha Adventure (Normal): atrativo Boca da Onça, preferir alta temporada / menor preço adulto
  if (tourSlug.includes("boca-da-onca") || tourSlug.includes("trilha-adventure")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "boca-da-onca")
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Gruta De São Miguel: preferir atrativo "Gruta Catedral" ou "Museu", preço principal = "1. Normal BT"
  if (tourSlug.includes("sao-miguel")) {
    const doAtrativo = pool.filter((r) => {
      const atrNorm = (r.atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return atrNorm.includes("CATEDRAL") || atrNorm.includes("MUSEU")
    })
    if (doAtrativo.length > 0) {
      const normalBt = doAtrativo.find((r) => (r.nomeTabela ?? "").toUpperCase().includes("1. NORMAL BT"))
      if (normalBt) return normalBt
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Barra Do Sucuri: preferir atrativo "Barra Do Sucuri" e atividade "Flutuação"
  if (tourSlug === "barra-do-sucuri" || tourSlug.includes("barra-do-sucuri")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "barra-do-sucuri")
    if (doAtrativo.length > 0) {
      const flutuacao = doAtrativo.find((r) => (r.atividade ?? "").toUpperCase().includes("FLUTUA"))
      if (flutuacao) return flutuacao
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Cavalgada Recanto do Peão: atrativo "Cavalgada do Peão", alta temporada
  if (tourSlug.includes("cavalgada-recanto-do-peao")) {
    const doAtrativo = pool.filter((r) => {
      const slug = createSlug(r.atrativo)
      return slug === "cavalgada-do-peao" || slug.includes("peao")
    })
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Cachoeiras Rio Do Peixe: atrativo "Rio do Peixe", alta temporada / menor preço adulto
  if (tourSlug.includes("cachoeiras-rio-do-peixe") || tourSlug === "rio-do-peixe") {
    const doAtrativo = pool.filter((r) => {
      const slug = createSlug(r.atrativo)
      return slug === "rio-do-peixe" || slug.includes("rio-do-peixe")
    })
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const poolAtivo = alta.length > 0 ? alta : doAtrativo
      return poolAtivo.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Lagoa Misteriosa: atrativo "Rio da Prata", atividade "Lagoa"
  if (tourSlug.includes("lagoa-misteriosa")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo).includes("rio-da-prata"))
    if (doAtrativo.length > 0) {
      const lagoa = doAtrativo.filter((r) => (r.atividade ?? "").toUpperCase().includes("LAGOA"))
      const poolAtivo = lagoa.length > 0 ? lagoa : doAtrativo
      const alta = poolAtivo.filter((r) => r.isNormal)
      const finalPool = alta.length > 0 ? alta : poolAtivo
      return finalPool.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Mergulho com Cilindro - Gruta do Mimoso: atrativo "Gruta do Mimoso", preferencia para "Mergulho Cave", alta temporada
  if (tourSlug.includes("mergulho-com-cilindro") && tourSlug.includes("gruta-do-mimoso")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo).includes("gruta-do-mimoso"))
    if (doAtrativo.length > 0) {
      const cave = doAtrativo.filter((r) => (r.atividade ?? "").toUpperCase().includes("MERGULHO CAVE"))
      const poolAtivo = cave.length > 0 ? cave : doAtrativo
      const alta = poolAtivo.filter((r) => r.isNormal)
      const finalPool = alta.length > 0 ? alta : poolAtivo
      return finalPool.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Bike Boat Eco Park Porto Da Ilha: atrativo "Porto da Ilha", atividade "BIKE BOAT"
  if (tourSlug.includes("bike-boat") && tourSlug.includes("porto-da-ilha")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo).includes("porto-da-ilha"))
    if (doAtrativo.length > 0) {
      const bikeBoat = doAtrativo.filter((r) => (r.atividade ?? "").toUpperCase().includes("BIKE BOAT"))
      const poolAtivo = bikeBoat.length > 0 ? bikeBoat : doAtrativo
      const bike2026 = poolAtivo.find((r) => (r.nomeTabela ?? "").toUpperCase().includes("BIKE 2026"))
      if (bike2026) return bike2026

      const alta = poolAtivo.filter((r) => r.isNormal)
      const finalPool = alta.length > 0 ? alta : poolAtivo
      return finalPool.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Cachoeiras Serra da Bodoquena com Almoço:
  if (tourSlug.includes("cachoeiras-serra-da-bodoquena-com-almoco")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo).includes("bodoquena"))
    if (doAtrativo.length > 0) {
      const almoco = doAtrativo.filter((r) => (r.atividade ?? "").toUpperCase().includes("BALNEARIO COM ALMOCO") || (r.atividade ?? "").toUpperCase().includes("BALNEÁRIO COM ALMOÇO") || (r.atividade ?? "").toUpperCase().includes("BALNEARIO COM ALMOÇO"))
      const poolAtivo = almoco.length > 0 ? almoco : doAtrativo
      
      const bt = poolAtivo.find((r) => (r.nomeTabela ?? "").toUpperCase().includes("TAB BT") && !(r.nomeTabela ?? "").toUpperCase().includes("MS"))
      if (bt) return bt

      const alta = poolAtivo.filter((r) => r.isNormal)
      const finalPool = alta.length > 0 ? alta : poolAtivo
      return finalPool.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Pantanal Experiência: atrativo Pantanal Experiência, principal = Day Use Vida de Comitiva
  if (tourSlug === "pantanal-experiencia" || tourSlug.endsWith("-pantanal-experiencia")) {
    const dayUseVida = pool.find(
      (r) =>
        (r.atividade ?? "").toUpperCase().includes("DAY USE") &&
        (r.atividade ?? "").toUpperCase().includes("VIDA DE COMITIVA")
    )
    if (dayUseVida) return dayUseVida
    const dayUse = pool.find((r) => (r.atividade ?? "").toUpperCase().includes("DAY USE"))
    if (dayUse) return dayUse
    const alta = pool.filter((r) => r.isNormal)
    const candidatos = alta.length > 0 ? alta : pool
    if (candidatos.length > 0) {
      return candidatos.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  // Refúgio da Barra: atrativo Refugio da Barra, preferir alta temporada / menor preço adulto
  if (tourSlug === "refugio-da-barra" || tourSlug.endsWith("-refugio-da-barra")) {
    const doAtrativo = pool.filter((r) => createSlug(r.atrativo) === "refugio-da-barra")
    if (doAtrativo.length > 0) {
      const alta = doAtrativo.filter((r) => r.isNormal)
      const pool = alta.length > 0 ? alta : doAtrativo
      return pool.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
  }

  const atividadeSlug = (r: TourPriceRowDisplay) => createSlug(r.atividade)
  const atrativoSlug = (r: TourPriceRowDisplay) => createSlug(r.atrativo)
  const altaRows = pool.filter((r) => r.isNormal)

  // Preferência global: Day-Use tabela BT26/BT 2026 quando disponível
  const dayUseBt = pool.find((r) => isDayUseBt26(r))
  if (dayUseBt) return dayUseBt

  // Preferência global: tabela Tab com período (ex: Tab (15) JAN-2026/DEZ-2026) = preço individual, não GP (grupo)
  const tabIndividual = pool.filter((r) => isTabelaTabIndividual(r))
  if (tabIndividual.length > 0) {
    return tabIndividual.reduce((a, b) =>
      (a.adulto ?? Infinity) <= (b.adulto ?? Infinity) ? a : b
    )
  }


  // Fase 1: match por ATIVIDADE (atividade = tipo de passeio, ex: Flutuação, Mergulho)
  const atividadeMatches = pool.filter((r) => {
    const ativScore = nameSimilarity(tourTitle, r.atividade)
    const ativSlug = atividadeSlug(r)
    const slugMatch =
      ativSlug &&
      (tourSlug === ativSlug ||
        tourSlug.includes(ativSlug) ||
        ativSlug.includes(tourSlug))
    return ativScore >= SIMILARITY_THRESHOLD || !!slugMatch
  })

  if (atividadeMatches.length > 0) {
    const scored = atividadeMatches.map((r) => ({
      row: r,
      score: nameSimilarity(tourTitle, r.atividade),
    }))
    const best = pickBestFromScored(scored, SIMILARITY_THRESHOLD)
    if (best) return best
    // Fallback interno: menor preço entre as de alta temporada
    const altaAmong = atividadeMatches.filter((r) => r.isNormal)
    if (altaAmong.length > 0) {
      return altaAmong.reduce((a, b) =>
        (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
      )
    }
    return atividadeMatches.reduce((a, b) =>
      (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
    )
  }

  // Fase 2: fallback por ATRATIVO (atrativo = local, ex: Abismo Anhumas, Balneário Municipal)
  // Quando o atrativo é o mesmo para várias linhas (ex: Balneário + Churrasqueira), preferir
  // a linha cuja ATIVIDADE melhor corresponde ao tour (ex: "Balneário" para "Balneário Municipal").
  const atrativoMatches = pool.filter((r) => {
    const atrScore = nameSimilarity(tourTitle, r.atrativo)
    const atrSlug = atrativoSlug(r)
    const slugMatch =
      atrSlug &&
      (tourSlug === atrSlug ||
        tourSlug.includes(atrSlug) ||
        atrSlug.includes(tourSlug))
    return atrScore >= SIMILARITY_THRESHOLD || !!slugMatch
  })

  if (atrativoMatches.length > 0) {
    const scored = atrativoMatches.map((r) => {
      const atrScore = nameSimilarity(tourTitle, r.atrativo)
      const ativScore = nameSimilarity(tourTitle, r.atividade)
      const ativSlug = atividadeSlug(r)
      const atividadeContida =
        ativSlug && (tourSlug.startsWith(ativSlug) || tourSlug.includes(`-${ativSlug}`))
      const bonusAtividade = ativScore > 0.15 || atividadeContida ? 0.5 : 0
      // Penalizar add-ons (Churrasqueira, etc.) quando o tour não os menciona – evita R$ 40 Churrasqueira como main para Balneário Municipal
      const penaltyAddon = isAddonAtividade(r.atividade, tourSlug) ? 0.6 : 0
      return {
        row: r,
        score: atrScore + bonusAtividade - penaltyAddon,
      }
    })
    const best = pickBestFromScored(scored, SIMILARITY_THRESHOLD)
    if (best) return best
    const altaAmong = atrativoMatches.filter((r) => r.isNormal)
    if (altaAmong.length > 0) {
      const altaScored = altaAmong.map((r) => ({
        row: r,
        score: nameSimilarity(tourTitle, r.atividade),
      }))
      const bestAlta = altaScored.reduce((a, b) =>
        a.score > b.score ? a : b.score > a.score ? b : (a.row.adulto ?? Infinity) <= (b.row.adulto ?? Infinity) ? a : b
      )
      return bestAlta.row
    }
    return atrativoMatches.reduce((a, b) =>
      (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
    )
  }

  // Fase 3: sem match por atividade nem atrativo – menor preço alta temporada
  if (altaRows.length > 0) {
    return altaRows.reduce((a, b) =>
      (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
    )
  }

  return pool.reduce((a, b) =>
    (a.adulto ?? Infinity) < (b.adulto ?? Infinity) ? a : b
  )
}

/** Find price rows for a tour and build TourPriceInfo */
export function findPricesForTour(
  rows: AtrativoAtividadePrecoRow[],
  tourSlug: string,
  tourTitle: string,
  selectedSeason?: "ALTA" | "BAIXA" | null,
  btmsAtativoOverride?: string,
  preferredAtividade?: string,
  preferredTabela?: string,
  preferredBaixaTabela?: string,
  preferredMsTabela?: string,
  preferredBonitenseTabela?: string,
  preferNextSemester?: boolean,
  visiblePrices?: string[] | null
): TourPriceInfo | null {
  const tourTitleSlug = createSlug(tourTitle)
  let matching: AtrativoAtividadePrecoRow[]

  if (btmsAtativoOverride && btmsAtativoOverride.trim()) {
    // Vínculo manual: retorna TODAS as linhas do atrativo, sem nenhum filtro de atividade
    const overrideName = btmsAtativoOverride.trim().toUpperCase()
    matching = rows.filter(
      (r) => (r.atrativo ?? "").toUpperCase().trim() === overrideName
    )
  } else {
    // Heurística automática
    matching = rows.filter((r) => matchesTour(r, tourSlug, tourTitleSlug))
  }

  // Fallback Parque Ecológico - Boia Cross: busca direta por atrativo/atividade quando matching falha
  const isParqueBoia =
    tourSlug === "parque-ecologico-boia-cross" ||
    (tourSlug.includes("parque-ecologico") && tourSlug.includes("boia-cross"))
  if (isParqueBoia && matching.length === 0) {
    matching = rows.filter((r) => {
      const atr = (r.atrativo ?? "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const atrativoMatch = atr.includes("RIO") && atr.includes("FORMOSO")
      const temPreco = getPrice(r, "pax") != null || getPrice(r, "garupa_pax") != null
      return atrativoMatch && temPreco
    })
  }

  if (matching.length === 0) return null

  // Augmenta o conjunto com linhas explicitamente referenciadas pelas escolhas do admin
  // (overrides de visible_prices e tabelas preferidas). Sem isso, um valor selecionado no
  // painel — ex.: Alta Temporada — pode não existir em `matching` (filtrado por matchesTour)
  // e some na página do passeio. Escopo restrito aos atrativos já correspondidos.
  {
    const dispTabela = (r: AtrativoAtividadePrecoRow) => r.nome_tabela_preco ?? ""
    const dispAtividade = (r: AtrativoAtividadePrecoRow) => r.atividade ?? r.atrativo ?? ""
    const atrKey = (r: AtrativoAtividadePrecoRow) => (r.atrativo ?? "").toUpperCase().trim()

    const neededPairs = new Set<string>()
    const neededTabelas = new Set<string>()
    const PAIR_SEP = "\u0000"

    if (preferredTabela && preferredAtividade) {
      neededPairs.add(`${preferredTabela}${PAIR_SEP}${preferredAtividade}`)
    }
    if (preferredBaixaTabela) neededTabelas.add(preferredBaixaTabela)
    if (preferredMsTabela) neededTabelas.add(preferredMsTabela)
    if (preferredBonitenseTabela) neededTabelas.add(preferredBonitenseTabela)

    for (const entry of visiblePrices ?? []) {
      if (isExtraRowEntry(entry)) {
        const extra = parseExtraRow(entry)
        if (extra?.tabela && extra?.atividade) {
          neededPairs.add(`${extra.tabela}${PAIR_SEP}${extra.atividade}`)
        }
        continue
      }
      const hashIdx = entry.indexOf("#")
      if (hashIdx < 0) continue
      const override = entry.substring(hashIdx + 1)
      if (isManualOverride(override)) continue
      const sepIdx = override.indexOf("#")
      if (sepIdx < 0) continue
      const tabela = override.substring(0, sepIdx)
      const atividade = override.substring(sepIdx + 1)
      if (tabela && atividade) {
        neededPairs.add(`${tabela}${PAIR_SEP}${atividade}`)
      }
    }

    if (neededPairs.size > 0 || neededTabelas.size > 0) {
      const matchedAtrativos = new Set(matching.map(atrKey))
      const alreadyIncluded = new Set(
        matching.map((r) => `${dispTabela(r)}${PAIR_SEP}${dispAtividade(r)}`)
      )
      const extras = rows.filter((r) => {
        if (!matchedAtrativos.has(atrKey(r))) return false
        const pairKey = `${dispTabela(r)}${PAIR_SEP}${dispAtividade(r)}`
        if (alreadyIncluded.has(pairKey)) return false
        return neededPairs.has(pairKey) || neededTabelas.has(dispTabela(r))
      })
      if (extras.length > 0) matching = [...matching, ...extras]
    }
  }

  let displayRows = matching.map((r) => toDisplayRow(r, tourSlug, tourTitle))
  sortDisplayRowsBySemester(displayRows, preferNextSemester)

  // (Filtro de balneário removido — restrição invisível que anulava escolhas do admin.
  //  Admin controla preços via preferred_price_atividade, visible_prices e manual_price.)

  // Extrai linha de tarifa Bonitense (preferência manual ou auto-detecção)
  const bonitenseRow = preferredBonitenseTabela
    ? displayRows.find((r) => r.nomeTabela === preferredBonitenseTabela)
    : displayRows.find((r) => isBonitense(r))

  // Extrai linha de tarifa MS / Sul-Mato-Grossense / Sênior
  const msRow = preferredMsTabela
    ? displayRows.find((r) => r.nomeTabela === preferredMsTabela)
    : displayRows.find((r) => isSulMatoGrossense(r) && !isBonitense(r))

  // Extrai linha de Baixa Temporada (preferência manual ou auto via tabelas BT)
  const regularRows = displayRows.filter((r) => !isBonitense(r) && !isSulMatoGrossense(r))
  const baixaRow = preferredBaixaTabela
    ? displayRows.find((r) => r.nomeTabela === preferredBaixaTabela)
    : pickMainPriceRow(
        regularRows.filter((r) => isBaixaTemporadaTable(r.nomeTabela, r.temporada)),
        tourTitle,
        tourSlug,
        "BAIXA"
      ) ??
      regularRows.find((r) => isBaixaTemporadaTable(r.nomeTabela, r.temporada)) ??
      regularRows.find((r) => r.temporada === "BAIXA")

  // Determina a linha principal: prefere a escolha manual do admin, senão usa automático
  let mainPriceRow: TourPriceRowDisplay | null | undefined
  if (preferredAtividade) {
    mainPriceRow = displayRows.find(
      (r) =>
        r.atividade === preferredAtividade &&
        (!preferredTabela || r.nomeTabela === preferredTabela)
    ) ?? pickMainPriceRow(displayRows, tourTitle, tourSlug, selectedSeason)
  } else {
    mainPriceRow = pickMainPriceRow(displayRows, tourTitle, tourSlug, selectedSeason)
  }

  if (preferNextSemester) {
    mainPriceRow = preferSecondSemesterAltaRow(mainPriceRow, displayRows) ?? mainPriceRow
  }

  // Calculate precoMinimo prioritizing the correct semester rows if they are available
  let rowsForMinPrice = matching
  if (preferNextSemester) {
    const secondSemMatching = matching.filter(
      (r) => isOnOrAfter(r.vig_inicio, DEFAULT_SEMESTER_SPLIT)
    )
    if (secondSemMatching.length > 0) {
      rowsForMinPrice = secondSemMatching
    }
  } else {
    const firstSemMatching = matching.filter(
      (r) => !!r.vig_inicio && !isOnOrAfter(r.vig_inicio, DEFAULT_SEMESTER_SPLIT)
    )
    if (firstSemMatching.length > 0) {
      rowsForMinPrice = firstSemMatching
    }
  }
  const adultPrices = rowsForMinPrice.flatMap((r) => [
    getPrice(r, "pax"),
    getPrice(r, "garupa_pax"),
  ]).filter((n): n is number => n != null && n > 0)
  const precoMinimo = adultPrices.length > 0 ? Math.min(...adultPrices) : 0

  return {
    rows: displayRows,
    precoMinimo,
    mainPriceRow: mainPriceRow ?? undefined,
    baixaRow: baixaRow ?? undefined,
    bonitenseRow: bonitenseRow ?? undefined,
    msRow: msRow ?? undefined,
  }
}

/** Pantanal Experiência: preços fixos (view não tem insert – dados da mensagem do usuário) */
function getPantanalExperienciaPrices(): TourPriceInfo {
  const rows: TourPriceRowDisplay[] = [
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Pantanal Experiência",
      atividade: "Day Use – Vida de Comitiva com almoço - 100% Peão",
      atividadeAmigavel: "Vida de Comitiva (Com Almoço)",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 615,
      crianca: 465,
      tarifaMs: null,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Pantanal Experiência",
      atividade: "Meio Período – Vida de Comitiva sem almoço - 100% Peão",
      atividadeAmigavel: "Vida de Comitiva (Sem Almoço)",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 395,
      crianca: 300,
      tarifaMs: null,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Pantanal Experiência",
      atividade: "Day Use – Cheiros e Sabores com almoço",
      atividadeAmigavel: "Cheiros e Sabores (Com Almoço)",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 455,
      crianca: 395,
      tarifaMs: null,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Pantanal Experiência",
      atividade: "Meio Período – Cheiros e Sabores sem almoço",
      atividadeAmigavel: "Cheiros e Sabores (Sem Almoço)",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 240,
      crianca: 190,
      tarifaMs: null,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Pantanal Experiência",
      atividade: "Pacote Especial Comitiva Raiz – 02 Noites e 02 dias",
      atividadeAmigavel: "Day Use",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 2615,
      crianca: 2615,
      tarifaMs: null,
    },
  ]
  const mainPriceRow = rows[0]
  return {
    rows,
    precoMinimo: 240,
    mainPriceRow,
  }
}

/** Buraco das Araras: preços fixos (view não tem – dados do texto do usuário) */
function getBuracoDasArarasPrices(): TourPriceInfo {
  const rows: TourPriceRowDisplay[] = [
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Baixa e Alta temporada",
      atrativo: "Buraco das Araras",
      atividade: "Buraco das Araras – Baixa e Alta temporada",
      atividadeAmigavel: "Trilha e Contemplação",
      nomeTabelaAmigavel: "Preço Baixa e Alta temporada",
      isNormal: true,
      temporada: null,
      adulto: 185,
      crianca: 135,
      tarifaMs: 150,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Buraco das Araras",
      atividade: "Observação de aves 1/2 período",
      atividadeAmigavel: "Observação de Aves",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 450,
      crianca: null,
      tarifaMs: null,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada",
      atrativo: "Buraco das Araras",
      atividade: "Observação de aves dia inteiro",
      atividadeAmigavel: "Observação de Aves (Dia Inteiro)",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 600,
      crianca: null,
      tarifaMs: null,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Baixa temporada",
      atrativo: "Buraco das Araras",
      atividade: "Combo - Buraco das Araras + Balneário Jardim Eco Park",
      atividadeAmigavel: "Buraco das Araras + Balneário",
      nomeTabelaAmigavel: "Preço Baixa temporada",
      isNormal: true,
      temporada: "BAIXA",
      adulto: 275,
      crianca: 200,
      tarifaMs: 225,
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada e Finais de Semana",
      atrativo: "Buraco das Araras",
      atividade: "Combo - Buraco das Araras + Balneário Jardim Eco Park",
      atividadeAmigavel: "Buraco das Araras + Balneário",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 305,
      crianca: 212,
      tarifaMs: 245,
    },
  ]
  const mainPriceRow = rows[0]
  return {
    rows,
    precoMinimo: 185,
    mainPriceRow,
  }
}



/** Cabanas Arvorismo: preços fixos (view não tem – dados da mensagem do usuário) */
function getCabanasArvorismoPrices(): TourPriceInfo {
  const rows: TourPriceRowDisplay[] = [
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Normal",
      atrativo: "Hotel Cabanas",
      atividade: "Arvorismo",
      atividadeAmigavel: "Arvorismo",
      nomeTabelaAmigavel: "Alta Temporada e Baixa temporada",
      isNormal: true,
      temporada: null,
      adulto: 170, // adulto
      crianca: 136, // criança
      tarifaMs: null,
    },
  ]
  const mainPriceRow = rows[0]
  return {
    rows,
    precoMinimo: 170,
    mainPriceRow,
  }
}

/** Boia Cross Cabanas: preços fixos */
function getBoiaCrossCabanasPrices(): TourPriceInfo {
  const rows: TourPriceRowDisplay[] = [
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Normal",
      atrativo: "Hotel Cabanas",
      atividade: "Boia Cross Cabanas",
      atividadeAmigavel: "Boia Cross",
      nomeTabelaAmigavel: "Baixa e Alta temporada",
      isNormal: true,
      temporada: null,
      adulto: 160,
      crianca: 136,
      tarifaMs: null,
    },
  ]
  const mainPriceRow = rows[0]
  return {
    rows,
    precoMinimo: 160,
    mainPriceRow,
  }
}


/** Balneário Jardim Ecopark: preços fixos baseados no texto fornecido */
function getBalnearioJardimEcoparkPrices(): TourPriceInfo {
  const rows: TourPriceRowDisplay[] = [
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Baixa temporada",
      atrativo: "Balneário Jardim Ecopark",
      atividade: "Balneário Jardim Ecopark",
      atividadeAmigavel: "Balneário",
      nomeTabelaAmigavel: "Preço Baixa temporada",
      isNormal: true,
      temporada: "BAIXA",
      adulto: 90,
      crianca: 65, // 06 a 12 anos
      tarifaMs: 75, // + 60 anos
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada e Finais de Semana",
      atrativo: "Balneário Jardim Ecopark",
      atividade: "Balneário Jardim Ecopark",
      atividadeAmigavel: "Balneário",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 120,
      crianca: 80, // 06 a 12 anos
      tarifaMs: 95, // + 60 anos
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Baixa temporada",
      atrativo: "Balneário Jardim Ecopark",
      atividade: "Combo - Buraco das Araras + Balneário Jardim Eco Park",
      atividadeAmigavel: "Buraco das Araras + Balneário",
      nomeTabelaAmigavel: "Preço Baixa temporada",
      isNormal: true,
      temporada: "BAIXA",
      adulto: 275,
      crianca: 200, // 06 a 12 anos
      tarifaMs: 225, // + 60 anos
    },
    {
      vigInicio: "2025-01-01",
      vigFim: "2026-12-31",
      nomeTabela: "Alta temporada e Finais de Semana",
      atrativo: "Balneário Jardim Ecopark",
      atividade: "Combo - Buraco das Araras + Balneário Jardim Eco Park",
      atividadeAmigavel: "Buraco das Araras + Balneário",
      nomeTabelaAmigavel: "Preço Alta temporada",
      isNormal: true,
      temporada: "ALTA",
      adulto: 305,
      crianca: 212, // 06 a 12 anos
      tarifaMs: 245, // + 60 anos
    },
  ]
  const mainPriceRow = rows[0]
  return {
    rows,
    precoMinimo: 90,
    mainPriceRow,
  }
}


/** Implementação dos overrides manuais para os 12 passeios da Bonito ON */
function getBonitoOnUpdatedPrices(slug: string): TourPriceInfo | null {
  const overrides: Record<string, TourPriceInfo> = {
    'rio-azul': {
      precoMinimo: 498,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Rio Azul", atividade: "Flutuação", atividadeAmigavel: "Flutuação", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 498, crianca: 248, tarifaMs: 420 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Rio Azul", atividade: "Flutuação", atividadeAmigavel: "Flutuação", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 598, crianca: 298, tarifaMs: 520 }
      ],
      mainPriceRow: { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Rio Azul", atividade: "Flutuação", atividadeAmigavel: "Flutuação", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 598, crianca: 298, tarifaMs: 520 }
    },
    'quadriciclo-serra-da-bodoquena': {
      precoMinimo: 308,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Quadriciclo Serra da Bodoquena", atividade: "Individual c/ almoço", atividadeAmigavel: "Individual", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 308, crianca: null, tarifaMs: null, garupaAdulto: 198 }, // 308+198=506
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Quadriciclo Serra da Bodoquena", atividade: "Individual c/ almoço", atividadeAmigavel: "Individual", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 352, crianca: null, tarifaMs: null, garupaAdulto: 220 } // 352+220=572
      ]
    },
    'rota-aventura': {
      precoMinimo: 110,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Geral", atrativo: "Rota Aventura", atividade: "Rota Formoso", atividadeAmigavel: "Rota Formoso", nomeTabelaAmigavel: "Padrão", isNormal: true, temporada: "BAIXA", adulto: 198, crianca: null, tarifaMs: null },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Geral", atrativo: "Rota Aventura", atividade: "Rota Boiadeira", atividadeAmigavel: "Rota Boiadeira", nomeTabelaAmigavel: "Padrão", isNormal: true, temporada: "BAIXA", adulto: 110, crianca: null, tarifaMs: null },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Geral", atrativo: "Rota Aventura", atividade: "Rota Estrela", atividadeAmigavel: "Rota Estrela", nomeTabelaAmigavel: "Padrão", isNormal: true, temporada: "BAIXA", adulto: 300, crianca: null, tarifaMs: null }
      ]
    },
    'quadriciclo-trilha-boiadeira': {
      precoMinimo: 238,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Rota Boiadeira", atividade: "Individual", atividadeAmigavel: "Individual", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 280, crianca: null, tarifaMs: 238, garupaAdulto: 93 }, // 280+93=373, 238+79=317
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Rota Boiadeira", atividade: "Individual", atividadeAmigavel: "Individual", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 339, crianca: null, tarifaMs: null, garupaAdulto: 112 } // 339+112=451
      ]
    },
    'cachoeiras-serra-da-bodoquena-com-almoco': {
      precoMinimo: 298,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Cachoeiras Serra da Bodoquena", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 340, crianca: 298, tarifaMs: 298 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Cachoeiras Serra da Bodoquena", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 440, crianca: 360, tarifaMs: 360 }
      ],
      mainPriceRow: { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Cachoeiras Serra da Bodoquena", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 440, crianca: 360, tarifaMs: 360 }
    },


    'fazenda-san-francisco': {
      precoMinimo: 300,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Day Use", atrativo: "Fazenda San Francisco", atividade: "Day use com almoço", atividadeAmigavel: "Day Use", nomeTabelaAmigavel: "Geral", isNormal: true, temporada: "BAIXA", adulto: 438, crianca: 300, tarifaMs: null },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Meio Período", atrativo: "Fazenda San Francisco", atividade: "Passeio Meio Período", atividadeAmigavel: "Meio Período", nomeTabelaAmigavel: "Geral", isNormal: true, temporada: "BAIXA", adulto: 300, crianca: 202, tarifaMs: null },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Focagem", atrativo: "Fazenda San Francisco", atividade: "Focagem Noturna", atividadeAmigavel: "Focagem", nomeTabelaAmigavel: "Geral", isNormal: true, temporada: "BAIXA", adulto: 346, crianca: 346, tarifaMs: null }
      ]
    },
    'fazenda-ceita-core': {
      precoMinimo: 309,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Ceita Core", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 516, crianca: 309, tarifaMs: 361 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Ceita Core", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 580, crianca: 348, tarifaMs: 406 }
      ]
    },
    'estancia-mimosa': {
      precoMinimo: 280,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Estância Mimosa", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 340, crianca: 280, tarifaMs: 280 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Estância Mimosa", atividade: "Trilha e Cachoeiras", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 410, crianca: 340, tarifaMs: null }
      ]
    },
    'canions-do-salobra': {
      precoMinimo: 380,
      rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa Temporada", atrativo: "Cânions do Salobra", atividade: "Caiaque Duck", atividadeAmigavel: "Caiaque", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 520, crianca: 520, tarifaMs: 380 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta Temporada", atrativo: "Cânions do Salobra", atividade: "Caiaque Duck", atividadeAmigavel: "Caiaque", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 620, crianca: 620, tarifaMs: null }
      ]
    }
  };

  // Boca da Onça variants
  if (slug.includes('boca-da-onca')) {
    if (slug.includes('rapel')) {
      return { precoMinimo: 215, rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa", atrativo: "Boca da Onça", atividade: "Rapel + Trilha", atividadeAmigavel: "Rapel", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 430, crianca: 215, tarifaMs: 344 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta", atrativo: "Boca da Onça", atividade: "Rapel + Trilha", atividadeAmigavel: "Rapel", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 510, crianca: 255, tarifaMs: 408 }
      ]};
    }
    if (slug.includes('buraco-do-macaco')) {
       return { precoMinimo: 215, rows: [
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa", atrativo: "Boca da Onça", atividade: "Buraco do Macaco", atividadeAmigavel: "Buraco do Macaco", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 430, crianca: 215, tarifaMs: 344 },
        { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta", atrativo: "Boca da Onça", atividade: "Buraco do Macaco", atividadeAmigavel: "Buraco do Macaco", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 510, crianca: 255, tarifaMs: 408 }
      ]};
    }
    // Trilha Adventure (padrão)
    return { precoMinimo: 277.5, rows: [
      { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Baixa", atrativo: "Boca da Onça", atividade: "Trilha Adventure", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Baixa", isNormal: true, temporada: "BAIXA", adulto: 555, crianca: 277.5, tarifaMs: 444 },
      { vigInicio: "2025-01-01", vigFim: "2026-12-31", nomeTabela: "Alta", atrativo: "Boca da Onça", atividade: "Trilha Adventure", atividadeAmigavel: "Trilha", nomeTabelaAmigavel: "Alta", isNormal: true, temporada: "ALTA", adulto: 665, crianca: 332.5, tarifaMs: 532 }
    ]};
  }

  return overrides[slug] || null;
}

/** Get prices for multiple tours (batch, avoids N+1) */
export async function getPricesForTours(
  tours: {
    slug: string
    title: string
    btmsAtativoOverride?: string
    preferredAtividade?: string
    preferredTabela?: string
    preferredBaixaTabela?: string
    preferredMsTabela?: string
    preferredBonitenseTabela?: string
    visiblePrices?: string[] | null
  }[],
  client?: SupabaseClient,
  selectedSeason?: "ALTA" | "BAIXA" | null,
  preferNextSemester?: boolean
): Promise<Map<string, TourPriceInfo>> {
  const allRows = await getAllPricesFromView(client, preferNextSemester)
  const map = new Map<string, TourPriceInfo>()

  for (const tour of tours) {
    const slug = tour.slug || createSlug(tour.title)

    if (slug === "buraco-das-araras") {
      map.set(slug, getBuracoDasArarasPrices())
      continue
    }
    if (slug === "cabanas-arvorismo" || slug.includes("cabanas") && slug.includes("arvorismo")) {
      map.set(slug, getCabanasArvorismoPrices())
      continue
    }
    if (slug.includes("boia-cross-cabanas") || (slug.includes("boia-cross") && slug.includes("cabanas"))) {
      map.set(slug, getBoiaCrossCabanasPrices())
      continue
    }
    if (slug.includes("jardim-ecopark") || slug.includes("jardim-eco-park")) {
      map.set(slug, getBalnearioJardimEcoparkPrices())
      continue
    }
    let info = findPricesForTour(
      allRows, slug, tour.title, selectedSeason,
      tour.btmsAtativoOverride, tour.preferredAtividade, tour.preferredTabela,
      tour.preferredBaixaTabela, tour.preferredMsTabela, tour.preferredBonitenseTabela,
      preferNextSemester, tour.visiblePrices
    )
    if (!info && slug === "pantanal-experiencia") {
      info = getPantanalExperienciaPrices()
    }

    if (info) {
      map.set(slug, info)
    }
  }

  return map
}


/** Get prices for a single tour by slug */
export async function getPricesByTourSlug(
  slug: string,
  title: string,
  client?: SupabaseClient,
  selectedSeason?: "ALTA" | "BAIXA" | null,
  btmsAtativoOverride?: string,
  preferredAtividade?: string,
  preferredTabela?: string,
  preferredBaixaTabela?: string,
  preferredMsTabela?: string,
  preferredBonitenseTabela?: string,
  preferNextSemester?: boolean,
  visiblePrices?: string[] | null
): Promise<TourPriceInfo | null> {
  // Hardcoded overrides removed — all tours now use live BTMS data + admin preferences

  if (slug === "buraco-das-araras") {
    return getBuracoDasArarasPrices()
  }
  if (slug === "cabanas-arvorismo" || (slug.includes("cabanas") && slug.includes("arvorismo"))) {
    return getCabanasArvorismoPrices()
  }
  if (slug.includes("boia-cross-cabanas") || (slug.includes("boia-cross") && slug.includes("cabanas"))) {
    return getBoiaCrossCabanasPrices()
  }
  if (slug.includes("jardim-ecopark") || slug.includes("jardim-eco-park")) {
    return getBalnearioJardimEcoparkPrices()
  }
  const allRows = await getAllPricesFromView(client, preferNextSemester)
  let info = findPricesForTour(
    allRows, slug, title, selectedSeason, btmsAtativoOverride,
    preferredAtividade, preferredTabela,
    preferredBaixaTabela, preferredMsTabela, preferredBonitenseTabela,
    preferNextSemester, visiblePrices
  )
  if (!info && slug === "pantanal-experiencia") {
    info = getPantanalExperienciaPrices()
  }

  return info
}

