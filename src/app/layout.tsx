import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Providers} from "./providers";
import TopNavbar from '@/components/TopNavBar'
import BottomBar from '@/components/BottomBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jason Test Next.JS on GitHub Pages App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
      <div className="h-screen w-screen">
        <TopNavbar />
        {children}
        <BottomBar />
      </div>
      </Providers>
      </body>
    </html>
  )
}