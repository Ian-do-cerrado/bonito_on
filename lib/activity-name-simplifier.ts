/**
 * Simplificador de nomes de atividades vindos do sistema BTMS.
 * Transforma nomes técnicos e abreviados em nomes amigáveis para o usuário.
 */

export function simplifyActivityName(rawName: string | null | undefined, tourTitle?: string): string {
  if (!rawName) return "Atividade"

  let name = rawName.trim().toUpperCase()

  // 1. Mapeamentos específicos de termos comuns
  const mappings: Record<string, string> = {
    "BALNEÁRIO DAY USE": "Balneário",
    "BALNEÁRIO E DAY USE": "Balneário",
    "BALNEÁRIO": "Balneário",
    "DAY USE ADVENTURE": "Adventure",
    "ADVENTURE": "Adventure",
    "FLUTUAÇÃO": "Flutuação",
    "FLUTUACAO": "Flutuação",
    "CONTEMPLAÇÃO": "Contemplação",
    "CONTEMPLACAO": "Contemplação",
    "BATISMO": "Mergulho de Batismo",
    "CERTIFICADO": "Mergulho Certificado",
    "DIVE": "Mergulho",
    "TECH": "Mergulho Tech",
  }

  // 2. Limpeza de termos técnicos e metragens
  // Remove "08 MTS", "18M", "47MTS", "77MTS" etc.
  name = name.replace(/\d+\s*MTS?/g, "")
  name = name.replace(/\d+\s*METROS/g, "")
  
  // Remove menções redundantes ao nome do atrativo (ex: "Abismo Contemplação" -> "Contemplação")
  if (tourTitle) {
    const tourWords = tourTitle.toUpperCase().split(" ").filter(w => w.length > 3)
    for (const word of tourWords) {
      if (name.includes(word) && name !== word) {
        name = name.replace(word, "").trim()
      }
    }
  }

  // Se o nome ficou vazio depois de remover o título do tour, restaura o original para não ficar estranho
  if (!name || name.length < 2) {
    name = rawName.toUpperCase()
  }

  // 3. Aplica mapeamentos se houver match em substrings
  for (const [key, label] of Object.entries(mappings)) {
    if (name.includes(key)) {
      // Se for uma string curta ou um match exato, retorna o label
      if (name.length < key.length + 5) return label
    }
  }

  // 4. Conversão para Title Case para melhor leitura se não houver mapeamento
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim() || "Atividade"
}
