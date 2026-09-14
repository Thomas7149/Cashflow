import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ title, message, confirmLabel, close, onConfirm, danger = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal confirm-modal">
        <div className="modal-heading">
          <div className="modal-symbol"><AlertTriangle size={20} /></div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="button-secondary" onClick={close}>Annuler</button>
          <button className={danger ? 'button-primary danger' : 'button-primary'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}