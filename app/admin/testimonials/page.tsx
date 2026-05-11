'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Star } from 'lucide-react'
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/firestore/testimonials'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { Testimonial } from '@/types'

const emptyForm = () => ({ customerName: '', vehicleType: '', rating: 5, comment: '', isActive: true, order: 0 })

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setItems(await getAllTestimonials()) } catch { toast.error('Gagal memuat testimoni') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.customerName.trim() || !form.comment.trim()) { toast.error('Nama dan komentar wajib diisi'); return }
    setSaving(true)
    try {
      await createTestimonial(form)
      toast.success('Testimoni ditambahkan!')
      setModalOpen(false); load()
    } catch { toast.error('Gagal menyimpan') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await deleteTestimonial(deleteId); toast.success('Testimoni dihapus'); setDeleteId(null); load() }
    catch { toast.error('Gagal menghapus') } finally { setDeleting(false) }
  }

  const toggleActive = async (t: Testimonial) => {
    try { await updateTestimonial(t.id, { isActive: !t.isActive }); load() }
    catch { toast.error('Gagal mengubah status') }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Testimoni</h1>
          <p className="text-slate-500 text-sm">Kelola ulasan pelanggan</p>
        </div>
        <Button onClick={() => { setForm(emptyForm()); setModalOpen(true) }}><Plus className="h-4 w-4" /> Tambah</Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-400">Belum ada testimoni.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl shadow-sm border p-5 ${t.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">{t.customerName}</p>
                  <p className="text-slate-500 text-xs">{t.vehicleType}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{t.comment}</p>
              <div className="flex items-center justify-between">
                <button onClick={() => toggleActive(t)} className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {t.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
                <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" aria-label="Hapus testimoni"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Testimoni" size="md">
        <div className="p-6 flex flex-col gap-4">
          <Input label="Nama Pelanggan" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Budi Santoso" />
          <Input label="Jenis Kendaraan" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} placeholder="Toyota Avanza 2021" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setForm({ ...form, rating: n })} aria-label={`Rating ${n}`}>
                  <Star className={`h-7 w-7 transition-colors ${n <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <Textarea label="Komentar" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={3} placeholder="Tuliskan ulasan pelanggan..." />
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} loading={saving}>Simpan</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Hapus Testimoni" message="Testimoni yang dihapus tidak bisa dipulihkan." loading={deleting} />
    </div>
  )
}
