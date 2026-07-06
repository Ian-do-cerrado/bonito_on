import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bonito ON | Pacotes de 2 a 5 dias em Bonito/MS",
  description:
    "Roteiros prontos para Bonito/MS com flutuações, cachoeiras e grutas. Escolha entre pacotes de 2 a 5 dias e fale com um especialista pelo WhatsApp.",
  openGraph: {
    title: "Bonito ON | Pacotes de 2 a 5 dias em Bonito/MS",
    description:
      "Conheça Bonito do jeito mais completo possível. Pacotes prontos, atendimento especializado, melhores atrações.",
    type: "website",
    images: [
      {
        url: "/pacotes-promo/rio-da-prata-3.jpg",
        width: 800,
        height: 400,
        alt: "Rio da Prata em Bonito/MS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonito ON | Pacotes de 2 a 5 dias em Bonito/MS",
    images: ["/pacotes-promo/rio-da-prata-3.jpg"],
  },
};

export default function PacotesPromoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
