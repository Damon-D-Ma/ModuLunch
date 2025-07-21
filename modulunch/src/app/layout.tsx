import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/app/components/navbar' 

export const metadata: Metadata = {
  title: 'ModuLunch',
  description: 'Find friends to have lunch with',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
