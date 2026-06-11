import translate from "translate"

/**
 * Traduz um texto para o idioma selecionado
 * @param text Texto em Português
 * @param to Idioma destino ('en' ou 'es')
 */
export async function translateText(text: string, to: "en" | "es") {
  if (!text || text.trim() === "") return ""
  
  try {
    // Detect if text contains HTML
    const isHtml = /<[a-z][\s\S]*>/i.test(text)
    
    // Explicitly using google engine
    const result = await (translate as any)(text, { 
      from: "pt", 
      to,
      engine: "google",
      type: isHtml ? "html" : "text"
    })
    
    if (!result || result === text) {
      console.warn(`Translation returned original text or empty for ${to}. Engine might be throttled.`)
    }
    
    return result
  } catch (error) {
    console.error(`Erro ao traduzir para ${to}:`, error)
    // Fallback attempt without specifying engine
    try {
      const fallbackResult = await (translate as any)(text, { from: "pt", to })
      return fallbackResult
    } catch (innerError) {
      console.error(`Erro no fallback de tradução para ${to}:`, innerError)
      return text // Final fallback
    }
  }
}

/**
 * Traduz um conjunto de campos (ex: título e descrição)
 */
export async function translateContent(content: { title: string; description: string; subtitle?: string }) {
  const [titleEn, descEn, titleEs, descEs] = await Promise.all([
    translateText(content.title, "en"),
    translateText(content.description, "en"),
    translateText(content.title, "es"),
    translateText(content.description, "es"),
  ])

  let subtitleEn, subtitleEs
  if (content.subtitle) {
    [subtitleEn, subtitleEs] = await Promise.all([
      translateText(content.subtitle, "en"),
      translateText(content.subtitle, "es"),
    ])
  }

  return {
    title_en: titleEn,
    description_en: descEn,
    title_es: titleEs,
    description_es: descEs,
    subtitle_en: subtitleEn,
    subtitle_es: subtitleEs,
  }
}
