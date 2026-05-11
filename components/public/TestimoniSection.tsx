'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="shrink-0 w-80 sm:w-96 bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-slate-800">{t.customerName}</p>
          <p className="text-slate-500 text-sm">{t.vehicleType}</p>
        </div>
        <Quote className="h-6 w-6 text-blue-200 shrink-0" />
      </div>
      <StarRating rating={t.rating} />
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{t.comment}</p>
    </div>
  )
}

interface TestimoniSectionProps {
  testimonials: Testimonial[]
}

export function TestimoniSection({ testimonials }: TestimoniSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  // Duplicate for seamless marquee
  const doubled = [...testimonials, ...testimonials]

  return (
    <section id="testimoni" className="py-24 bg-slate-50 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
            Kata Pelanggan Kami
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Ribuan pelanggan puas — dari pemilik kendaraan harian sampai peserta kontes.
          </p>
        </motion.div>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center text-slate-400 py-8">Belum ada testimoni.</div>
      ) : (
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="marquee-track">
              {doubled.map((t, i) => (
                <TestimonialCard key={`${t.id}-${i}`} t={t} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
