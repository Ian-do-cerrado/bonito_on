import React from "react"

/**
 * Formata um texto para JSX, suportando:
 * - HTML direto (do novo editor Tiptap)
 * - Markdown legado (##, ###, etc.)
 */
export function formatDescription(text: string) {
  if (!text) return null

  // Se o texto parece ser HTML (novo editor), renderiza diretamente
  const trimmed = text.trim()
  const isHtml = trimmed.startsWith("<") && trimmed.includes(">")

  if (isHtml) {
    return (
      <div 
        className="description-container max-w-none prose prose-green prose-p:leading-relaxed prose-headings:font-bold"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    )
  }

  // Caso contrário, continua com o processamento Markdown legado
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  
  let currentList: { type: "ul" | "ol", items: string[] } | null = null

  const flushList = (key: string | number) => {
    if (!currentList) return null
    const ListTag = currentList.type === "ul" ? "ul" : "ol"
    const list = (
      <ListTag key={`list-${key}`} className={`${currentList.type === "ul" ? "list-disc" : "list-decimal"} pl-6 my-5 space-y-2 text-gray-700 leading-relaxed`}>
        {currentList.items.map((item, i) => (
          <li key={i} className="pl-1">
            <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
          </li>
        ))}
      </ListTag>
    )
    currentList = null
    return list
  }

  function renderInline(t: string) {
    if (!t) return ""
    return t
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-gray-900'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='text-gray-600'>$1</em>")
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    
    // Empty lines act as spacers
    if (trimmedLine === "" && line === "") {
      elements.push(flushList(`gap-${index}`))
      elements.push(<div key={`gap-${index}`} className="h-4" />)
      return
    }

    // Headers (Regex is more robust)
    const h2Match = trimmedLine.match(/^##\s+(.*)/)
    if (h2Match) {
      elements.push(flushList(`header2-${index}`))
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-gray-900 first:mt-0">
          {h2Match[1]}
        </h2>
      )
      return
    }

    const h3Match = trimmedLine.match(/^###\s+(.*)/)
    if (h3Match) {
      elements.push(flushList(`header3-${index}`))
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg sm:text-xl font-semibold mt-6 mb-2 text-gray-800">
          {h3Match[1]}
        </h3>
      )
      return
    }

    // Lists
    const ulMatch = trimmedLine.match(/^[*|-]\s+(.*)/)
    if (ulMatch) {
      if (!currentList || currentList.type !== "ul") {
        elements.push(flushList(`ul-start-${index}`))
        currentList = { type: "ul", items: [] }
      }
      currentList.items.push(ulMatch[1])
      return
    }

    const olMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/)
    if (olMatch) {
      if (!currentList || currentList.type !== "ol") {
        elements.push(flushList(`ol-start-${index}`))
        currentList = { type: "ol", items: [] }
      }
      currentList.items.push(olMatch[2])
      return
    }

    // Blockquotes
    const bqMatch = trimmedLine.match(/^>\s+(.*)/)
    if (bqMatch) {
      elements.push(flushList(`quote-${index}`))
      elements.push(
        <blockquote key={`quote-${index}`} className="border-l-4 border-green-500 pl-5 py-2 my-5 italic text-gray-600 text-lg leading-relaxed bg-green-50/50 -mx-2 px-4 rounded-r">
          <span dangerouslySetInnerHTML={{ __html: renderInline(bqMatch[1]) }} />
        </blockquote>
      )
      return
    }

    // Regular Paragraphs
    elements.push(flushList(`p-${index}`))
    elements.push(
      <p
        key={`p-${index}`}
        className="text-gray-700 leading-relaxed min-h-[1.5em]"
        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
      />
    )
  })

  elements.push(flushList("end"))

  return (
    <div className="description-container max-w-none space-y-1">
      {elements.map((el, i) => (
        <React.Fragment key={i}>
          {el}
        </React.Fragment>
      ))}
    </div>
  )
}

