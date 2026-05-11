'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { useAllTasks } from '@/hooks/useTasks'
import { createTask, updateTask, deleteTask } from '@/lib/firestore/tasks'
import { getEmployees } from '@/lib/firestore/users'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { priorityBadge, statusBadge } from '@/components/ui/Badge'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { Timestamp } from 'firebase/firestore'
import type { Task, User } from '@/types'

const PRIORITY_OPTS = [{ value: 'high', label: 'Tinggi' }, { value: 'medium', label: 'Sedang' }, { value: 'low', label: 'Rendah' }]
const STATUS_OPTS = [{ value: 'todo', label: 'Belum Dimulai' }, { value: 'in_progress', label: 'Sedang Dikerjakan' }, { value: 'done', label: 'Selesai' }]

const emptyForm = () => ({
  employeeId: '', title: '', description: '',
  priority: 'medium' as Task['priority'],
  status: 'todo' as Task['status'],
  deadline: new Date().toISOString().split('T')[0],
})

export default function AdminTasksPage() {
  const { appUser } = useAuth()
  const { tasks, loading } = useAllTasks()
  const [employees, setEmployees] = useState<User[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filterEmp, setFilterEmp] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => { getEmployees().then(setEmployees) }, [])

  const openNew = () => { setEditing(null); setForm(emptyForm()); setModalOpen(true) }
  const openEdit = (t: Task) => {
    setEditing(t)
    setForm({
      employeeId: t.employeeId, title: t.title, description: t.description,
      priority: t.priority, status: t.status,
      deadline: t.deadline?.toDate?.()?.toISOString().split('T')[0] ?? '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.employeeId || !form.title.trim()) { toast.error('Pilih karyawan dan isi judul'); return }
    setSaving(true)
    try {
      const deadlineTs = Timestamp.fromDate(new Date(form.deadline))
      if (editing) {
        await updateTask(editing.id, { title: form.title, description: form.description, priority: form.priority, status: form.status, deadline: deadlineTs })
        toast.success('Task diperbarui!')
      } else {
        await createTask({ employeeId: form.employeeId, assignedBy: appUser!.uid, title: form.title, description: form.description, priority: form.priority, status: form.status, deadline: deadlineTs })
        toast.success('Task diberikan!')
      }
      setModalOpen(false)
    } catch { toast.error('Gagal menyimpan task') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { await deleteTask(deleteId); toast.success('Task dihapus'); setDeleteId(null) }
    catch { toast.error('Gagal menghapus') } finally { setDeleting(false) }
  }

  const getEmployeeName = (uid: string) => employees.find((e) => e.uid === uid)?.name ?? uid

  const filtered = tasks.filter((t) => {
    if (filterEmp && t.employeeId !== filterEmp) return false
    if (filterStatus && t.status !== filterStatus) return false
    return true
  })

  const empOpts = [{ value: '', label: 'Semua Karyawan' }, ...employees.map((e) => ({ value: e.uid, label: e.name }))]
  const statusOpts = [{ value: '', label: 'Semua Status' }, ...STATUS_OPTS]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Penugasan</h1>
          <p className="text-slate-500 text-sm">Assign dan monitor task karyawan</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Tambah Task</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {empOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {statusOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={6} /></div>
          : filtered.length === 0 ? <div className="text-center py-16 text-slate-400">Tidak ada task ditemukan.</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Task</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Karyawan</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Prioritas</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Deadline</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">{t.title}</p>
                        {t.description && <p className="text-slate-400 text-xs line-clamp-1">{t.description}</p>}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{getEmployeeName(t.employeeId)}</td>
                      <td className="px-5 py-4">{priorityBadge(t.priority)}</td>
                      <td className="px-5 py-4">{statusBadge(t.status)}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {t.deadline?.toDate?.()?.toLocaleDateString('id-ID') ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" aria-label="Edit task"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => setDeleteId(t.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" aria-label="Hapus task"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Task' : 'Task Baru'} size="md">
        <div className="p-6 flex flex-col gap-4">
          {!editing && (
            <Select label="Karyawan" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              options={[{ value: '', label: 'Pilih karyawan...' }, ...employees.map((e) => ({ value: e.uid, label: e.name }))]} />
          )}
          <Input label="Judul Task" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Poles body eksterior..." />
          <Textarea label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Detail pekerjaan..." />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Prioritas" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })} options={PRIORITY_OPTS} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })} options={STATUS_OPTS} />
          </div>
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} loading={saving}>Simpan</Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Hapus Task" message="Task yang dihapus tidak bisa dipulihkan." loading={deleting} />
    </div>
  )
}
