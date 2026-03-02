import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FloatingCTA } from '@/components/FloatingCTA'
import { getBusiness, getHomePage, SITE_URL } from '@/lib/site-data'

// Inter — closest open-source match to SF Pro; system SF Pro used on Apple devices via CSS stack
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const business = getBusiness()
const home = getHomePage()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/assets/www/favicons/c1c06370-cf95-4c6d-b198-4a53ae585e94/favicon-32x32.png',
    shortcut: '/assets/www/favicons/c1c06370-cf95-4c6d-b198-4a53ae585e94/favicon-32x32.png',
    apple: '/assets/www/favicons/c1c06370-cf95-4c6d-b198-4a53ae585e94/favicon-180x180.png',
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
        url: home.heroImage || '/assets/www/favicons/c1c06370-cf95-4c6d-b198-4a53ae585e94/favicon-180x180.png',
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
    images: [home.heroImage || '/assets/www/favicons/c1c06370-cf95-4c6d-b198-4a53ae585e94/favicon-180x180.png'],
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
    <html lang="en-AU" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        {/* Skip to content – keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-warm-900 focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Navbar />
        <main className="flex-1 pt-14" id="main-content">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}
