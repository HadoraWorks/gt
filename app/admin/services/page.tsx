'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { getAllServices, createService, updateService, deleteService } from '@/lib/firestore/services'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { SkeletonTable } from '@/components/ui/Skeleton'
import type { Service, VehiclePrice } from '@/types'

const VEHICLE_TYPES: VehiclePrice['type'][] = ['City Car', 'Medium Car', 'SUV', 'Premium/ShowCar']

const emptyForm = (): Omit<Service, 'id' | 'updatedAt'> => ({
  name: '', description: '', category: 'package',
  vehicleTypes: [{ type: 'City Car', price: 0, priceMax: null }],
  isActive: true, order: 0,
})

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setServices(await getAllServices()) } catch { toast.error('Gagal memuat layanan') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(emptyForm()); setModalOpen(true) }
  const openEdit = (s: Service) => {
    setEditing(s)
    setForm({ name: s.name, description: s.description, category: s.category, vehicleTypes: s.vehicleTypes, isActive: s.isActive, order: s.order })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Nama layanan wajib diisi'); return }
    setSaving(true)
    try {
      if (editing) { await updateService(editing.id, form); toast.success('Layanan diperbarui!') }
      else { await createService(form); toast.success('Layanan ditambahkan!') }
      setModalOpen(false); load()
    } catch { toast.error('Gagal menyimpan layanan') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await deleteService(deleteId); toast.success('Layanan dihapus'); setDeleteId(null); load() }
    catch { toast.error('Gagal menghapus') } finally { setDeleting(false) }
  }

  const toggleActive = async (s: Service) => {
    try { await updateService(s.id, { isActive: !s.isActive }); load() }
    catch { toast.error('Gagal mengubah status') }
  }

  const updateVehiclePrice = (idx: number, field: keyof VehiclePrice, value: string | number | null) => {
    setForm((f) => {
      const vt = [...f.vehicleTypes]
      vt[idx] = { ...vt[idx], [field]: value }
      return { ...f, vehicleTypes: vt }
    })
  }

  const addVehicleType = () => {
    setForm((f) => ({ ...f, vehicleTypes: [...f.vehicleTypes, { type: 'City Car', price: 0, priceMax: null }] }))
  }

  const removeVehicleType = (idx: number) => {
    setForm((f) => ({ ...f, vehicleTypes: f.vehicleTypes.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Layanan & Harga</h1>
          <p className="text-slate-500 text-sm">Kelola paket layanan GT Autodetailing</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Tambah Layanan</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={5} /></div>
          : services.length === 0 ? <div className="text-center py-16 text-slate-400">Belum ada layanan.</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Layanan</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Kategori</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Urutan</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{s.name}</p>
                        <p className="text-slate-400 text-xs">{s.vehicleTypes.length} tipe kendaraan</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={s.category === 'package' ? 'blue' : 'green'}>
                          {s.category === 'package' ? 'Paket' : 'Tambahan'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleActive(s)} className="flex items-center gap-1.5 text-sm font-medium transition-colors" aria-label={s.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                          {s.isActive ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5 text-slate-300" />}
                          <span className={s.isActive ? 'text-green-600' : 'text-slate-400'}>{s.isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{s.order}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" aria-label="Edit layanan"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" aria-label="Hapus layanan"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Layanan' : 'Tambah Layanan'} size="lg">
        <div className="p-6 flex flex-col gap-4">
          <Input label="Nama Layanan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Reguler Detail + Sealant Protection" />
          <Textarea label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Service['category'] })} options={[{ value: 'package', label: 'Paket Utama' }, { value: 'additional', label: 'Layanan Tambahan' }]} />
            <Input label="Urutan Tampil" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Harga per Tipe Kendaraan</label>
              <button onClick={addVehicleType} className="text-xs text-blue-700 font-semibold hover:underline">+ Tambah</button>
            </div>
            <div className="flex flex-col gap-2">
              {form.vehicleTypes.map((vt, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-end">
                  <Select label="" value={vt.type} onChange={(e) => updateVehiclePrice(idx, 'type', e.target.value as VehiclePrice['type'])} options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))} />
                  <Input label="" type="number" value={vt.price} onChange={(e) => updateVehiclePrice(idx, 'price', Number(e.target.value))} placeholder="Harga min" />
                  <Input label="" type="number" value={vt.priceMax ?? ''} onChange={(e) => updateVehiclePrice(idx, 'priceMax', e.target.value ? Number(e.target.value) : null)} placeholder="Harga max (opsional)" />
                  <button onClick={() => removeVehicleType(idx)} className="pb-2.5 text-red-400 hover:text-red-600 text-xs" disabled={form.vehicleTypes.length === 1}>Hapus</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} loading={saving}>Simpan</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Hapus Layanan" message="Layanan yang dihapus tidak bisa dipulihkan." loading={deleting} />
    </div>
  )
}
