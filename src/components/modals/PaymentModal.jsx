import { useState } from 'react'
import { Check } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import Modal from './Modal'

export default function PaymentModal({ student, close, onSubmit, error }) {
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const amount = Number(new FormData(event.currentTarget).get('amount'))
    if (!amount || amount <= 0) return
    setSubmitting(true)
    try {
      await onSubmit(amount)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Enregistrer un paiement" subtitle={`${student.name} · reste ${formatMoney(student.total - student.paid)}`} close={close}>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={submit} className="form">
        <label>Montant versé<input name="amount" type="number" min="1" max={student.total - student.paid} placeholder="Ex. 100000" autoFocus required /></label>
        <button className="button-primary full" disabled={submitting}><Check size={17} /> {submitting ? 'Validation...' : 'Valider le paiement'}</button>
      </form>
    </Modal>
  )
}
