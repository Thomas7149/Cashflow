import { useEffect, useState } from 'react'
import { AlertTriangle, Check, Wallet } from 'lucide-react'
import { claimInvite } from '../../services/invites'

export default function AcceptInvite({ centreId, inviteId, user, onDone }) {
  const [status, setStatus] = useState('claiming') // claiming | done | error
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    claimInvite(centreId, inviteId, user)
      .then(() => { if (active) setStatus('done') })
      .catch((err) => { if (active) { setError(err.message || 'Impossible d’accepter l’invitation.'); setStatus('error') } })
    return () => { active = false }
  }, [centreId, inviteId, user])

  return (
    <main className="auth-shell">
      <div className="auth-brand brand"><span className="brand-mark"><Wallet size={18} /></span>cashflow<span className="brand-dot">.</span></div>
      <div className="auth-card loading-card">
        {status === 'claiming' && <><div className="loading-spinner" /><p>Association de votre compte au centre...</p></>}
        {status === 'done' && (
          <>
            <Check size={26} />
            <p>Vous avez rejoint le centre avec succès.</p>
            <button className="button-primary full" onClick={onDone}>Accéder au tableau de bord</button>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertTriangle size={26} />
            <p>{error}</p>
            <button className="button-secondary full" onClick={onDone}>Retour</button>
          </>
        )}
      </div>
    </main>
  )
}