'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Camera, MapPin, Clock, Phone } from 'lucide-react'

const WA_URL = `https://wa.me/6281548222030?text=Halo%20GT%20Autodetailing%2C%20saya%20ingin%20bertanya%20tentang%20layanan%20detailing.`

export function CTASection() {
  return (
    <section id="kontak" className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-5">
              Hubungi Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              Siap Bikin Kendaraan{' '}
              <span className="text-blue-400">Kamu Bening?</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
              sesuai kebutuhan kendaraan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi via WhatsApp"
                className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 animate-pulse hover:animate-none"
              >
                <MessageCircle className="h-6 w-6" />
                WhatsApp
              </a>
              <a
                href="https://instagram.com/gtautodetailing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow GT Autodetailing di Instagram"
                className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                <Camera className="h-6 w-6" />
                Instagram
              </a>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {[
              {
                icon: MapPin,
                title: 'Lokasi',
                value: 'Purwokerto, Jawa Tengah',
                sub: 'Workshop tersedia untuk kunjungan',
              },
              {
                icon: Phone,
                title: 'WhatsApp',
                value: '0815-4822-2030',
                sub: 'Respon cepat hari kerja',
              },
              {
                icon: Clock,
                title: 'Jam Operasional',
                value: 'Senin – Sabtu: 08.00 – 17.00',
                sub: 'Minggu & Hari Besar: Tutup',
              },
              {
                icon: Camera,
                title: 'Instagram',
                value: '@gtautodetailing',
                sub: 'Lihat portofolio terbaru',
              },
            ].map((info, i) => (
              <div key={info.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                  <info.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-0.5">{info.title}</p>
                  <p className="text-white font-semibold">{info.value}</p>
                  <p className="text-slate-400 text-xs">{info.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs">GT</div>
          <span className="text-white font-bold">GT Autodetailing</span>
        </div>
        <p className="text-sm text-center">"Ga Bening, Ga Pulang" — Purwokerto, Jawa Tengah</p>
        <p className="text-xs">© {new Date().getFullYear()} GT Autodetailing</p>
      </div>
    </footer>
  )
}
