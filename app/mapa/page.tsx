"use client"

import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

const MAP_PDF = "/mapa-bonitoon.pdf"

export default function MapaPage() {
  return (
    <SiteLayout>
      <div className="pt-16 min-h-screen bg-gradient-to-b from-green-50/80 to-white flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col flex-1 gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao site
              </Button>
            </Link>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild className="border-green-200">
                <a href={MAP_PDF} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir em nova aba
                </a>
              </Button>
              <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                <a href={MAP_PDF} download="mapa-bonito-bonitoon.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </a>
              </Button>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mapa de Bonito</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Use o mapa abaixo para se orientar na região. Compartilhe este link:{" "}
              <span className="font-medium text-green-700">bonitoon.com.br/mapa</span>
            </p>
          </div>

          <div className="flex-1 min-h-[60vh] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <iframe
              title="Mapa de Bonito"
              src={`${MAP_PDF}#view=FitH`}
              className="w-full h-[calc(100vh-16rem)] min-h-[480px] border-0"
            />
          </div>

          <p className="text-center text-xs text-gray-500 pb-4">
            Se o mapa não carregar no celular, use &quot;Abrir em nova aba&quot; ou &quot;Baixar PDF&quot;.
          </p>
        </div>
      </div>
    </SiteLayout>
  )
}
