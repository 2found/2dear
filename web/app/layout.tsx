import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import { Providers } from '@/modules/app/providers'
import './globals.css'

// Inter for UI, Newsreader for letter body (docs/2dear/design.md). Playwrite VN
// (greeting/signature only) is added with the letter page.
const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter', display: 'swap' })
const newsreader = Newsreader({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://2dear.app'),
  title: { default: '2dear — Quà biết nói', template: '%s · 2dear' },
  description: 'Gấu bông và thiệp âm thanh kèm bức thư bằng chữ và giọng nói thật.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
