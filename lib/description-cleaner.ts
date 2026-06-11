/**
 * Remove obsolete price information from tour descriptions.
 * Prices should appear only in the "Preços e Vigência" section.
 */

/** Brazilian currency pattern: R$ 1.234,56 or R$ 123,45 or R$ 1234 */
const PRICE_PATTERN =
  /R\$\s*[\d.,]+(?:\s*(?:por\s+pessoa|pp|cada))?/gi

/** "atividade : R$ X,XX" ou "subtítulo : R$ X,XX." - remove dois pontos e preço */
const PRICE_COLON_PATTERN = /\s*:\s*R\$\s*[\d.,]+\s*\.?/gi

/** Phrases that introduce prices - remove entire phrase including the price */
const PRICE_INTRO_PATTERNS = [
  /\s*a\s+partir\s+de\s*(?:R\$\s*[\d.,]+)?\s*(?:por\s+pessoa)?\s*[.\n]*/gi,
  /\s*valor(?:es)?\s*:?\s*(?:R\$\s*[\d.,]+(?:\s*[-–]\s*R\$\s*[\d.,]+)?)?\s*(?:por\s+pessoa)?\s*[.\n]*/gi,
  /\s*preço(?:s)?\s*:?\s*(?:R\$\s*[\d.,]+(?:\s*[-–]\s*R\$\s*[\d.,]+)?)?\s*(?:por\s+pessoa)?\s*[.\n]*/gi,
  /\s*(?:apenas|somente)\s*R\$\s*[\d.,]+\s*(?:por\s+pessoa)?\s*[.\n]*/gi,
  /\s*(?:custa|custam)\s*R\$\s*[\d.,]+\s*(?:por\s+pessoa)?\s*[.\n]*/gi,
  /\s*(?:valor(?:es)?|preço(?:s)?)\s+é\s+R\$\s*[\d.,]+\s*(?:por\s+pessoa)?\s*[.\n]*/gi,
]

/** Standalone lines that are only price info */
const PRICE_LINE_PATTERN = /^\s*(?:R\$\s*[\d.,]+\s*(?:por\s+pessoa)?|a\s+partir\s+de\s*R\$\s*[\d.,]+)\s*\.?\s*$/gim

/**
 * Remove price-related text from a tour description.
 * Preserves structure (paragraphs, lists) and non-price content.
 */
export function cleanDescriptionPrices(description: string | null): string {
  if (!description || typeof description !== "string") return ""

  let text = description

  // Remove standalone price lines (whole lines that are just prices)
  text = text.replace(PRICE_LINE_PATTERN, "")

  // Remove " : R$ X,XX" (atividade ou subtítulo seguido de preço)
  text = text.replace(PRICE_COLON_PATTERN, ".")

  // Remove price intro phrases (a partir de, valor:, preço:, etc.)
  for (const re of PRICE_INTRO_PATTERNS) {
    text = text.replace(re, " ")
  }

  // Remove remaining R$ X,XX patterns (handles "R$ 997,00" etc.)
  text = text.replace(PRICE_PATTERN, "")

  // Remove orphan " : " (sobrou após remoção de preço, ex: "Atividade : E para...")
  text = text.replace(/\s+:\s+(?=[A-ZÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜ])/g, ". ")

  // Clean up: multiple spaces on the same line, trim but preserve line breaks
  text = text
    .replace(/[ \t]{2,}/g, " ") // Collapse multiple spaces/tabs into one space
    .split("\n")
    .map(line => line.trim()) // Trim each line
    .join("\n")
    .replace(/\n{3,}/g, "\n\n") // Max two consecutive newlines
    .trim()

  return text
}

/**
 * Melhora formatação e legibilidade da descrição, preservando informações importantes.
 */
export function improveDescriptionFormatting(description: string | null): string {
  if (!description || typeof description !== "string") return ""

  let text = cleanDescriptionPrices(description)

  text = text
    .replace(/\s+\.\s*\./g, ".") // " . ." -> "."
    .replace(/\s+\./g, ".") // " ." -> "."
    .replace(/\s+,/g, ",") // " ," -> ","
    .replace(/\s+;/g, ";") // " ;" -> ";"
    .replace(/\.{2,}/g, ".") // ".." -> "."
    .replace(/\s{2,}/g, " ") // múltiplos espaços -> um
    .trim()

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0)

  const improved = paragraphs.map((para) => {
    let p = para.trim()
    if (!p) return ""
    if (p.startsWith("## ") || p.startsWith("### ") || p.startsWith("> ") || p.startsWith("* ") || p.startsWith("- ") || /^\d+\.\s/.test(p)) {
      return p
    }
    const first = p.charAt(0).toUpperCase()
    return first + p.slice(1)
  }).filter(Boolean)

  return improved.join("\n\n")
}
