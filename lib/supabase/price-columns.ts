/**
 * Types and column mapping for the atrativo_atividade_precos view.
 * View is built from btms_tabelas_preco, btms_atrativos, btms_atividades.
 */

export const PRICE_COLUMNS = {
  atrativo: "atrativo",
  atividade: "atividade",
  descricao: "descricao",
  nomeTabelaPreco: "nome_tabela_preco",
  temporada: "temporada",
  vigInicio: "vig_inicio",
  vigFim: "vig_fim",
  cdgbtmsAtividade: "cdgbtms_atividade",
  cdgbtmsAtrativo: "cdgbtms_atrativo",
  publicoPax: "publico_pax",
  publicoChd: "publico_chd",
  publicoChdFree: "publico_chd_free",
  publicoCrt: "publico_crt",
  atrativoPax: "atrativo_pax",
  atrativoChd: "atrativo_chd",
  atrativoChdFree: "atrativo_chd_free",
  atrativoCrt: "atrativo_crt",
  publicoAlmPax: "publico_alm_pax",
  publicoAlmChd: "publico_alm_chd",
  atrativoAlmPax: "atrativo_alm_pax",
  atrativoAlmChd: "atrativo_alm_chd",
  publicoTrfPax: "publico_trf_pax",
  publicoTrfChd: "publico_trf_chd",
  publicoGarupaPax: "publico_garupa_pax",
  publicoGarupaChd: "publico_garupa_chd",
} as const

/** Raw row from atrativo_atividade_precos view */
export interface AtrativoAtividadePrecoRow {
  atrativo: string | null
  atividade: string | null
  descricao: string | null
  nome_tabela_preco: string | null
  temporada: string | null
  vig_inicio: string | null
  vig_fim: string | null
  cdgbtms_atividade: number | string | null
  cdgbtms_atrativo: number | string | null
  publico_pax: number | null
  publico_chd: number | null
  publico_chd_free: number | null
  publico_crt: number | null
  atrativo_pax: number | null
  atrativo_chd: number | null
  atrativo_chd_free: number | null
  atrativo_crt: number | null
  publico_alm_pax?: number | null
  publico_alm_chd?: number | null
  atrativo_alm_pax?: number | null
  atrativo_alm_chd?: number | null
  publico_trf_pax?: number | null
  publico_trf_chd?: number | null
  publico_garupa_pax?: number | null
  publico_garupa_chd?: number | null
  [key: string]: unknown
}

/** Single price row for display (adulto, crianca, tarifa MS, garupa) */
export interface TourPriceRowDisplay {
  vigInicio: string
  vigFim: string
  nomeTabela: string
  atrativo: string
  atividade: string
  nomeTabelaAmigavel: string
  temporada: string | null
  isNormal: boolean
  adulto: number | null
  crianca: number | null
  /** Criança gratuita (publico_chd_free). 0 = Free. */
  criancaFree?: number | null
  tarifaMs: number | null
  /** Garupa adulto (publico_garupa_pax) - exibido na aba Adulto */
  garupaAdulto?: number | null
  /** Garupa criança (publico_garupa_chd) - exibido na aba Criança */
  garupaCrianca?: number | null
  /** Nome simplificado da atividade para exibição amigável */
  atividadeAmigavel: string
  /** Label combinado "Atrativo – Atividade" para exibição simplificada */
  atividadeLabel?: string
}

/** Processed price info for a tour */
export interface TourPriceInfo {
  rows: TourPriceRowDisplay[]
  precoMinimo: number
  /** Linha principal (Alta Temporada / preferência manual do admin) */
  mainPriceRow?: TourPriceRowDisplay
  /** Linha de Baixa Temporada (preferência manual ou auto-detectada via BT no nome) */
  baixaRow?: TourPriceRowDisplay
  /** Linha com tarifa Bonitense (nome_tabela_preco contém "BONITENSE") */
  bonitenseRow?: TourPriceRowDisplay
  /** Linha com tarifa MS / residentes sul-mato-grossenses */
  msRow?: TourPriceRowDisplay
}
