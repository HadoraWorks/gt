import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GT Autodetailing — Ga Bening, Ga Pulang',
    template: '%s | GT Autodetailing',
  },
  description:
    'GT Autodetailing Purwokerto — spesialis detailing kendaraan bermotor dengan pengalaman 10+ tahun. Nano ceramic coating, sealant protection, interior cleaning, dan lebih.',
  keywords: ['detailing mobil', 'ceramic coating', 'purwokerto', 'GT autodetailing', 'poles mobil'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://gtautodetailing.com',
    siteName: 'GT Autodetailing',
    title: 'GT Autodetailing — Ga Bening, Ga Pulang',
    description: 'Spesialis detailing kendaraan bermotor di Purwokerto, Jawa Tengah.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
