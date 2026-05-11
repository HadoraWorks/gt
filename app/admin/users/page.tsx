'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Shield, UserX, UserCheck } from 'lucide-react'
import { getAllUsers, updateUser } from '@/lib/firestore/users'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { ConfirmModal } from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

export default function AdminUsersPage() {
  const { appUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmAction, setConfirmAction] = useState<{ user: User; action: 'role' | 'active' } | null>(null)
  const [acting, setActing] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setUsers(await getAllUsers()) } catch { toast.error('Gagal memuat pengguna') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleConfirm = async () => {
    if (!confirmAction) return
    setActing(true)
    const { user, action } = confirmAction
    try {
      if (action === 'role') {
        await updateUser(user.uid, { role: user.role === 'admin' ? 'employee' : 'admin' })
        toast.success(`Role diubah menjadi ${user.role === 'admin' ? 'Employee' : 'Admin'}`)
      } else {
        await updateUser(user.uid, { isActive: !user.isActive })
        toast.success(user.isActive ? 'Akun dinonaktifkan' : 'Akun diaktifkan')
      }
      setConfirmAction(null); load()
    } catch { toast.error('Gagal memperbarui pengguna') } finally { setActing(false) }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Manajemen Pengguna</h1>
        <p className="text-slate-500 text-sm">Kelola akun dan role pengguna</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={5} /></div>
          : users.length === 0 ? <div className="text-center py-16 text-slate-400">Belum ada pengguna.</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Pengguna</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Role</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Bergabung</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSelf = u.uid === appUser?.uid
                    return (
                      <tr key={u.uid} className={`hover:bg-slate-50 transition-colors ${!u.isActive ? 'opacity-60' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                              {u.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{u.name || '—'} {isSelf && <span className="text-xs text-slate-400">(kamu)</span>}</p>
                              <p className="text-slate-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={u.role === 'admin' ? 'blue' : 'gray'}>
                            {u.role === 'admin' ? 'Admin' : 'Employee'}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">
                          {u.createdAt?.toDate?.()?.toLocaleDateString('id-ID') ?? '—'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {!isSelf && (
                              <>
                                <button
                                  onClick={() => setConfirmAction({ user: u, action: 'role' })}
                                  className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                  title={`Jadikan ${u.role === 'admin' ? 'Employee' : 'Admin'}`}
                                  aria-label="Ubah role"
                                >
                                  <Shield className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setConfirmAction({ user: u, action: 'active' })}
                                  className={`p-2 rounded-lg transition-colors ${u.isActive ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-green-50 text-slate-400 hover:text-green-600'}`}
                                  title={u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                  aria-label={u.isActive ? 'Nonaktifkan akun' : 'Aktifkan akun'}
                                >
                                  {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>

      <ConfirmModal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction?.action === 'role' ? 'Ubah Role' : confirmAction?.user?.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
        message={
          confirmAction?.action === 'role'
            ? `Ubah role ${confirmAction.user.name} menjadi ${confirmAction.user.role === 'admin' ? 'Employee' : 'Admin'}?`
            : `${confirmAction?.user?.isActive ? 'Nonaktifkan' : 'Aktifkan'} akun ${confirmAction?.user?.name}?`
        }
        confirmLabel={confirmAction?.action === 'role' ? 'Ubah' : confirmAction?.user?.isActive ? 'Nonaktifkan' : 'Aktifkan'}
        loading={acting}
      />
    </div>
  )
}
