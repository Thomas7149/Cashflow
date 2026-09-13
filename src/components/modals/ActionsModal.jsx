import { QRCodeCanvas } from 'qrcode.react'
import { Download, Wallet } from 'lucide-react'
import { formatMoney, paidPercent } from '../../lib/format'
import { studentUrl } from '../../lib/urls'
import Modal from './Modal'

export default function ActionsModal({ student, centreId, close, onRecordPayment, onDownloadCard }) {
  return (
    <Modal title={student.name} subtitle={`${student.id} · ${student.course}`} close={close}>
      <div className="qr-preview">
        <QRCodeCanvas value={studentUrl(centreId, student.id)} size={150} />
        <div><b>{paidPercent(student)}% payé</b><span>Reste {formatMoney(student.total - student.paid)}</span></div>
      </div>
      <div className="modal-actions">
        <button className="button-primary full" onClick={onRecordPayment}><Wallet size={17} /> Enregistrer un paiement</button>
        <button className="button-secondary full" onClick={onDownloadCard}><Download size={17} /> Télécharger la carte PDF</button>
      </div>
    </Modal>
  )
}
