import { useState } from 'react'
import { AlertTriangle, Wallet } from 'lucide-react'
import PasswordInput from '../PasswordInput'

export default function AuthScreen({ error, onLogin, onSignup, onGoogle }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (event) => {
    event.preventDefault()
    ;(mode === 'login' ? onLogin : onSignup)(email, password)
  }

  return (
    <main className="auth-shell">
      <div className="auth-brand brand"><span className="brand-mark"><Wallet size={18} /></span>cashflow<span className="brand-dot">.</span></div>
      <div className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">ESPACE GESTIONNAIRE</p>
          <h1>{mode === 'login' ? 'Bon retour.' : 'Créer votre espace.'}</h1>
          <p>{mode === 'login' ? 'Connectez-vous pour piloter votre centre.' : 'Commencez à gérer votre trésorerie simplement.'}</p>
        </div>
        {error && <div className="auth-error"><AlertTriangle size={15} />{error}</div>}
        <form className="form" onSubmit={submit}>
          <label>Email professionnel
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@votrecentre.com" required autoFocus />
          </label>
          <label>Mot de passe
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" minLength="6" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>
          <button className="button-primary full">{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
        </form>
        <div className="auth-divider"><span>ou</span></div>
        <button className="button-secondary full google-button" onClick={onGoogle}><span className="google-mark">G</span> Continuer avec Google</button>
        <p className="auth-switch">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Créer un compte' : 'Se connecter'}</button>
        </p>
      </div>
    </main>
  )
}