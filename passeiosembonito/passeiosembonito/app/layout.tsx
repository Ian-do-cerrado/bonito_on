import type { Metadata } from 'next'
// import { GeistSans } from 'geist/font/sans'
// import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import dynamic from 'next/dynamic'

const ContactModal = dynamic(() => import('@/components/contact-modal').then(mod => mod.ContactModal), { ssr: false });

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ContactModal />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
