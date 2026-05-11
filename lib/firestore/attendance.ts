import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Attendance } from '@/types'

export async function getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
  const q = query(
    collection(db, 'attendance'),
    where('employeeId', '==', employeeId),
    orderBy('checkInTime', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Attendance))
}

export async function getAllAttendance(): Promise<Attendance[]> {
  const q = query(collection(db, 'attendance'), orderBy('checkInTime', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Attendance))
}

export async function getTodayAttendance(employeeId: string): Promise<Attendance | null> {
  const today = new Date().toISOString().split('T')[0]
  const q = query(
    collection(db, 'attendance'),
    where('employeeId', '==', employeeId),
    where('date', '==', today)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Attendance
}

export async function checkIn(
  employeeId: string,
  lat: number,
  lng: number
): Promise<string> {
  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const lateHour = Number(process.env.NEXT_PUBLIC_LATE_CHECKIN_HOUR ?? 9)
  const status: Attendance['status'] = now.getHours() >= lateHour ? 'late' : 'present'

  const ref = await addDoc(collection(db, 'attendance'), {
    employeeId,
    date,
    checkInTime: Timestamp.now(),
    location: new GeoPoint(lat, lng),
    status,
    note: '',
  })
  return ref.id
}

export async function updateAttendanceNote(id: string, note: string): Promise<void> {
  await updateDoc(doc(db, 'attendance', id), { note })
}

export async function deleteAttendance(id: string): Promise<void> {
  await deleteDoc(doc(db, 'attendance', id))
}

export function calculateDistanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
