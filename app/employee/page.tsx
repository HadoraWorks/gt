'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useAttendance } from '@/hooks/useAttendance'
import { priorityBadge, statusBadge, attendanceBadge } from '@/components/ui/Badge'
import { CalendarCheck, ClipboardList, CheckCircle2, Clock } from 'lucide-react'

export default function EmployeeHomePage() {
  const { appUser } = useAuth()
  const { tasks, loading: tasksLoading } = useTasks(appUser?.uid ?? null)
  const { today, records, loading: attendLoading } = useAttendance(appUser?.uid ?? null)

  const activeTasks = tasks.filter((t) => t.status !== 'done')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore'

  return (
    <div className="p-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-800">{greeting}, {appUser?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm">{now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Attendance status */}
      <div className={`rounded-2xl p-5 mb-5 ${today ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Status Kehadiran Hari Ini</p>
            {attendLoading ? (
              <div className="h-5 w-24 bg-slate-200 rounded-full animate-pulse" />
            ) : today ? (
              <div className="flex items-center gap-2">
                {attendanceBadge(today.status)}
                <span className="text-xs text-slate-500">
                  {today.checkInTime?.toDate?.()?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ) : (
              <p className="text-orange-700 text-sm font-semibold">Belum Absen</p>
            )}
          </div>
          <Link href="/employee/attendance"
            className="text-sm font-semibold text-blue-700 hover:underline">
            {today ? 'Lihat Detail' : 'Absen Sekarang →'}
          </Link>
        </div>
      </div>

      {/* Task summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-500">Task Aktif</span>
          </div>
          <p className="text-2xl font-black text-blue-700">{tasksLoading ? '—' : activeTasks.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-slate-500">Selesai</span>
          </div>
          <p className="text-2xl font-black text-green-700">{tasksLoading ? '—' : doneTasks.length}</p>
        </div>
      </div>

      {/* Active tasks preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" /> Task Aktif
          </h2>
          <Link href="/employee/tasks" className="text-blue-700 text-xs font-semibold hover:underline">Lihat Semua</Link>
        </div>
        {tasksLoading ? (
          <div className="flex flex-col gap-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
        ) : activeTasks.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">Tidak ada task aktif. 🎉</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeTasks.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{t.title}</p>
                  <p className="text-slate-400 text-xs">Deadline: {t.deadline?.toDate?.()?.toLocaleDateString('id-ID') ?? '—'}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {priorityBadge(t.priority)}
                  {statusBadge(t.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
