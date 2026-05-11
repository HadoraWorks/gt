'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function EmployeeGuard({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!appUser || appUser.role !== 'employee')) {
      router.replace(appUser?.role === 'admin' ? '/admin' : '/login')
    }
  }, [appUser, loading, router])

  if (loading || !appUser || appUser.role !== 'employee') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
