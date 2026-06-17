"use client"

import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function PoliticaCancelamentoPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <SiteLayout>
      <section className="relative h-72 pt-16 bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <div className="mb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backBtn")}
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">{t("politicaCancelTitle")}</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-2xl leading-relaxed">
              {t("politicaCancelSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Resumo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">{t("politicaCancelSummaryTitle")}</h3>
                </div>
                <p className="text-blue-800 text-sm">{t("politicaCancelSummaryBody")}</p>
              </div>

              {/* Prazos de Cancelamento */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("politicaCancelDeadlinesTitle")}</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-600">{t("politicaCancelFullRefund")}</Badge>
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="font-medium text-green-900">{t("politicaCancelFullRefundLabel")}</p>
                      <p className="text-sm text-green-700">{t("politicaCancelFullRefundDesc")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-yellow-600">{t("politicaCancelPartialRefund")}</Badge>
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="font-medium text-yellow-900">{t("politicaCancelPartialRefundLabel")}</p>
                      <p className="text-sm text-yellow-700">{t("politicaCancelPartialRefundDesc")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-600">{t("politicaCancelNoRefund")}</Badge>
                        <Clock className="w-4 h-4 text-red-600" />
                      </div>
                      <p className="font-medium text-red-900">{t("politicaCancelNoRefundLabel")}</p>
                      <p className="text-sm text-red-700">{t("politicaCancelNoRefundDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Condições Especiais */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("politicaCancelSpecialTitle")}</h2>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">{t("politicaCancelWeatherTitle")}</h4>
                    <p className="text-sm text-gray-700">{t("politicaCancelWeatherBody")}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">{t("politicaCancelMedicalTitle")}</h4>
                    <p className="text-sm text-gray-700">{t("politicaCancelMedicalBody")}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">{t("politicaCancelPromoTitle")}</h4>
                    <p className="text-sm text-gray-700">{t("politicaCancelPromoBody")}</p>
                  </div>
                </div>
              </div>

              {/* Como Cancelar */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("politicaCancelHowTitle")}</h2>

                <div className="space-y-3">
                  {[
                    t("politicaCancelStep1"),
                    t("politicaCancelStep2"),
                    t("politicaCancelStep3"),
                    t("politicaCancelStep4"),
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reembolsos */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("politicaCancelRefundsTitle")}</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• {t("politicaCancelRefundCC")}</li>
                    <li>• {t("politicaCancelRefundDebit")}</li>
                    <li>• {t("politicaCancelRefundPix")}</li>
                    <li>• {t("politicaCancelRefundTransfer")}</li>
                  </ul>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">{t("politicaCancelContactTitle")}</h3>
                <p className="text-green-800 text-sm mb-3">{t("politicaCancelContactBody")}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    WhatsApp: (67) 99139-5384
                  </Button>
                  <Button size="sm" variant="outline">
                    {t("phoneLabel")}: (67) 99139-5384
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
