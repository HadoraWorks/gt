'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserById, createUser, isProfileComplete } from '@/lib/firestore/users'
import type { User } from '@/types'

interface AuthContextValue {
  firebaseUser: FirebaseUser | null
  appUser: User | null
  loading: boolean
  signInEmail: (email: string, password: string) => Promise<void>
  signUpEmail: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [appUser, setAppUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadAppUser = async (fbUser: FirebaseUser) => {
    const user = await getUserById(fbUser.uid)
    if (!user) {
      // New user — create with default employee role
      const newUser: Omit<User, 'uid' | 'createdAt'> = {
        name: fbUser.displayName ?? '',
        phone: '',
        email: fbUser.email ?? '',
        role: 'employee',
        photoURL: fbUser.photoURL ?? '',
        isActive: true,
      }
      await createUser(fbUser.uid, newUser)
      const created = await getUserById(fbUser.uid)
      setAppUser(created)
    } else {
      setAppUser(user)
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        await loadAppUser(fbUser)
      } else {
        setAppUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const refreshUser = async () => {
    if (firebaseUser) {
      await loadAppUser(firebaseUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{ firebaseUser, appUser, loading, signInEmail, signUpEmail, signInGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function useProfileComplete(): boolean {
  const { appUser } = useAuth()
  if (!appUser) return false
  return isProfileComplete(appUser)
}
