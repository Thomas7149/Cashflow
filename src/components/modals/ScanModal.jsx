import { ArrowUpRight } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import Modal from './Modal'
import QrScanner from '../QrScanner'

export default function ScanModal({ students, close, onFound, onPick }) {
  const handleFound = (value) => {
    let id = value
    try { id = new URL(value, window.location.origin).hash.match(/student=([^&]+)/)?.[1] || value } catch { /* not a URL, use raw value */ }
    onFound(id)
  }

  return (
    <Modal title="Scanner un QR étudiant" subtitle="Pointez la caméra vers la carte de l’étudiant." close={close}>
      <QrScanner onFound={handleFound} />
      <div className="scan-list">
        {students.map((s) => (
          <button key={s.id} onClick={() => onPick(s)}>
            <span className={`avatar ${s.color}`}>{s.initials}</span>
            <span><b>{s.name}</b><small>{s.id} · reste {formatMoney(s.total - s.paid)}</small></span>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
    </Modal>
  )
}
