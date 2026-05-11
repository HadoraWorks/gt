'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { User, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { updateUser } from '@/lib/firestore/users'
import { Button } from '@/components/ui/Button'

export default function SetupProfilePage() {
  const { appUser, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !appUser) {
      router.replace('/login')
    }
    if (appUser?.name) setName(appUser.name)
    if (appUser?.phone) setPhone(appUser.phone)
  }, [appUser, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appUser) return
    if (!name.trim() || !phone.trim()) {
      toast.error('Nama dan nomor telepon wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await updateUser(appUser.uid, { name: name.trim(), phone: phone.trim() })
      await refreshUser()
      document.cookie = 'gt_session=1; path=/; max-age=86400; SameSite=Strict'
      toast.success('Profil berhasil disimpan!')
      router.replace(appUser.role === 'admin' ? '/admin' : '/employee')
    } catch {
      toast.error('Gagal menyimpan profil. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/40 mx-auto mb-4">GT</div>
          <h1 className="text-2xl font-black text-white mb-1">Lengkapi Profil</h1>
          <p className="text-slate-400 text-sm">Isi data diri untuk melanjutkan</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {appUser?.photoURL && (
            <div className="flex justify-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={appUser.photoURL} alt="Foto profil" className="w-16 h-16 rounded-full border-2 border-blue-500" referrerPolicy="no-referrer" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullname" className="text-slate-300 text-sm font-medium">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="fullname"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-slate-300 text-sm font-medium">Nomor Telepon (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="0812xxxxxxxx"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <Button type="submit" fullWidth loading={submitting} className="mt-2">
              Simpan & Lanjutkan
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
