import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { User } from '@/types'

export async function getUserById(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    return { uid: snap.id, ...snap.data() } as User
  } catch {
    return null
  }
}

export async function createUser(uid: string, data: Omit<User, 'uid' | 'createdAt'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: Timestamp.now(),
  })
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data)
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as User))
}

export async function getEmployees(): Promise<User[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'employee'), where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as User))
}

export function isProfileComplete(user: User): boolean {
  return Boolean(user.name?.trim() && user.phone?.trim())
}
