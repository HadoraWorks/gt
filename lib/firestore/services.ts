import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Service } from '@/types'

export async function getActiveServices(): Promise<Service[]> {
  const q = query(
    collection(db, 'services'),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service))
}

export async function getAllServices(): Promise<Service[]> {
  const q = query(collection(db, 'services'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service))
}

export async function getServiceById(id: string): Promise<Service | null> {
  const snap = await getDoc(doc(db, 'services', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Service
}

export async function createService(data: Omit<Service, 'id' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'services'), {
    ...data,
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  await updateDoc(doc(db, 'services', id), { ...data, updatedAt: Timestamp.now() })
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id))
}
