'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAllAttendance } from '@/hooks/useAttendance'
import { getEmployees } from '@/lib/firestore/users'
import { attendanceBadge } from '@/components/ui/Badge'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { MapPin, Calendar } from 'lucide-react'
import type { User } from '@/types'

export default function AdminAttendancePage() {
  const { records, loading } = useAllAttendance()
  const [employees, setEmployees] = useState<User[]>([])
  const [filterEmp, setFilterEmp] = useState('')
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => { getEmployees().then(setEmployees).catch(() => toast.error('Gagal memuat karyawan')) }, [])

  const getName = (uid: string) => employees.find((e) => e.uid === uid)?.name ?? uid

  const filtered = records.filter((r) => {
    if (filterEmp && r.employeeId !== filterEmp) return false
    if (filterDate && r.date !== filterDate) return false
    return true
  })

  const todayStr = new Date().toISOString().split('T')[0]
  const todayRecords = records.filter((r) => r.date === todayStr)
  const presentCount = todayRecords.filter((r) => r.status !== 'absent').length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Monitor Kehadiran</h1>
        <p className="text-slate-500 text-sm">Pantau absensi seluruh karyawan</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Hadir Hari Ini', value: presentCount, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Karyawan', value: employees.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Rekaman', value: records.length, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Terlambat Hari Ini', value: todayRecords.filter((r) => r.status === 'late').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Karyawan</option>
          {employees.map((e) => <option key={e.uid} value={e.uid}>{e.name}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Filter tanggal" />
        {(filterEmp || filterDate) && (
          <button onClick={() => { setFilterEmp(''); setFilterDate('') }} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-800 underline">Reset</button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={8} /></div>
          : filtered.length === 0 ? <div className="text-center py-16 text-slate-400">Tidak ada data kehadiran.</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Karyawan</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Tanggal</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Jam Masuk</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Lokasi</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                            {getName(r.employeeId)?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-medium text-slate-800">{getName(r.employeeId)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" />{r.date}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-mono">
                        {r.checkInTime?.toDate?.()?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        {r.location ? (
                          <a
                            href={`https://maps.google.com/?q=${r.location.latitude},${r.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            {r.location.latitude.toFixed(4)}, {r.location.longitude.toFixed(4)}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-4">{attendanceBadge(r.status)}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{r.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  )
}
