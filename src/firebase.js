import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasConfig = Object.values(firebaseConfig).every(Boolean)
export const firebaseReady = hasConfig
export const firebaseApp = hasConfig ? initializeApp(firebaseConfig) : null
export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const db = firebaseApp ? getFirestore(firebaseApp) : null
export const googleProvider = firebaseApp ? new GoogleAuthProvider() : null

export function firebaseErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'Email ou mot de passe incorrect.',
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
    'auth/invalid-email': 'L’adresse email n’est pas valide.',
    'auth/popup-closed-by-user': 'La fenêtre Google a été fermée.',
    'auth/popup-blocked': 'Le navigateur a bloqué la fenêtre Google.',
    'auth/network-request-failed': 'Connexion réseau impossible. Réessayez.',
  }
  return messages[error?.code] || 'Une erreur est survenue. Réessayez dans un instant.'
}