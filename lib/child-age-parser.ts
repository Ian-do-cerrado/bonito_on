export type ParsedChildAge =
  | { kind: "range"; childMin: number; childMax: number }
  | { kind: "from"; childMin: number }

/** Normaliza texto para parsing (sem acentos, minúsculas). */
export function normalizeAgeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

/**
 * Extrai faixa etária de criança a partir de texto livre (descrições do tarifário/BTMS).
 * Retorna null se não encontrar padrão reconhecível.
 */
export function parseChildAgeFromText(text: string | null | undefined): ParsedChildAge | null {
  if (!text?.trim()) return null
  const t = normalizeAgeText(text)

  const fromPatterns = [
    /crianc[a-z]*\s*(?:a\s*)?partir\s*de\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*\+\s*(\d{1,2})\s*anos?/,
    /crianc[a-z]*\s*de\s*(\d{1,2})\s*anos?\s*(?:ou\s*mais|em\s*diante)/,
    /(?:adulto\s*e\s*)?crianc[a-z]*\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
    /crianca\s*a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
    /idade\s*minima[:\s]+(\d{1,2})\s*anos?\s*de\s*idade/,
    /garupas?\s*(?:sao\s*)?(?:permitidas\s*)?a\s*partir\s*de\s*(\d{1,2})\s*anos?/,
  ]
  for (const re of fromPatterns) {
    const m = t.match(re)
    if (m) return { kind: "from", childMin: parseInt(m[1], 10) }
  }

  const rangePatterns = [
    /crianc[a-z]*\s*(?:de\s*)?(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?(?!\s*:?\s*free)/,
    /crianc[a-z]*\s*(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*ano\b(?!\s*:?\s*free)/,
    /(\d{1,2})\s*(?:a|ate|-)\s*(\d{1,2})\s*anos?\s*(?:\(|\/)?\s*crianc/,
  ]
  for (const re of rangePatterns) {
    const m = t.match(re)
    if (m) {
      const childMin = parseInt(m[1], 10)
      const childMax = parseInt(m[2], 10)
      if (childMin <= childMax) return { kind: "range", childMin, childMax }
    }
  }

  return null
}

export type ChildAgeAges = {
  childMin?: number
  childMax?: number | null
}

export function parsedToAges(parsed: ParsedChildAge): ChildAgeAges {
  if (parsed.kind === "range") {
    return { childMin: parsed.childMin, childMax: parsed.childMax }
  }
  return { childMin: parsed.childMin, childMax: null }
}

/** Label exibido na tabela de preços para a linha de criança. */
export function formatChildAgeLabel(ages?: ChildAgeAges | null, fallback = "Crianças (5-12 anos)"): string {
  if (!ages?.childMin && ages?.childMin !== 0) return fallback
  const min = ages.childMin
  if (ages.childMax == null) return `Crianças (a partir de ${min} anos)`
  if (typeof ages.childMax === "number") return `Criança de ${min} a ${ages.childMax} anos`
  return fallback
}
