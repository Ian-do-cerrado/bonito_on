"use client"

import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PoliticaPrivacidadePage() {
  return (
    <SiteLayout>
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">Política de Privacidade</CardTitle>
              <p className="text-gray-600">Última atualização: Janeiro de 2024</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2>1. Informações que Coletamos</h2>
              <p>
                A BonitoON coleta informações que você nos fornece diretamente, como nome, e-mail, telefone e
                preferências de viagem quando você entra em contato conosco ou faz uma reserva.
              </p>

              <h2>2. Como Usamos suas Informações</h2>
              <p>Utilizamos suas informações para:</p>
              <ul>
                <li>Processar suas reservas e fornecer nossos serviços</li>
                <li>Entrar em contato sobre sua viagem</li>
                <li>Enviar informações sobre ofertas e novidades (com seu consentimento)</li>
                <li>Melhorar nossos serviços</li>
              </ul>

              <h2>3. Compartilhamento de Informações</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando
                necessário para fornecer nossos serviços ou quando exigido por lei.
              </p>

              <h2>4. Segurança</h2>
              <p>
                Implementamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não
                autorizado, alteração, divulgação ou destruição.
              </p>

              <h2>5. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco
                para exercer esses direitos.
              </p>

              <h2>6. Contato</h2>
              <p>
                Para questões sobre esta política, entre em contato:
                <br />
                E-mail: contato@bonitoon.com.br
                <br />
                Telefone: (67) 99139-5384
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  )
}
