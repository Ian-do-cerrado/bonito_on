export type InfantFreeConfig = {
  min: number
  max: number
}

/** Passeios com crianças gratuitas em faixa etária inferior à tarifa CHD. */
export const TOUR_INFANT_FREE_BY_SLUG: Record<string, InfantFreeConfig> = {
  "balneario-cachoeiras-serra-da-bodoquena-com-almoco": { min: 0, max: 5 },
  "balneario-ecopark-porto-da-ilha": { min: 0, max: 4 },
  "balneario-estrela-do-formoso": { min: 0, max: 6 },
  "balneario-jardim-ecopark": { min: 0, max: 5 },
  "balneario-municipal": { min: 0, max: 6 },
  "bio-park": { min: 0, max: 5 },
  "boca-da-onca-meia-trilha-buraco-do-macaco": { min: 0, max: 6 },
  "boca-da-onca-rapel-trilha-adventure": { min: 0, max: 6 },
  "boca-da-onca-trilha-adventure": { min: 0, max: 6 },
  "boca-da-onca-trilha-discovery": { min: 0, max: 6 },
  "bosque-das-aguas": { min: 0, max: 5 },
  "buraco-das-araras": { min: 0, max: 5 },
  "cachoeiras-serra-da-bodoquena-com-almoco": { min: 0, max: 5 },
  "eco-serrana-trilhas-e-cachoeiras-com-almoco": { min: 0, max: 5 },
  "fazenda-ceita-core": { min: 0, max: 5 },
  "observacao-de-aves-balneario-no-estrela-do-formoso": { min: 0, max: 6 },
  "parque-das-cachoeiras": { min: 0, max: 5 },
  "praia-da-figueira": { min: 0, max: 5 },
  "projeto-salobra-passeio-encontro-das-aguas": { min: 0, max: 4 },
  "refugio-da-barra": { min: 0, max: 5 },
  "rio-azul-fervedouro": { min: 0, max: 5 },
}

export function resolveInfantFree(tourSlug?: string): InfantFreeConfig | null {
  if (!tourSlug) return null
  return TOUR_INFANT_FREE_BY_SLUG[tourSlug] ?? null
}

export function formatInfantFreeLabel(config: InfantFreeConfig): string {
  return `${config.min} a ${config.max} anos`
}
