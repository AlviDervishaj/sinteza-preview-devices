import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sinteza Preview Devices',
  description: 'Sinteza project to preview connected devices and their respective processes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{backgroundColor: "#dee2e6"}}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
