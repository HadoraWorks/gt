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
import type { Task } from '@/types'

export async function getTasksByEmployee(employeeId: string): Promise<Task[]> {
  const q = query(
    collection(db, 'tasks'),
    where('employeeId', '==', employeeId),
    orderBy('assignedDate', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task))
}

export async function getAllTasks(): Promise<Task[]> {
  const q = query(collection(db, 'tasks'), orderBy('assignedDate', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task))
}

export async function getTaskById(id: string): Promise<Task | null> {
  const snap = await getDoc(doc(db, 'tasks', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Task
}

export async function createTask(
  data: Omit<Task, 'id' | 'assignedDate' | 'completedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'tasks'), {
    ...data,
    assignedDate: Timestamp.now(),
    completedAt: null,
  })
  return ref.id
}

export async function updateTaskStatus(
  id: string,
  status: Task['status']
): Promise<void> {
  const data: Partial<Task> = { status }
  if (status === 'done') {
    data.completedAt = Timestamp.now()
  }
  await updateDoc(doc(db, 'tasks', id), data)
}

export async function updateTask(id: string, data: Partial<Task>): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), data)
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', id))
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return [...tasks].sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (pDiff !== 0) return pDiff
    return a.deadline.toMillis() - b.deadline.toMillis()
  })
}
