"use client"

import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TarifarioPage() {
  return (
    <SiteLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Preços para o próximo semestre em breve
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl">
          Estamos atualizando o tarifário com novas experiências e valores. Em breve essa página estará completa!
        </p>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm sm:text-base flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Button>
        </Link>
      </div>
    </SiteLayout>
  )
}
