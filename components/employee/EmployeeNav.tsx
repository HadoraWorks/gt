'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { CalendarCheck, ClipboardList, LogOut, Home } from 'lucide-react'

const navItems = [
  { href: '/employee', label: 'Beranda', icon: Home },
  { href: '/employee/attendance', label: 'Absensi', icon: CalendarCheck },
  { href: '/employee/tasks', label: 'Tugas', icon: ClipboardList },
]

export function EmployeeNav() {
  const pathname = usePathname()
  const { appUser, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    document.cookie = 'gt_session=; path=/; max-age=0'
    toast.success('Berhasil logout')
    router.replace('/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 min-h-screen shrink-0">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs">GT</div>
          <div>
            <p className="font-black text-slate-800 text-sm">GT Autodetailing</p>
            <p className="text-xs text-slate-400">Employee</p>
          </div>
        </div>

        {appUser && (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {appUser.name?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <div className="min-w-0">
              <p className="text-slate-800 text-sm font-semibold truncate">{appUser.name}</p>
              <p className="text-slate-400 text-xs">Karyawan</p>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs">GT</div>
          <span className="font-bold text-slate-800 text-sm">{appUser?.name}</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
