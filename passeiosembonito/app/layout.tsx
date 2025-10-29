import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import { LayoutWrapper } from '@/components/layout-wrapper'
import dynamic from 'next/dynamic'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Bonito ON',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: [{ rel: 'icon', url: '/bonitoon.svg' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans`}>
        {/* Google Tag Manager (Script JS) - Posição correta (próximo ao <head>) */}
        <Script id="google-tag-manager-script" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PTB3VGW');
          `}
        </Script>
        {/* End Google Tag Manager (Script) */}
        
        {/* Google Tag Manager (noscript) - Posição correta (PRIMEIRA COISA dentro do <body>) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PTB3VGW"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* O Client Component LayoutWrapper engloba o resto do app */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}