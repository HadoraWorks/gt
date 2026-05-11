'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAllTasks } from '@/hooks/useTasks'
import { useAllAttendance } from '@/hooks/useAttendance'
import { getAllUsers } from '@/lib/firestore/users'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { statusBadge, priorityBadge } from '@/components/ui/Badge'
import { Users, ClipboardList, CalendarCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import type { User } from '@/types'

export default function AdminDashboardPage() {
  const { appUser } = useAuth()
  const { tasks, loading: tasksLoading } = useAllTasks()
  const { records, loading: attendLoading } = useAllAttendance()
  const [employees, setEmployees] = useState<User[]>([])

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getAllUsers().then((all) => setEmployees(all.filter((u) => u.role === 'employee' && u.isActive)))
  }, [])

  const todayAttendance = records.filter((r) => r.date === todayStr)
  const presentToday = todayAttendance.filter((r) => r.status === 'present' || r.status === 'late').length
  const todoTasks = tasks.filter((t) => t.status === 'todo').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const doneTasks = tasks.filter((t) => t.status === 'done').length

  const recentTasks = tasks.slice(0, 5)

  const stats = [
    { label: 'Total Karyawan Aktif', value: employees.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/users' },
    { label: 'Hadir Hari Ini', value: presentToday, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/attendance' },
    { label: 'Task Aktif', value: inProgressTasks, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/admin/tasks' },
    { label: 'Task Selesai', value: doneTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/tasks' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Selamat Datang, {appUser?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            {tasksLoading || attendLoading ? (
              <div className="h-7 w-12 bg-slate-200 rounded-lg animate-pulse mb-1" />
            ) : (
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            )}
            <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-600" /> Task Terbaru</h2>
            <Link href="/admin/tasks" className="text-blue-700 text-xs font-semibold hover:underline">Lihat Semua</Link>
          </div>
          {tasksLoading ? (
            <div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : recentTasks.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Belum ada task.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{t.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Deadline: {t.deadline?.toDate?.()?.toLocaleDateString('id-ID') ?? '—'}
                    </p>
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

        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-green-600" /> Kehadiran Hari Ini</h2>
            <Link href="/admin/attendance" className="text-blue-700 text-xs font-semibold hover:underline">Lihat Semua</Link>
          </div>
          {attendLoading ? (
            <div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : employees.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Belum ada karyawan aktif.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {employees.map((emp) => {
                const att = todayAttendance.find((r) => r.employeeId === emp.uid)
                return (
                  <div key={emp.uid} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                      {emp.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <p className="flex-1 text-sm font-medium text-slate-700 truncate">{emp.name}</p>
                    {att ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={`text-xs font-semibold ${att.status === 'present' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {att.status === 'present' ? 'Hadir' : 'Terlambat'}
                        </span>
                        <span className="text-slate-400 text-xs">{att.checkInTime?.toDate?.()?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) ?? ''}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Belum Hadir</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
