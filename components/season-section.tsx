"use client"

import { useState } from "react"
import { Calendar, Sun, CloudRain, TrendingUp, TrendingDown, Info, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

// Definição dos períodos de alta temporada para 2025
const highSeasonPeriods = [
  { start: new Date(2025, 0, 1), end: new Date(2025, 0, 31), reason: "schoolHolidays" }, // Janeiro: 1 a 31 (Férias Escolares)
  { start: new Date(2025, 2, 1), end: new Date(2025, 2, 5), reason: "carnival" }, // Março: 1 a 5 (Carnaval)
  { start: new Date(2025, 3, 18), end: new Date(2025, 3, 21), reason: "easterHoliday" }, // Abril: 18 a 21 (Semana Santa/Páscoa + Tiradentes)
  { start: new Date(2025, 4, 1), end: new Date(2025, 4, 4), reason: "laborDay" }, // Maio: 1 a 4 (Dia do Trabalho)
  { start: new Date(2025, 5, 19), end: new Date(2025, 5, 22), reason: "corpusChristi" }, // Junho: 19 a 22 (Corpus Christi)
  { start: new Date(2025, 6, 5), end: new Date(2025, 7, 3), reason: "schoolHolidays" }, // Julho/Agosto: 5/07 a 3/08 (Férias Escolares)
  { start: new Date(2025, 11, 13), end: new Date(2025, 11, 31), reason: "schoolHolidays" }, // Dezembro: 13 a 31 (Férias Escolares)
]

// Função para verificar se uma data está em alta temporada
const isHighSeason = (date: Date) => {
  return highSeasonPeriods.some((period) => date >= period.start && date <= period.end)
}

// Função para obter o motivo da alta temporada
const getHighSeasonReason = (date: Date) => {
  const period = highSeasonPeriods.find((period) => date >= period.start && date <= period.end)
  return period?.reason || null
}

export function SeasonSection() {
  const { t } = useLanguage()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Função para detectar a temporada atual
  const getCurrentSeason = () => {
    const now = new Date()
    const isHigh = isHighSeason(now)
    const reasonKey = isHigh ? getHighSeasonReason(now) : null

    return {
      isHigh,
      name: isHigh ? t("highSeason") : t("lowSeason"),
      period: isHigh ? t("highSeasonPeriod") : t("lowSeasonPeriod"),
      description: isHigh ? t("highSeasonDesc") : t("lowSeasonDesc"),
      advantages: isHigh ? t("highSeasonAdvantages") : t("lowSeasonAdvantages"),
      considerations: isHigh ? t("highSeasonConsiderations") : t("lowSeasonConsiderations"),
      icon: isHigh ? Sun : CloudRain,
      color: isHigh ? "bg-orange-500" : "bg-blue-500",
      trend: isHigh ? TrendingUp : TrendingDown,
      reason: reasonKey ? t(reasonKey) : null,
    }
  }

  const season = getCurrentSeason()
  const Icon = season.icon
  const TrendIcon = season.trend

  // Função para formatar data como DD/MM
  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  // Função para obter a cor do motivo da alta temporada
  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "schoolHolidays":
        return "bg-blue-500"
      case "carnival":
        return "bg-purple-500"
      case "easterHoliday":
        return "bg-yellow-500"
      case "laborDay":
        return "bg-red-500"
      case "corpusChristi":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#1e2c1e] via-[#264c33] to-[#1a3b29]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-8 w-8 text-white" />
            <h2 className="text-3xl font-bold text-white">{t("seasonTitle")}</h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-0">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Lado esquerdo - Informações da temporada */}
                <div className="p-8 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-full ${season.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge variant={season.isHigh ? "default" : "secondary"} className="mb-2">
                        <TrendIcon className="h-3 w-3 mr-1" />
                        {season.name}
                      </Badge>
                      <p className="text-sm text-gray-600">{season.period}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{season.description}</p>

                  <Button
                    onClick={() => setIsCalendarOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    {t("planYourTrip")}
                  </Button>
                </div>

                {/* Lado direito - Vantagens e Considerações */}
                <div className="p-8 bg-gray-50">
                  <div className="space-y-6">
                    {/* Vantagens */}
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {t("advantages")}
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        {season.advantages.split("\n").map((advantage, index) => (
                          <p key={index} className="leading-relaxed">
                            {advantage}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Considerações */}
                    <div>
                      <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-600" />
                        {t("considerations")}
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        {season.considerations.split("\n").map((consideration, index) => (
                          <p key={index} className="leading-relaxed">
                            {consideration}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal do Calendário de Temporadas */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              {t("seasonCalendar")}
            </DialogTitle>
          </DialogHeader>

          <div className="p-4">
            {/* Legenda */}
            <div className="mb-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">{t("schoolHolidays")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm">{t("carnival")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">{t("easterHoliday")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm">{t("laborDay")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">{t("corpusChristi")}</span>
              </div>
            </div>

            {/* Diagrama de temporadas */}
            <div className="space-y-6">
              {/* Primeiro Semestre */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-center">{t("firstSemester")}</h4>
                <div className="overflow-x-auto">
                  <div className="min-w-[400px]">
                    <div className="grid grid-cols-6 gap-1">
                      {/* Cabeçalho dos meses - Primeiro Semestre */}
                      {["january", "february", "march", "april", "may", "june"].map((month, index) => (
                        <div key={month} className="text-center font-semibold p-2 bg-gray-100 rounded-t-lg">
                          {t(month)}
                        </div>
                      ))}

                      {/* Diagrama visual - Primeiro Semestre */}
                      {Array.from({ length: 6 }).map((_, monthIndex) => {
                        // Criar um array de dias para o mês atual
                        const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate()
                        const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

                        // Verificar quais dias estão em alta temporada
                        const highSeasonDays = monthDays.filter((day) => {
                          const date = new Date(2025, monthIndex, day)
                          return isHighSeason(date)
                        })

                        // Calcular a porcentagem de dias em alta temporada
                        const highSeasonPercentage = (highSeasonDays.length / daysInMonth) * 100

                        // Determinar o motivo principal da alta temporada (se houver)
                        let mainReason = null
                        if (highSeasonDays.length > 0) {
                          const reasons = highSeasonDays.map((day) => {
                            const date = new Date(2025, monthIndex, day)
                            return getHighSeasonReason(date)
                          })

                          // Encontrar o motivo mais comum
                          const reasonCounts = reasons.reduce(
                            (acc, reason) => {
                              if (reason) {
                                acc[reason] = (acc[reason] || 0) + 1
                              }
                              return acc
                            },
                            {} as Record<string, number>,
                          )

                          mainReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
                        }

                        return (
                          <div key={monthIndex} className="relative h-20 bg-gray-100 p-2">
                            {highSeasonDays.length > 0 ? (
                              <>
                                <div
                                  className={`absolute bottom-0 left-0 ${getReasonColor(mainReason || "")} h-full`}
                                  style={{ width: `${highSeasonPercentage}%` }}
                                ></div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                  <div className="text-xs font-semibold text-white">
                                    {highSeasonDays.length > 0 && (
                                      <span className="bg-black/50 px-1 py-0.5 rounded">
                                        {formatDate(new Date(2025, monthIndex, highSeasonDays[0]))} -
                                        {formatDate(
                                          new Date(2025, monthIndex, highSeasonDays[highSeasonDays.length - 1]),
                                        )}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-white">
                                    {mainReason && (
                                      <span className="bg-black/50 px-1 py-0.5 rounded">{t(mainReason)}</span>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-xs text-gray-500">{t("lowSeason")}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Segundo Semestre */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-center">{t("secondSemester")}</h4>
                <div className="overflow-x-auto">
                  <div className="min-w-[400px]">
                    <div className="grid grid-cols-6 gap-1">
                      {/* Cabeçalho dos meses - Segundo Semestre */}
                      {["july", "august", "september", "october", "november", "december"].map((month, index) => (
                        <div key={month} className="text-center font-semibold p-2 bg-gray-100 rounded-t-lg">
                          {t(month)}
                        </div>
                      ))}

                      {/* Diagrama visual - Segundo Semestre */}
                      {Array.from({ length: 6 }).map((_, monthIndex) => {
                        const actualMonthIndex = monthIndex + 6 // Ajustar para julho-dezembro

                        // Criar um array de dias para o mês atual
                        const daysInMonth = new Date(2025, actualMonthIndex + 1, 0).getDate()
                        const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

                        // Verificar quais dias estão em alta temporada
                        const highSeasonDays = monthDays.filter((day) => {
                          const date = new Date(2025, actualMonthIndex, day)
                          return isHighSeason(date)
                        })

                        // Calcular a porcentagem de dias em alta temporada
                        const highSeasonPercentage = (highSeasonDays.length / daysInMonth) * 100

                        // Determinar o motivo principal da alta temporada (se houver)
                        let mainReason = null
                        if (highSeasonDays.length > 0) {
                          const reasons = highSeasonDays.map((day) => {
                            const date = new Date(2025, actualMonthIndex, day)
                            return getHighSeasonReason(date)
                          })

                          // Encontrar o motivo mais comum
                          const reasonCounts = reasons.reduce(
                            (acc, reason) => {
                              if (reason) {
                                acc[reason] = (acc[reason] || 0) + 1
                              }
                              return acc
                            },
                            {} as Record<string, number>,
                          )

                          mainReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
                        }

                        return (
                          <div key={actualMonthIndex} className="relative h-20 bg-gray-100 p-2">
                            {highSeasonDays.length > 0 ? (
                              <>
                                <div
                                  className={`absolute bottom-0 left-0 ${getReasonColor(mainReason || "")} h-full`}
                                  style={{ width: `${highSeasonPercentage}%` }}
                                ></div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                  <div className="text-xs font-semibold text-white">
                                    {highSeasonDays.length > 0 && (
                                      <span className="bg-black/50 px-1 py-0.5 rounded">
                                        {formatDate(new Date(2025, actualMonthIndex, highSeasonDays[0]))} -
                                        {formatDate(
                                          new Date(2025, actualMonthIndex, highSeasonDays[highSeasonDays.length - 1]),
                                        )}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-white">
                                    {mainReason && (
                                      <span className="bg-black/50 px-1 py-0.5 rounded">{t(mainReason)}</span>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-xs text-gray-500">{t("lowSeason")}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista detalhada de períodos */}
            <div className="mt-8 space-y-2">
              <h3 className="font-semibold text-lg">{t("highSeason")} 2025:</h3>
              <ul className="space-y-2">
                {highSeasonPeriods.map((period, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getReasonColor(period.reason)}`}></div>
                    <span>
                      {formatDate(period.start)} - {formatDate(period.end)}: {t(period.reason)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  {t("closeCalendar")}
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
