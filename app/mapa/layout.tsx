import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mapa de Bonito",
  description: "Mapa de Bonito, MS — orientação para passeios e atrativos da região.",
  openGraph: {
    title: "Mapa de Bonito | BonitoON",
    description: "Mapa de Bonito, MS para consulta e compartilhamento.",
  },
}

export default function MapaLayout({ children }: { children: React.ReactNode }) {
  return children
}
