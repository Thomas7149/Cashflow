import { QRCodeCanvas } from 'qrcode.react'
import { studentUrl, registerUrl } from '../lib/urls'

// Renders every student's QR code, plus the centre's single registration QR,
// off-screen so pdf.js can read their pixel data with a plain DOM query when
// generating a PDF. This is simpler and more reliable than re-rendering QR
// codes inside jsPDF itself.
export default function QrExportBank({ centreId, students }) {
  return (
    <div className="qr-export-bank" aria-hidden="true">
      {students.map((s) => <QRCodeCanvas key={s.id} data-qr={s.id} value={studentUrl(centreId, s.id)} size={180} />)}
      <QRCodeCanvas data-register-qr="1" value={registerUrl(centreId)} size={240} />
    </div>
  )
}