"use client"

import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermosUsoPage() {
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
              <CardTitle className="text-3xl font-bold text-gray-900">Termos de Uso</CardTitle>
              <p className="text-gray-600">Última atualização: Janeiro de 2024</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao utilizar os serviços da BonitoON, você concorda com estes termos de uso. Se não concordar, não
                utilize nossos serviços.
              </p>

              <h2>2. Serviços Oferecidos</h2>
              <p>A BonitoON oferece serviços de turismo em Bonito, MS, incluindo:</p>
              <ul>
                <li>Organização de passeios e excursões</li>
                <li>Reservas de hospedagem</li>
                <li>Serviços de transporte</li>
                <li>Consultoria em turismo</li>
              </ul>

              <h2>3. Reservas e Pagamentos</h2>
              <p>
                As reservas estão sujeitas à disponibilidade. Os preços podem variar conforme a temporada. O pagamento
                deve ser realizado conforme as condições acordadas.
              </p>

              <h2>4. Cancelamentos</h2>
              <p>
                Cancelamentos devem ser comunicados com antecedência mínima de 48 horas. Consulte nossa política de
                cancelamento para detalhes sobre reembolsos.
              </p>

              <h2>5. Responsabilidades</h2>
              <p>
                A BonitoON se compromete a fornecer serviços de qualidade, mas não se responsabiliza por fatores
                externos como condições climáticas ou problemas de terceiros.
              </p>

              <h2>6. Propriedade Intelectual</h2>
              <p>Todo o conteúdo deste site é propriedade da BonitoON e está protegido por direitos autorais.</p>

              <h2>7. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                imediatamente após a publicação.
              </p>

              <h2>8. Contato</h2>
              <p>
                Para dúvidas sobre estes termos:
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
