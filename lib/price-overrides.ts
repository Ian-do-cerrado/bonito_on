/**
 * Suporte a valores manuais nas células de preço (visible_prices).
 *
 * Um override de célula vem após o "#" da chave (ex.: "s1:alta:adulto#<override>").
 * O override pode ser:
 *   - Referência a uma linha BTMS: "<tabela>#<atividade>"
 *   - Valor manual digitado no painel: "__manual__#<valor>"  (ex.: "__manual__#199.9")
 */

export const MANUAL_TABELA = "__manual__"

/** Monta um override de valor manual. */
export function buildManualOverride(value: number | string): string {
  return `${MANUAL_TABELA}#${value}`
}

/**
 * Lê o valor manual de um override, ou null se não for manual / inválido.
 * Aceita string já sem o prefixo da chave (ex.: "__manual__#199.9").
 */
export function parseManualOverride(override: string | null | undefined): number | null {
  if (!override) return null
  const sep = override.indexOf("#")
  if (sep < 0) return null
  if (override.substring(0, sep) !== MANUAL_TABELA) return null
  const n = Number(String(override.substring(sep + 1)).replace(",", "."))
  return Number.isFinite(n) && n > 0 ? n : null
}

/** Indica se o override é um valor manual. */
export function isManualOverride(override: string | null | undefined): boolean {
  return !!override && override.startsWith(MANUAL_TABELA + "#")
}
