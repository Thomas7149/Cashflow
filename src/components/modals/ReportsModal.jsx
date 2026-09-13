import { Download } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import Modal from './Modal'

export default function ReportsModal({ studentsCount, collected, remaining, close, onDownload }) {
  return (
    <Modal title="Rapports de trésorerie" subtitle="Synthèse des inscriptions et paiements enregistrés." close={close}>
      <div className="report-summary">
        <div><span>Étudiants</span><b>{studentsCount}</b></div>
        <div><span>Encaissé</span><b>{formatMoney(collected)}</b></div>
        <div><span>À encaisser</span><b>{formatMoney(remaining)}</b></div>
      </div>
      <button className="button-primary full" onClick={onDownload}><Download size={17} /> Télécharger le rapport CSV</button>
    </Modal>
  )
}
