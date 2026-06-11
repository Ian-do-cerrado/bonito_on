import { NextResponse } from "next/server"
import { translateText } from "@/lib/translate-service"

export async function POST(req: Request) {
  try {
    const { text, to } = await req.json()
    
    if (!text || !to) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }
    
    // Suporte para quando 'text' é um array ou objeto
    if (typeof text === 'object' && text !== null) {
      const keys = Object.keys(text)
      const results: Record<string, string> = {}
      
      await Promise.all(
        keys.map(async (key) => {
          results[key] = await translateText(text[key], to)
        })
      )
      
      return NextResponse.json({ results })
    }
    
    const translated = await translateText(text, to)
    return NextResponse.json({ translated })
  } catch (error) {
    console.error("API /api/translate error:", error)
    return NextResponse.json({ 
      error: "Translation failed",
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
