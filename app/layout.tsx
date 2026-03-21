import "@styles/globals.css";
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Newsreader, Manrope } from 'next/font/google'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { Toaster } from "sonner";

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

 const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'My blog',
    template: '%s | blog',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'ko-KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ko"
      className={cx(
        'text-black   dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable,
        newsreader.variable,
        manrope.variable
      )}
    >
    <body className="antialiased mx-4 mt-0 lg:mx-auto min-h-screen flex flex-col max-w-2xl has-[.editor-page]:max-w-4xl">
    <main className="min-w-0 mt-2 flex flex-col px-2 md:px-0 flex-1">
      <Navbar />
      {children}
      <Toaster />
    </main>
    <Footer />
    <Analytics />
    <SpeedInsights />
    </body>
    </html>
  )
}
