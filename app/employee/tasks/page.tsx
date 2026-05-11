'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { updateTaskStatus } from '@/lib/firestore/tasks'
import { toast } from 'react-hot-toast'
import { priorityBadge, statusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react'
import type { Task } from '@/types'

type Filter = 'all' | 'today' | 'week'

function TaskCard({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleAdvance = async () => {
    if (task.status === 'done') return
    const next: Task['status'] = task.status === 'todo' ? 'in_progress' : 'done'
    setUpdating(true)
    try {
      await updateTaskStatus(task.id, next)
      toast.success(next === 'in_progress' ? 'Task dimulai!' : 'Task selesai! ✅')
    } catch {
      toast.error('Gagal memperbarui task')
    } finally {
      setUpdating(false)
    }
  }

  const deadline = task.deadline?.toDate?.()
  const isOverdue = deadline && deadline < new Date() && task.status !== 'done'

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
      task.status === 'done' ? 'border-green-200 opacity-80' : isOverdue ? 'border-red-200' : 'border-slate-200'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={task.status !== 'done' ? handleAdvance : undefined}
            className="mt-0.5 shrink-0 transition-colors"
            disabled={updating || task.status === 'done'}
            aria-label={task.status === 'done' ? 'Task selesai' : 'Tandai selesai/mulai'}
          >
            {task.status === 'done'
              ? <CheckCircle2 className="h-5 w-5 text-green-500" />
              : task.status === 'in_progress'
              ? <PlayCircle className="h-5 w-5 text-blue-500" />
              : <Circle className="h-5 w-5 text-slate-300 hover:text-blue-400" />
            }
          </button>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                <Clock className="h-3 w-3" />
                {deadline?.toLocaleDateString('id-ID') ?? '—'}
                {isOverdue && ' (Terlambat)'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {priorityBadge(task.priority)}
            {statusBadge(task.status)}
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-slate-400 hover:text-slate-600" aria-label={expanded ? 'Sembunyikan detail' : 'Lihat detail'}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            {task.description && <p className="text-slate-600 text-sm leading-relaxed mb-3">{task.description}</p>}
            {task.status !== 'done' && (
              <Button size="sm" onClick={handleAdvance} loading={updating}>
                {task.status === 'todo' ? <><PlayCircle className="h-4 w-4" /> Mulai Kerjakan</> : <><CheckCircle2 className="h-4 w-4" /> Tandai Selesai</>}
              </Button>
            )}
            {task.status === 'done' && task.completedAt && (
              <p className="text-xs text-green-600">Selesai: {task.completedAt.toDate?.().toLocaleString('id-ID')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EmployeeTasksPage() {
  const { appUser } = useAuth()
  const { tasks, loading } = useTasks(appUser?.uid ?? null)
  const [filter, setFilter] = useState<Filter>('all')

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7)

  const filtered = tasks.filter((t) => {
    if (filter === 'today') {
      return t.deadline?.toDate?.()?.toISOString().split('T')[0] === todayStr
    }
    if (filter === 'week') {
      const d = t.deadline?.toDate?.()
      return d && d <= weekEnd
    }
    return true
  })

  const activeTasks = filtered.filter((t) => t.status !== 'done')
  const doneTasks = filtered.filter((t) => t.status === 'done')

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-black text-slate-800">Tugas Saya</h1>
        <p className="text-slate-500 text-sm">{tasks.length} total task</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {([['all', 'Semua'], ['today', 'Hari Ini'], ['week', 'Minggu Ini']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === val ? 'bg-blue-700 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle2 className="h-12 w-12 text-green-300 mx-auto mb-3" />
          <p className="text-slate-400">Tidak ada task.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeTasks.length > 0 && (
            <>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif ({activeTasks.length})</p>
              {activeTasks.map((t) => <TaskCard key={t.id} task={t} />)}
            </>
          )}
          {doneTasks.length > 0 && (
            <>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">Selesai ({doneTasks.length})</p>
              {doneTasks.map((t) => <TaskCard key={t.id} task={t} />)}
            </>
          )}
        </div>
      )}
    </div>
  )
}
