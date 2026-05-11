'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Attendance } from '@/types'

export function useAttendance(employeeId: string | null) {
  const [records, setRecords] = useState<Attendance[]>([])
  const [today, setToday] = useState<Attendance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!employeeId) {
      setRecords([])
      setToday(null)
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'attendance'),
      where('employeeId', '==', employeeId),
      orderBy('checkInTime', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Attendance))
      setRecords(all)
      const todayStr = new Date().toISOString().split('T')[0]
      setToday(all.find((r) => r.date === todayStr) ?? null)
      setLoading(false)
    })

    return unsub
  }, [employeeId])

  return { records, today, loading }
}

export function useAllAttendance() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'attendance'), orderBy('checkInTime', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Attendance)))
      setLoading(false)
    })
    return unsub
  }, [])

  return { records, loading }
}
