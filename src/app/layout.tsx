import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FloatingCTA } from '@/components/FloatingCTA'
import { getBusiness, SITE_URL } from '@/lib/site-data'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const business = getBusiness()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  title: {
    default: 'Index Building – Canberra Construction & Renovation',
    template: '%s | Index Building',
  },
  description: 'Index Building is Canberra\'s trusted construction and renovation firm specialising in house construction, shop renovation, flooring installation, and house repairs across the ACT.',
  keywords: ['construction Canberra', 'renovation Canberra', 'house construction ACT', 'shop renovation', 'flooring installation Canberra', 'Index Building'],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE_URL,
    siteName: 'Index Building',
    title: 'Index Building – Canberra Construction & Renovation',
    description: 'Canberra\'s trusted construction and renovation specialists. House construction, shop renovation, flooring, and repairs across the ACT.',
    images: [
      {
        url: '/assets/images/bg_header.jpg',
        width: 1200,
        height: 630,
        alt: 'Index Building – Canberra Construction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Index Building – Canberra Construction & Renovation',
    description: 'Canberra\'s trusted construction and renovation specialists.',
    images: ['/assets/images/bg_header.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        {/* Skip to content – keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-stone-900 focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Navbar />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}
