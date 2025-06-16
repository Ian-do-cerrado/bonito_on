import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "BonitoON - Turismo em Bonito MS",
    template: "%s | BonitoON",
  },
  description: "Descubra os melhores passeios, gastronomia e hospedagens em Bonito, Mato Grosso do Sul",
  keywords: ["bonito ms", "turismo", "passeios", "ecoturismo", "pantanal", "mato grosso do sul"],
  authors: [{ name: "BonitoON Turismo" }],
  creator: "BonitoON Turismo",
  publisher: "BonitoON Turismo",
  robots: "index, follow",
  metadataBase: new URL("https://bonitoon.com.br"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/pt-BR",
      "en-US": "/en-US",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://bonitoon.com.br",
    title: "BonitoON - Turismo em Bonito MS",
    description: "Descubra os melhores passeios, gastronomia e hospedagens em Bonito, Mato Grosso do Sul",
    siteName: "BonitoON",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BonitoON - Turismo em Bonito MS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BonitoON - Turismo em Bonito MS",
    description: "Descubra os melhores passeios, gastronomia e hospedagens em Bonito, Mato Grosso do Sul",
    images: ["/images/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};