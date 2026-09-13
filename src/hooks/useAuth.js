import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
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

  return { user, authLoading, authError, login, signup, loginWithGoogle, logout }
}
