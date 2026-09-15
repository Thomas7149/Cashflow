import { QRCodeCanvas } from 'qrcode.react'
import { ArrowUpRight, Download } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import { registerUrl } from '../../lib/urls'
import Modal from './Modal'

export default function PortalModal({ centreId, courses, close, onCopyLink, onDownload }) {
  const courseNames = Object.keys(courses)

  return (
    <Modal title="QR d’inscription" subtitle="Un seul code à partager : l’étudiant choisit sa formation au moment de s’inscrire." close={close}>
      <div className="portal-qr">
        <QRCodeCanvas value={registerUrl(centreId)} size={170} />
      </div>

      <button className="button-secondary full" onClick={onCopyLink}>
        Copier le lien d’inscription <ArrowUpRight size={14} />
      </button>

      {courseNames.length > 0 && (
        <div className="course-catalog" style={{ marginTop: 14, marginBottom: 4 }}>
          <b>Formations proposées à l’inscription</b>
          {courseNames.map((course) => <div key={course}><span>{course}</span><strong>{formatMoney(courses[course])}</strong></div>)}
        </div>
      )}

      <button className="button-primary full" onClick={onDownload} style={{ marginTop: 10 }}>
        <Download size={17} /> Télécharger l’affiche PDF
      </button>
    </Modal>
  )
}