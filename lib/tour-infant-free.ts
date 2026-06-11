export type InfantFreeConfig = {
  min: number
  max: number
}

/** Passeios com crianças gratuitas em faixa etária inferior à tarifa CHD. */
export const TOUR_INFANT_FREE_BY_SLUG: Record<string, InfantFreeConfig> = {
  "eco-serrana": { min: 0, max: 5 },
  "eco-serrana-trilhas-e-cachoeiras-com-almoco": { min: 0, max: 5 },
}

export function resolveInfantFree(tourSlug?: string): InfantFreeConfig | null {
  if (!tourSlug) return null
  return TOUR_INFANT_FREE_BY_SLUG[tourSlug] ?? null
}

export function formatInfantFreeLabel(config: InfantFreeConfig): string {
  return `${config.min} a ${config.max} anos`
}
