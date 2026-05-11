'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import type { Portfolio } from '@/types'

const categories: { value: Portfolio['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'daily', label: 'Kendaraan Harian' },
  { value: 'showroom', label: 'Showroom' },
  { value: 'contest', label: 'Kontes' },
  { value: 'dealer', label: 'Dealer' },
]

interface PortfolioSectionProps {
  items: Portfolio[]
}

export function PortfolioSection({ items }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Portfolio['category'] | 'all'>('all')
  const [lightboxItem, setLightboxItem] = useState<Portfolio | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const filtered =
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category === activeCategory)

  return (
    <section id="portfolio" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
            Hasil Kerja Kami
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Setiap kendaraan mendapat perlakuan terbaik. Lihat transformasinya.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.value
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ZoomIn className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-400">Portfolio belum tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                  onClick={() => setLightboxItem(item)}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.description || 'Portfolio GT Autodetailing'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white text-sm font-semibold line-clamp-2">{item.description}</p>
                      <p className="text-white/70 text-xs capitalize mt-1">{item.category}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4 text-slate-700" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              onClick={() => setLightboxItem(null)}
              aria-label="Tutup lightbox"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.imageUrl}
                alt={lightboxItem.description || 'Portfolio'}
                width={1200}
                height={900}
                className="object-contain w-full h-full max-h-[80vh]"
              />
              {lightboxItem.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-semibold">{lightboxItem.description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
