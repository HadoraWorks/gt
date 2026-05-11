'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  LayoutDashboard, FileText, Briefcase, Image, MessageSquare,
  Users, ClipboardList, CalendarCheck, Menu, X, LogOut, ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/services', label: 'Layanan', icon: Briefcase },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquare },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/tasks', label: 'Penugasan', icon: ClipboardList },
  { href: '/admin/attendance', label: 'Kehadiran', icon: CalendarCheck },
]

function NavLink({ item, collapsed, onClick }: { item: typeof navItems[0]; collapsed: boolean; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
        isActive
          ? 'bg-blue-700 text-white shadow-md shadow-blue-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
      {!collapsed && isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
    </Link>
  )
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { appUser, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    document.cookie = 'gt_session=; path=/; max-age=0'
    toast.success('Berhasil logout')
    router.replace('/login')
  }

  const sidebarContent = (isMobile = false) => (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ${
      isMobile ? 'w-72' : collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-200 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs shrink-0">GT</div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="font-black text-slate-800 text-sm truncate">GT Autodetailing</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed && !isMobile} onClick={isMobile ? () => setMobileOpen(false) : undefined} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`p-3 border-t border-slate-200 flex ${collapsed && !isMobile ? 'justify-center' : 'flex-col gap-2'}`}>
        {(!collapsed || isMobile) && appUser && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {appUser.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-slate-800 text-sm font-semibold truncate">{appUser.name}</p>
              <p className="text-slate-400 text-xs">Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors ${collapsed && !isMobile ? 'justify-center' : ''}`}
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || isMobile) && 'Logout'}
        </button>
      </div>

      {/* Collapse toggle (desktop) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          <ChevronRight className={`h-3 w-3 text-slate-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      )}
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex relative shrink-0">
        {sidebarContent()}
      </div>

      {/* Mobile: hamburger in header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs">GT</div>
          <span className="font-black text-slate-800 text-sm">Admin Panel</span>
        </div>
        <button onClick={() => setMobileOpen(true)} aria-label="Buka menu" className="p-2 rounded-lg hover:bg-slate-100">
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex">
            {sidebarContent(true)}
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100" aria-label="Tutup menu">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
