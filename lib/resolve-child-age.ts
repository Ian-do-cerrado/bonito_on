import {
  formatChildAgeLabel,
  type ChildAgeAges,
  parseChildAgeFromText,
  parsedToAges,
} from "@/lib/child-age-parser"
import { DEFAULT_CHILD_AGES, TOUR_CHILD_AGE_BY_SLUG } from "@/lib/tour-child-ages-data"
import { TOUR_INFANT_FREE_BY_SLUG } from "@/lib/tour-infant-free"
import type { Tour } from "@/types"

type SemesterOverrides = Tour["price_display_overrides"] extends infer T
  ? T extends { s1?: infer S }
    ? S
    : never
  : never

type PriceDisplayOverrides = Tour["price_display_overrides"]

function pickSemesterOverrides(
  priceDisplayOverrides: PriceDisplayOverrides | null | undefined,
  semester: "s1" | "s2"
): SemesterOverrides | null | undefined {
  if (!priceDisplayOverrides) return undefined
  if (semester === "s2") {
    const s2 = priceDisplayOverrides.s2
    if (s2?.ages?.childMin != null) return s2
    return priceDisplayOverrides.s1
  }
  return priceDisplayOverrides.s1
}

/** Resolve idades de criança: override admin (s2→s1) → mapa tarifário → fallback padrão. */
export function resolveChildAges(
  tourSlug: string | undefined,
  priceDisplayOverrides?: PriceDisplayOverrides | null,
  semester: "s1" | "s2" = "s1"
): ChildAgeAges {
  const semesterOverrides = pickSemesterOverrides(priceDisplayOverrides, semester)
  const fromAdmin = semesterOverrides?.ages
  if (fromAdmin?.childMin != null) return fromAdmin

  if (tourSlug && TOUR_CHILD_AGE_BY_SLUG[tourSlug]) {
    return TOUR_CHILD_AGE_BY_SLUG[tourSlug]
  }

  return DEFAULT_CHILD_AGES
}

export function resolveChildAgeLabel(
  tourSlug: string | undefined,
  semesterOverrides?: SemesterOverrides | null
): string {
  if (semesterOverrides?.labels?.crianca) {
    return semesterOverrides.labels.crianca
  }
  // Infantil gratuito em faixa separada (ex.: 0-5 Free) — linha CHD sem repetir idade.
  if (tourSlug && TOUR_INFANT_FREE_BY_SLUG[tourSlug]) {
    return "Criança"
  }
  if (semesterOverrides?.ages?.childMin != null) {
    return formatChildAgeLabel(semesterOverrides.ages)
  }
  const ages = tourSlug && TOUR_CHILD_AGE_BY_SLUG[tourSlug]
    ? TOUR_CHILD_AGE_BY_SLUG[tourSlug]
    : DEFAULT_CHILD_AGES
  return formatChildAgeLabel(ages)
}

/** Tenta inferir idades a partir de texto (descrição do tour). */
export function inferChildAgesFromDescription(description?: string | null): ChildAgeAges | undefined {
  const parsed = parseChildAgeFromText(description)
  return parsed ? parsedToAges(parsed) : undefined
}
