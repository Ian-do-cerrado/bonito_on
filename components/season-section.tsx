"use client"

import { useState } from "react"
import { Calendar, Sun, CloudRain, TrendingUp, TrendingDown, Info, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

// Definição dos períodos de alta temporada para 2026 (calendário oficial)
const highSeasonPeriods = [
  { start: new Date(2026, 0, 1),  end: new Date(2026, 0, 31),  reason: "schoolHolidays" },    // Jan 01-31: Férias Escolares
  { start: new Date(2026, 1, 14), end: new Date(2026, 1, 18),  reason: "carnival" },           // Fev 14-18: Carnaval
  { start: new Date(2026, 3, 3),  end: new Date(2026, 3, 5),   reason: "easterHoliday" },      // Abr 03-05: Semana Santa
  { start: new Date(2026, 5, 4),  end: new Date(2026, 5, 7),   reason: "corpusChristi" },      // Jun 04-07: Corpus Christi
  { start: new Date(2026, 6, 11), end: new Date(2026, 7, 2),   reason: "schoolHolidays" },     // Jul/Ago 11/07-02/08: Férias Escolares
  { start: new Date(2026, 8, 5),  end: new Date(2026, 8, 7),   reason: "independence" },       // Set 05-07: Independência do Brasil
  { start: new Date(2026, 9, 10), end: new Date(2026, 9, 12),  reason: "nsAparecida" },        // Out 10-12: N. Sra. Aparecida
  { start: new Date(2026, 9, 31), end: new Date(2026, 10, 2),  reason: "finados" },            // Out/Nov 31/10-02/11: Finados
  { start: new Date(2026, 10, 20), end: new Date(2026, 10, 22), reason: "conscienciaNegra" },  // Nov 20-22: Dia da Consciência Negra
  { start: new Date(2026, 11, 19), end: new Date(2026, 11, 31), reason: "schoolHolidays" },    // Dez 19-31: Férias Escolares
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
      case "schoolHolidays":    return "bg-blue-500"
      case "carnival":          return "bg-purple-500"
      case "easterHoliday":     return "bg-yellow-500"
      case "laborDay":          return "bg-red-500"
      case "corpusChristi":     return "bg-green-500"
      case "independence":      return "bg-green-700"
      case "nsAparecida":       return "bg-sky-500"
      case "finados":           return "bg-gray-600"
      case "conscienciaNegra":  return "bg-zinc-800"
      default:                  return "bg-gray-500"
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t("seasonTitle")}</h2>
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
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-700 rounded-full"></div>
                <span className="text-sm">{t("independence")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sky-500 rounded-full"></div>
                <span className="text-sm">{t("nsAparecida")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <span className="text-sm">{t("finados")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-800 rounded-full"></div>
                <span className="text-sm">{t("conscienciaNegra")}</span>
              </div>
            </div>

            {/* Meses do Ano em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, monthIndex) => {
                const year = 2026
                const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
                const firstDayOfMonth = new Date(year, monthIndex, 1).getDay()
                
                const monthNameKeys = [
                  "january", "february", "march", "april", "may", "june",
                  "july", "august", "september", "october", "november", "december"
                ]

                return (
                  <div key={monthIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <h4 className="text-center font-bold text-gray-800 mb-4 capitalize">
                      {t(monthNameKeys[monthIndex])}
                    </h4>
                    
                    {/* Dias da Semana */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {["sunShort", "monShort", "tueShort", "wedShort", "thuShort", "friShort", "satShort"].map((dayKey, i) => (
                        <div key={i} className="text-xs font-semibold text-gray-400">
                          {t(dayKey)}
                        </div>
                      ))}
                    </div>

                    {/* Grade de Dias */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Espaços vazios no início do mês */}
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-8" />
                      ))}
                      
                      {/* Dias do mês */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const date = new Date(year, monthIndex, day)
                        const isHigh = isHighSeason(date)
                        const reason = isHigh ? getHighSeasonReason(date) : null
                        const bgColorClass = isHigh && reason ? getReasonColor(reason) : "bg-gray-100"
                        const textColorClass = isHigh ? "text-white font-semibold shadow-sm" : "text-gray-600"
                        
                        return (
                          <div
                            key={day}
                            className={`h-8 flex items-center justify-center rounded-md text-xs transition-transform hover:scale-110 cursor-default ${bgColorClass} ${textColorClass}`}
                            title={isHigh && reason ? t(reason) : t("lowSeason")}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Lista detalhada das datas de alta temporada (como referência fora dos grids) */}
            <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50/50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {t("highSeasonSummary")} (2026)
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {highSeasonPeriods.map((period, index) => (
                  <li key={index} className="flex items-center gap-3 bg-white p-2 px-3 rounded-lg shadow-sm border border-gray-100">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getReasonColor(period.reason)}`}></div>
                    <span className="text-sm font-medium text-gray-700 w-32">
                      {formatDate(period.start)} a {formatDate(period.end)}
                    </span>
                    <span className="text-sm text-gray-500 truncate">
                      {t(period.reason)}
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
