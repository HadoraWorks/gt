'use client'

import { HTMLAttributes } from 'react'

type BadgeVariant = 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'orange'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  gray: 'bg-slate-100 text-slate-600',
  orange: 'bg-orange-100 text-orange-700',
}

export function Badge({ variant = 'blue', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export function priorityBadge(priority: 'high' | 'medium' | 'low') {
  const map = {
    high: { variant: 'red' as BadgeVariant, label: 'Tinggi' },
    medium: { variant: 'yellow' as BadgeVariant, label: 'Sedang' },
    low: { variant: 'gray' as BadgeVariant, label: 'Rendah' },
  }
  const { variant, label } = map[priority]
  return <Badge variant={variant}>{label}</Badge>
}

export function statusBadge(status: 'todo' | 'in_progress' | 'done') {
  const map = {
    todo: { variant: 'gray' as BadgeVariant, label: 'Belum Dimulai' },
    in_progress: { variant: 'blue' as BadgeVariant, label: 'Sedang Dikerjakan' },
    done: { variant: 'green' as BadgeVariant, label: 'Selesai' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function attendanceBadge(status: 'present' | 'late' | 'absent') {
  const map = {
    present: { variant: 'green' as BadgeVariant, label: 'Hadir' },
    late: { variant: 'yellow' as BadgeVariant, label: 'Terlambat' },
    absent: { variant: 'red' as BadgeVariant, label: 'Tidak Hadir' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}
