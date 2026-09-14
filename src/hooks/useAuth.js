import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, firebaseErrorMessage, firebaseReady, googleProvider } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(firebaseReady)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!firebaseReady || !auth) return undefined
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })
  }, [])

  const runAuthAction = async (action) => {
    setAuthError('')
    try {
      await action()
    } catch (error) {
      setAuthError(firebaseErrorMessage(error))
    }
  }

  const login = (email, password) => runAuthAction(() => signInWithEmailAndPassword(auth, email, password))
  const signup = (email, password) => runAuthAction(() => createUserWithEmailAndPassword(auth, email, password))
  const loginWithGoogle = () => runAuthAction(() => signInWithPopup(auth, googleProvider))
  const logout = () => auth && signOut(auth)

  const updateDisplayName = async (name) => {
    await updateProfile(auth.currentUser, { displayName: name })
    // auth.currentUser mutates in place, so re-set state with a fresh object
    // reference to trigger a re-render of anything reading user.displayName.
    setUser((current) => (current ? { ...current, displayName: name } : current))
  }

  return { user, authLoading, authError, login, signup, loginWithGoogle, logout, updateDisplayName }
}