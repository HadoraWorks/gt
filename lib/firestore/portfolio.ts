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
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Portfolio } from '@/types'

export async function getPortfolio(): Promise<Portfolio[]> {
  const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Portfolio))
}

export async function getPortfolioByCategory(category: Portfolio['category']): Promise<Portfolio[]> {
  const q = query(
    collection(db, 'portfolio'),
    where('category', '==', category),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Portfolio))
}

export async function createPortfolio(data: Omit<Portfolio, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'portfolio'), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return ref.id
}

export async function updatePortfolio(id: string, data: Partial<Portfolio>): Promise<void> {
  await updateDoc(doc(db, 'portfolio', id), data)
}

export async function deletePortfolio(id: string): Promise<void> {
  await deleteDoc(doc(db, 'portfolio', id))
}
