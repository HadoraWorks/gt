'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#testimoni', label: 'Testimoni' },
  { href: '#blog', label: 'Blog' },
  { href: '#kontak', label: 'Kontak' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { appUser } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dashboardHref = appUser?.role === 'admin' ? '/admin' : '/employee'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="GT Autodetailing — Beranda"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-sm">
              GT
            </div>
            <span className={`font-black text-lg tracking-tight hidden sm:block transition-colors ${scrolled ? 'text-slate-800' : 'text-white'}`}>
              GT Autodetailing
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {appUser ? (
              <Link
                href={dashboardHref}
                className="px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  scrolled
                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                    : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 max-w-full bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-black text-slate-800">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <ul className="flex flex-col p-4 gap-1 flex-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-slate-200">
              {appUser ? (
                <Link
                  href={dashboardHref}
                  className="block w-full text-center px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
