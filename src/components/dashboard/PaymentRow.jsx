import { Check } from 'lucide-react'
import { formatMoney, initialsOf } from '../../lib/format'

const COLORS = ['mint', 'lavender', 'sky']

export default function PaymentRow({ payment, index }) {
  return (
    <div className="payment-row">
      <span className={`avatar ${COLORS[index % COLORS.length]}`}>{initialsOf(payment.studentName)}</span>
      <span className="payment-info">
        <b>{payment.studentName || 'Étudiant'}</b>
        <small>{payment.course || 'Formation'} · Paiement enregistré</small>
      </span>
      <b className="payment-amount">{formatMoney(payment.amount)}</b>
      <span className="payment-status"><Check size={12} /></span>
    </div>
  )
}
