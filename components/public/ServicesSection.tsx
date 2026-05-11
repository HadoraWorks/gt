'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, CheckCircle2 } from 'lucide-react'
import type { Service } from '@/types'

function formatPrice(price: number, priceMax: number | null): string {
  const fmt = (n: number) =>
    'Rp ' + n.toLocaleString('id-ID')
  if (priceMax) return `${fmt(price)} – ${fmt(priceMax)}`
  if (price === 0) return 'Negosiasi'
  return fmt(price)
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const isAdditional = service.category === 'additional'

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-slate-200 overflow-hidden transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-800 text-lg leading-snug">{service.name}</h3>
          <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isAdditional
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {isAdditional ? 'Tambahan' : 'Paket'}
          </span>
        </div>
        {service.description && (
          <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
        )}
      </div>

      <div className="px-6 pb-6">
        {isAdditional ? (
          /* Additional services have a single price */
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <span className="text-slate-600 text-sm font-medium">Harga</span>
            <span className="font-black text-blue-700 text-lg">
              {service.vehicleTypes[0]
                ? formatPrice(service.vehicleTypes[0].price, service.vehicleTypes[0].priceMax)
                : '—'}
            </span>
          </div>
        ) : (
          /* Package services: price per vehicle type */
          <div className="flex flex-col gap-0 border-t border-slate-100">
            {service.vehicleTypes.map((vt) => (
              <div
                key={vt.type}
                className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-slate-600 text-sm">{vt.type}</span>
                </div>
                <span className={`font-bold text-sm ${
                  vt.price === 0 ? 'text-slate-500 italic' : 'text-blue-700'
                }`}>
                  {formatPrice(vt.price, vt.priceMax)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface ServicesSectionProps {
  services: Service[]
}

const WA_URL = `https://wa.me/6281548222030?text=Halo%20GT%20Autodetailing%2C%20saya%20ingin%20konsultasi%20harga%20layanan.`

export function ServicesSection({ services }: ServicesSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const packages = services.filter((s) => s.category === 'package')
  const additionals = services.filter((s) => s.category === 'additional')

  return (
    <section id="layanan" className="py-24 bg-slate-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">
            Layanan & Harga
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
            Paket Detailing Terbaik
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Semua layanan dikerjakan oleh tenaga profesional berpengalaman
            dengan produk premium pilihan.
          </p>
        </motion.div>

        {/* Package cards */}
        {packages.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-700 mb-5">Paket Utama</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {packages.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Additional services */}
        {additionals.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-700 mb-5">Layanan Tambahan</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {additionals.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-slate-500 mb-5">Tidak yakin layanan mana yang cocok? Konsultasikan langsung!</p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
            Konsultasi via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
