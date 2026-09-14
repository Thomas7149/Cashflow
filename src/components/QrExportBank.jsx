import { QRCodeCanvas } from 'qrcode.react'
import { studentUrl, courseUrl } from '../lib/urls'

// Renders every student's and course's QR code off-screen so pdf.js can read
// their pixel data with a plain DOM query when generating a PDF. This is
// simpler and more reliable than re-rendering QR codes inside jsPDF itself.
export default function QrExportBank({ centreId, students, courses }) {
  return (
    <div className="qr-export-bank" aria-hidden="true">
      {students.map((s) => <QRCodeCanvas key={s.id} data-qr={s.id} value={studentUrl(centreId, s.id)} size={180} />)}
      {Object.keys(courses).map((course) => (
        <QRCodeCanvas key={course} data-course-qr={course} value={courseUrl(centreId, course)} size={240} />
      ))}
    </div>
  )
}