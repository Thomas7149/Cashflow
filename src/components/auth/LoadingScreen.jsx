import { Wallet } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <main className="auth-shell">
      <div className="auth-card loading-card">
        <div className="brand auth-brand"><span className="brand-mark"><Wallet size={18} /></span>cashflow<span className="brand-dot">.</span></div>
        <div className="loading-spinner" />
        <p>Connexion sécurisée...</p>
      </div>
    </main>
  )
}
