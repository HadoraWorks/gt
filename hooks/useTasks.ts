'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { sortTasksByPriority } from '@/lib/firestore/tasks'
import type { Task } from '@/types'

export function useTasks(employeeId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!employeeId) {
      setTasks([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'tasks'),
      where('employeeId', '==', employeeId),
      orderBy('assignedDate', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task))
      setTasks(sortTasksByPriority(raw))
      setLoading(false)
    })

    return unsub
  }, [employeeId])

  return { tasks, loading }
}

export function useAllTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('assignedDate', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)))
      setLoading(false)
    })
    return unsub
  }, [])

  return { tasks, loading }
}
