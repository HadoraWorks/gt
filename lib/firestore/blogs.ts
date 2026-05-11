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
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Blog } from '@/types'

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export async function getPublishedBlogs(limitCount = 10): Promise<Blog[]> {
  const q = query(
    collection(db, 'blogs'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog))
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(collection(db, 'blogs'), where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Blog
}

export async function getAllBlogs(): Promise<Blog[]> {
  const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog))
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const snap = await getDoc(doc(db, 'blogs', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Blog
}

export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'publishedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'blogs'), {
    ...data,
    createdAt: Timestamp.now(),
    publishedAt: data.status === 'published' ? Timestamp.now() : null,
  })
  return ref.id
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<void> {
  const updates: Partial<Blog> = { ...data }
  if (data.status === 'published') {
    const existing = await getBlogById(id)
    if (existing && existing.status !== 'published') {
      updates.publishedAt = Timestamp.now()
    }
  }
  await updateDoc(doc(db, 'blogs', id), updates)
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, 'blogs', id))
}
