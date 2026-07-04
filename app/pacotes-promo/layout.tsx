import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS",
  description:
    "Roteiros prontos para Bonito/MS com flutuações, cachoeiras e grutas. Escolha entre pacotes de 2, 3 ou 4 dias e fale com um especialista pelo WhatsApp.",
  openGraph: {
    title: "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS",
    description:
      "Conheça Bonito do jeito mais completo possível. Pacotes prontos, atendimento especializado, melhores atrações.",
    type: "website",
    images: ["/pacotes-promo/logo.svg"],
  },
  twitter: { card: "summary_large_image", title: "Bonito ON | Pacotes de 2, 3 e 4 dias em Bonito/MS" },
};

export default function PacotesPromoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
