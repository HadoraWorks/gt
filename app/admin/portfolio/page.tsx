'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { getPortfolio, createPortfolio, deletePortfolio } from '@/lib/firestore/portfolio'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { SkeletonCard } from '@/components/ui/Skeleton'
import Image from 'next/image'
import type { Portfolio } from '@/types'

const CATEGORY_OPTIONS = [
  { value: 'daily', label: 'Kendaraan Harian' },
  { value: 'showroom', label: 'Showroom' },
  { value: 'contest', label: 'Kontes' },
  { value: 'dealer', label: 'Dealer' },
]

const emptyForm = () => ({ imageUrl: '', beforeImageUrl: null as string | null, category: 'daily' as Portfolio['category'], description: '', order: 0 })

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setItems(await getPortfolio()) } catch { toast.error('Gagal memuat portfolio') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.imageUrl.trim()) { toast.error('URL gambar wajib diisi'); return }
    setSaving(true)
    try {
      await createPortfolio({ ...form, beforeImageUrl: form.beforeImageUrl || null })
      toast.success('Portfolio ditambahkan!')
      setModalOpen(false); load()
    } catch { toast.error('Gagal menyimpan') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await deletePortfolio(deleteId); toast.success('Item dihapus'); setDeleteId(null); load() }
    catch { toast.error('Gagal menghapus') } finally { setDeleting(false) }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Portfolio</h1>
          <p className="text-slate-500 text-sm">Kelola foto hasil detailing</p>
        </div>
        <Button onClick={() => { setForm(emptyForm()); setModalOpen(true) }}><Plus className="h-4 w-4" /> Tambah Foto</Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-400">Belum ada foto portfolio.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="relative aspect-square bg-slate-100">
                <Image src={item.imageUrl} alt={item.description || 'Portfolio'} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => setDeleteId(item.id)} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700" aria-label="Hapus foto"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-slate-700 text-sm font-medium line-clamp-1">{item.description || '—'}</p>
                <p className="text-slate-400 text-xs capitalize mt-0.5">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Foto Portfolio" size="md">
        <div className="p-6 flex flex-col gap-4">
          <Input label="URL Gambar (After)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          <Input label="URL Gambar Before (opsional)" value={form.beforeImageUrl ?? ''} onChange={(e) => setForm({ ...form, beforeImageUrl: e.target.value || null })} placeholder="https://..." />
          <Select label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Portfolio['category'] })} options={CATEGORY_OPTIONS} />
          <Textarea label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Keterangan singkat..." />
          <Input label="Urutan" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} loading={saving}>Tambahkan</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Hapus Foto" message="Foto yang dihapus tidak bisa dipulihkan." loading={deleting} />
    </div>
  )
}
