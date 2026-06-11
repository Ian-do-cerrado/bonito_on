/**
 * Mapeamento de nomes de tabelas de preço para descrições amigáveis.
 * Regras aplicadas em ORDEM DE PRIORIDADE (mais específico primeiro).
 * Para adicionar um novo mapeamento, insira ANTES das entradas genéricas (BT, MS...).
 *
 * REGRA GERAL:
 *  - Tabelas com "SUL MATO" / "SUL-MATO" → Sul-mato-grossense Baixa temporada
 *  - Tabelas com "BONITENSE"             → Bonitense
 *  - Tabelas com "GRUPO" / "GP"          → Grupo +15 pessoas
 *  - Tabelas com "OPERADORA"             → Operadora (para uso B2B; ocultar por padrão)
 *  - Tabelas com "BT"                    → Baixa Temporada
 *  - Tabelas com "BAIXA"                 → Baixa Temporada
 *  - Tabelas com "MS"                    → Sul-mato-grossense
 *  - Demais sem BT/MS                    → Alta Temporada (ver getFriendlyTableName)
 */

const TABLE_NAME_MAP: Record<string, string> = {
  // Sul-mato-grossense (mais específico que BT ou MS isolados)
  "SUL MATO": "Sul-mato-grossense Baixa temporada",
  "SUL-MATO": "Sul-mato-grossense Baixa temporada",
  "BT MS": "Sul-mato-grossense Baixa temporada",
  "TAB BT MS": "Sul-mato-grossense Baixa temporada",

  // Grupo — mais específico primeiro
  "ACIMA DE 30": "Grupo +30 pessoas",
  "ACIMA 30": "Grupo +30 pessoas",
  GRUPO: "Grupo +15 pessoas",
  GP: "Grupo +15 pessoas",

  // Baixa temporada
  BT: "Baixa Temporada",
  BAIXA: "Baixa Temporada",

  // Sul-mato-grossense sem BT
  MS: "Sul-mato-grossense",

  // Bonitense
  BONITENSE: "Bonitense",

  // Extensível: idoso, estudante, combo, operadora, etc.
}

/**
 * Retorna o nome amigável da tabela de preço.
 * Preserva qualificadores como MS, Melhor Idade, Grupo, etc.
 * 
 * @param raw Nome original da tabela no banco
 * @param temporadaBD Valor da coluna 'temporada' no banco (AT/BT)
 */
export function getFriendlyTableName(raw: string, temporadaBD?: string | null): string {
  const upper = (raw ?? "").toUpperCase().trim()
  if (!upper && !temporadaBD) return "Preço padrão"

  // 1. Identificar Temporada (Prioridade: Coluna do Banco > String Matching)
  let seasonLabel = "Alta Temporada"
  
  if (temporadaBD === "BT") {
    seasonLabel = "Baixa Temporada"
  } else if (temporadaBD === "AT") {
    seasonLabel = "Alta Temporada"
  } else {
    // Fallback: Matching com regex de palavra inteira para evitar falsos positivos como "MATO" -> "AT"
    const isBaixa = /\bBT\b|\bBAIXA\b/i.test(upper)
    const isAlta = /\bAT\b|\bALTA\b/i.test(upper)
    
    if (isBaixa) {
      seasonLabel = "Baixa Temporada"
    } else if (isAlta) {
      seasonLabel = "Alta Temporada"
    }
  }

  // 2. Identificar Público/Categoria
  const tags: string[] = []
  
  if (upper.includes("MS") || upper.includes("SUL-MATO") || upper.includes("SUL MATO")) {
    tags.push("Sul-mato-grossense")
  }
  
  if (upper.includes("BONITENSE")) {
    tags.push("Bonitense")
  }
  
  if (upper.includes("GRUPO") || upper.includes("GP")) {
    if (upper.includes("30")) tags.push("Grupo +30 pessoas")
    else tags.push("Grupo +15 pessoas")
  }
  
  if (upper.includes("MELHOR IDADE") || upper.includes("SENIOR") || upper.includes("IDOSO") || upper.includes("60")) {
    tags.push("Melhor Idade")
  }
  
  if (upper.includes("ESTUDANTE")) {
    tags.push("Estudante")
  }
  
  if (upper.includes("PROMO")) {
    tags.push("Promocional")
  }

  // 3. Montar rótulo final
  if (tags.length > 0) {
    return `${tags.join(" / ")} · ${seasonLabel}`
  }

  // Fallback para mapeamento legado se houver algum match específico que escapou acima
  for (const [key, label] of Object.entries(TABLE_NAME_MAP)) {
    if (upper.includes(key)) return label
  }

  return seasonLabel
}
