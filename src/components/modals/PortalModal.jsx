import { QRCodeCanvas } from 'qrcode.react'
import { ArrowUpRight, Download } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import { courseUrl } from '../../lib/urls'
import Modal from './Modal'

export default function PortalModal({ centreId, courses, close, onCopyLink, onDownload }) {
  return (
    <Modal title="QR d’inscription par formation" subtitle="Chaque QR ouvre directement l’inscription pour la formation choisie." close={close}>
      <div className="course-qr-list">
        {Object.keys(courses).map((course) => (
          <div className="course-qr-item" key={course}>
            <QRCodeCanvas value={courseUrl(centreId, course)} size={92} />
            <div>
              <b>{course}</b>
              <small>{formatMoney(courses[course])}</small>
              <button className="button-ghost" onClick={() => onCopyLink(course)}>Copier le lien <ArrowUpRight size={13} /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="button-primary full" onClick={onDownload}><Download size={17} /> Télécharger tous les QR en PDF</button>
    </Modal>
  )
}
