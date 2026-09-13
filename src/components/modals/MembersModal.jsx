import { useState } from 'react'
import { Check, Copy, Send } from 'lucide-react'
import Modal from './Modal'

export default function MembersModal({ userLabel, close, onInvite, notify }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [link, setLink] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSending(true)
    try {
      const url = await onInvite(email.trim())
      setLink(url)
    } finally {
      setSending(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(link)
    notify?.('Lien d’invitation copié')
  }

  return (
    <Modal title="Membres du centre" subtitle="Un caissier peut inscrire des étudiants et encaisser, sans accéder aux paramètres." close={close}>
      <div className="member-card">
        <span className="profile-avatar">{(userLabel || 'GE').slice(0, 2).toUpperCase()}</span>
        <span><b>{userLabel || 'Gestionnaire principal'}</b><small>Propriétaire · Accès complet</small></span>
        <span className="tag tag-lime">ACTIF</span>
      </div>

      {!link ? (
        <form className="form" onSubmit={submit}>
          <label>Email du caissier à inviter
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="collegue@votrecentre.com" required autoFocus />
          </label>
          <button className="button-primary full" disabled={sending}><Send size={16} /> {sending ? 'Génération...' : 'Générer le lien d’invitation'}</button>
        </form>
      ) : (
        <div className="form">
          <p style={{ fontSize: 11, color: '#7b8a7c', margin: 0 }}>
            <Check size={13} style={{ verticalAlign: -2 }} /> Envoyez ce lien à <b>{email}</b> par WhatsApp, SMS ou email. Il ne fonctionne qu’une seule fois.
          </p>
          <label>Lien d’invitation<input readOnly value={link} onFocus={(e) => e.target.select()} /></label>
          <button type="button" className="button-secondary full" onClick={copyLink}><Copy size={15} /> Copier le lien</button>
          <button type="button" className="button-ghost full" onClick={() => { setLink(''); setEmail('') }}>Inviter une autre personne</button>
        </div>
      )}
    </Modal>
  )
}