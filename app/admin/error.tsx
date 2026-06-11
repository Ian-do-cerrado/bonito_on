"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-10 h-10 shrink-0" />
            <div>
              <h1 className="text-xl font-bold">Erro no painel administrativo</h1>
              <p className="text-sm text-gray-600 mt-1">
                Ocorreu um problema ao carregar a página. Verifique o console do navegador (F12) para mais detalhes.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700 break-words">{error.message}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              Tentar novamente
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/admin/login">Voltar ao login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
