"use client"

import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function PoliticaCancelamentoPage() {
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
              <CardTitle className="text-3xl font-bold text-gray-900">Política de Cancelamento</CardTitle>
              <p className="text-gray-600">Condições para cancelamento de reservas</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Resumo da Política</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  Oferecemos cancelamento gratuito até 48 horas antes do passeio. Cancelamentos com menos antecedência
                  estão sujeitos a taxas.
                </p>
              </div>

              {/* Prazos de Cancelamento */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prazos de Cancelamento</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-600">Reembolso Total</Badge>
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="font-medium text-green-900">Cancelamento com 48h+ de antecedência</p>
                      <p className="text-sm text-green-700">100% do valor pago será reembolsado</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-yellow-600">Reembolso Parcial</Badge>
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="font-medium text-yellow-900">Cancelamento entre 24h e 48h</p>
                      <p className="text-sm text-yellow-700">50% do valor pago será reembolsado</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-600">Sem Reembolso</Badge>
                        <Clock className="w-4 h-4 text-red-600" />
                      </div>
                      <p className="font-medium text-red-900">Cancelamento com menos de 24h</p>
                      <p className="text-sm text-red-700">Não há reembolso do valor pago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Condições Especiais */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Condições Especiais</h2>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Condições Climáticas</h4>
                    <p className="text-sm text-gray-700">
                      Em caso de cancelamento por condições climáticas adversas, oferecemos reagendamento gratuito ou
                      reembolso total.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Emergências Médicas</h4>
                    <p className="text-sm text-gray-700">
                      Cancelamentos por emergências médicas (com comprovação) têm reembolso total, independente do
                      prazo.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Pacotes Promocionais</h4>
                    <p className="text-sm text-gray-700">
                      Pacotes com desconto especial podem ter condições de cancelamento diferenciadas. Consulte as
                      condições específicas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Como Cancelar */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Como Cancelar</h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <p className="text-gray-700">Entre em contato via WhatsApp: (67) 99999-9999</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p className="text-gray-700">Ou ligue para: (67) 99139-5384</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <p className="text-gray-700">Informe seu nome e número da reserva</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <p className="text-gray-700">Receba a confirmação do cancelamento por e-mail</p>
                  </div>
                </div>
              </div>

              {/* Reembolsos */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Processamento de Reembolsos</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Cartão de crédito: até 2 faturas</li>
                    <li>• Cartão de débito: até 5 dias úteis</li>
                    <li>• PIX: até 1 dia útil</li>
                    <li>• Transferência bancária: até 3 dias úteis</li>
                  </ul>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Dúvidas sobre Cancelamento?</h3>
                <p className="text-green-800 text-sm mb-3">
                  Nossa equipe está pronta para ajudar com seu cancelamento ou reagendamento.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    WhatsApp: (67) 99999-9999
                  </Button>
                  <Button size="sm" variant="outline">
                    Telefone: (67) 99139-5384
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  )
}
