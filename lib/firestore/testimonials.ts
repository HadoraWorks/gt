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
import type { Testimonial } from '@/types'

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const q = query(
    collection(db, 'testimonials'),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial))
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Testimonial))
}

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'testimonials'), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
  await updateDoc(doc(db, 'testimonials', id), data)
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id))
}
