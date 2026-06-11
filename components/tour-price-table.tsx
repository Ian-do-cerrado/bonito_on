"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TourPriceInfo } from "@/lib/supabase/price-columns"

interface TourPriceTableProps {
  prices: TourPriceInfo
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return dateStr
  }
}

function formatCurrency(value: number | null): string {
  if (value == null || value <= 0) return "-"
  return `R$ ${value.toFixed(2).replace(".", ",")}`
}

export function TourPriceTable({ prices }: TourPriceTableProps) {
  if (!prices.rows.length) return null

  const hasCrianca = prices.rows.some((r) => r.crianca != null && r.crianca > 0)
  const hasTarifaMs = prices.rows.some((r) => r.tarifaMs != null && r.tarifaMs > 0)

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Preços e Vigência</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Período</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Tabela</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Adulto</th>
                {hasCrianca && (
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Criança</th>
                )}
                {hasTarifaMs && (
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Tarifa MS</th>
                )}
              </tr>
            </thead>
            <tbody>
              {prices.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-700">
                    {formatDate(row.vigInicio)} a {formatDate(row.vigFim)}
                  </td>
                  <td className="py-3 px-2 text-gray-600">{row.nomeTabela || "-"}</td>
                  <td className="text-right py-3 px-2 font-medium text-green-700">
                    {formatCurrency(row.adulto)}
                  </td>
                  {hasCrianca && (
                    <td className="text-right py-3 px-2 text-gray-600">
                      {formatCurrency(row.crianca)}
                    </td>
                  )}
                  {hasTarifaMs && (
                    <td className="text-right py-3 px-2 text-gray-600">
                      {formatCurrency(row.tarifaMs)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
