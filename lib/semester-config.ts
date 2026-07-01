/**
 * Governança de semestre no site.
 *
 * - S2 (2º semestre BTMS): vigente no site público hoje.
 * - S1 (1º semestre): valores futuros, vigência BTMS a partir de jan/2027.
 *   Editável no admin; não substitui S2 no site até decisão manual futura.
 */

/** Início da vigência dos valores futuros (S1) nas tabelas BTMS — não é troca de semestre vigente no site. */
export const S1_FUTURE_VALIDITY_START = "2027-01-01"

/** @deprecated Use S1_FUTURE_VALIDITY_START */
export const S1_PUBLIC_ACTIVE_FROM = S1_FUTURE_VALIDITY_START

/** Corte BTMS para separar tabelas S1/S2 no sync (refresh_btms_semester_tables). */
export const DEFAULT_SEMESTER_SPLIT_DATE =
  process.env.NEXT_PUBLIC_SEMESTER_SPLIT_DATE ?? S1_FUTURE_VALIDITY_START

/** Semestre padrão no site público: true = S2 (vigente). */
export const PUBLIC_DEFAULT_PREFER_S2 = true

/** S1 nunca é o semestre vigente no site público (só valores futuros no admin). */
export function isS1PublicEnabled(): boolean {
  return false
}

/** Resolve semestre para páginas públicas — site sempre exibe S2 (vigente); ?semester=1 não troca para S1. */
export function resolvePreferNextSemesterPublic(semesterParam: string | null | undefined): boolean {
  if (semesterParam === "1") return true
  if (semesterParam === "2") return true
  return PUBLIC_DEFAULT_PREFER_S2
}

/** Resolve semestre para API/admin (?semester=1|2 explícito sempre respeitado). */
export function resolvePreferNextSemester(semesterParam: string | null | undefined): boolean {
  if (semesterParam === "1") return false
  if (semesterParam === "2") return true
  return PUBLIC_DEFAULT_PREFER_S2
}

/** Query string para links de passeio (?semester=…) — omitido quando é o padrão público. */
export function semesterLinkQuery(preferNextSemester: boolean): string {
  const isDefault = preferNextSemester === PUBLIC_DEFAULT_PREFER_S2
  if (isDefault) return ""
  return preferNextSemester ? "?semester=2" : "?semester=1"
}

export function getPublicActiveSemesterKey(): "s1" | "s2" {
  return PUBLIC_DEFAULT_PREFER_S2 ? "s2" : "s1"
}

export const S1_FUTURE_LABEL = "Valores futuros — 1º semestre (vig. jan/2027)"
export const S2_CURRENT_LABEL = "2º semestre (vigente no site)"
