import { Check, QrCode } from 'lucide-react'
import { formatMoney, paidPercent } from '../../lib/format'

export default function StudentStatus({ student, loading, onBack }) {
  if (loading) {
    return (
      <div className="student-public">
        <div className="public-brand">cashflow<span>.</span></div>
        <div className="public-card"><p>Chargement du dossier...</p></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="student-public">
        <div className="public-brand">cashflow<span>.</span></div>
        <div className="public-card">
          <div className="modal-symbol"><QrCode size={20} /></div>
          <h1>Profil introuvable</h1>
          <p>Ce code QR n’est plus associé à un étudiant actif.</p>
          <button className="button-primary full" onClick={onBack}>Retour</button>
        </div>
      </div>
    )
  }

  return (
    <div className="student-public">
      <div className="public-brand">cashflow<span>.</span></div>
      <div className="public-card">
        <div className={`public-avatar avatar ${student.color}`}>{student.initials}</div>
        <p className="eyebrow">STATUT ÉTUDIANT</p>
        <h1>{student.name}</h1>
        <p className="public-course">{student.course}</p>
        <div className="public-status">
          <div><span>Montant versé</span><b>{formatMoney(student.paid)}</b></div>
          <div><span>Reste à payer</span><b>{formatMoney(student.total - student.paid)}</b></div>
        </div>
        <div className="public-progress">
          <div><span>Progression de la formation</span><b>{paidPercent(student)}%</b></div>
          <div className="progress-track"><span style={{ width: `${paidPercent(student)}%` }} /></div>
        </div>
        <p className="public-note"><Check size={15} /> Dossier actif au Campus</p>
        <button className="button-ghost public-back" onClick={onBack}>Fermer</button>
      </div>
    </div>
  )
}
