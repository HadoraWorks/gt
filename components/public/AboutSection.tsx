'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Car, Star, Clock } from 'lucide-react'

const stats = [
  { icon: Clock, value: 10, suffix: '+', label: 'Tahun Pengalaman', color: 'text-blue-600' },
  { icon: Car, value: 1000, suffix: '+', label: 'Kendaraan Dikerjakan', color: 'text-blue-600' },
  { icon: Star, value: 4.9, suffix: '', label: 'Rating Pelanggan', color: 'text-yellow-500' },
  { icon: Award, value: 100, suffix: '%', label: 'Kepuasan Pelanggan', color: 'text-green-600' },
]

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)
  const isDecimal = !Number.isInteger(target)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const start = performance.now()
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((eased * target).toFixed(isDecimal ? 1 : 0)))
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [target, duration, isDecimal])

  return (
    <span>{isDecimal ? count.toFixed(1) : Math.floor(count)}{suffix}</span>
  )
}

export function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="tentang" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              Tentang Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6 leading-tight">
              Lebih dari Sekedar{' '}
              <span className="text-blue-700">Poles Mobil</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              GT Autodetailing berdiri di Purwokerto, Jawa Tengah, sebagai spesialis detailing
              kendaraan bermotor yang melayani segala jenis kendaraan — dari kendaraan harian
              milik keluarga hingga mobil kontes berstandar tinggi.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Dengan lebih dari <strong className="text-slate-800">10 tahun pengalaman</strong>,
              kami telah dipercaya oleh ratusan pelanggan setia, showroom, dealer resmi,
              dan peserta kontes otomotif di seluruh Jawa Tengah.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Slogan kami <em className="text-blue-700 font-semibold">"Ga Bening, Ga Pulang"</em> bukan
              sekadar kata-kata — melainkan komitmen kami bahwa setiap kendaraan yang keluar
              dari workshop kami sudah melewati standar kualitas tertinggi.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <stat.icon className={`h-6 w-6 ${stat.color} mb-3`} />
                <p className={`text-3xl font-black ${stat.color} mb-1`}>
                  {inView && <Counter target={stat.value} suffix={stat.suffix} />}
                </p>
                <p className="text-slate-500 text-sm leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
