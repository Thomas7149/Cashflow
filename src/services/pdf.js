import { jsPDF } from 'jspdf'
import { formatMoney } from '../lib/format'
import { hexToRgb } from '../lib/color'

// These functions read pre-rendered QR <canvas> elements from the DOM (see
// QrExportBank) because jsPDF needs actual pixel data to embed an image — this
// is unavoidable DOM access, not a substitute for React state, and is the only
// place in the app that reads the DOM directly.
function qrCanvasDataUrl(selector) {
  const canvas = document.querySelector(selector)
  return canvas ? canvas.toDataURL('image/png') : null
}

// The centre logo can be hosted on Firebase Storage (or, in local demo mode,
// already be a data URL). Either way jsPDF needs the actual pixel data, so we
// fetch it once per document. If the fetch fails for any reason (network,
// CORS, a since-deleted file) the PDF still generates fine, just without the
// logo image — never block a download over a decorative asset.
async function toDataUrl(url) {
  if (!url) return null
  if (url.startsWith('data:')) return url
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function paintCover(pdf, brandColor) {
  const { r, g, b } = hexToRgb(brandColor || '#1c2622')
  pdf.setFillColor(r, g, b)
  pdf.rect(0, 0, 210, 297, 'F')
}

function drawHeaderBrand(pdf, logoDataUrl, centreName, x, y) {
  if (logoDataUrl) {
    try { pdf.addImage(logoDataUrl, x, y - 8, 16, 16) } catch { /* unsupported format, fall back to text only */ }
  }
  pdf.setFontSize(logoDataUrl ? 18 : 24)
  pdf.text((centreName || 'CASHFLOW CAMPUS').toUpperCase(), logoDataUrl ? x + 20 : x, y)
}

export async function downloadStudentCard(student, branding = {}) {
  const image = qrCanvasDataUrl(`[data-qr="${student.id}"]`)
  if (!image) return false
  const logoDataUrl = await toDataUrl(branding.logoUrl)
  const pdf = new jsPDF()
  paintCover(pdf, branding.brandColor)
  pdf.setTextColor(246, 243, 233)
  drawHeaderBrand(pdf, logoDataUrl, branding.centreName, 20, 30)
  pdf.setFontSize(11)
  pdf.text('Carte de suivi étudiant', 20, 39)
  pdf.addImage(image, 'PNG', 64, 70, 82, 82)
  pdf.setFontSize(21)
  pdf.text(student.name, 105, 181, { align: 'center' })
  pdf.setFontSize(12)
  pdf.text(`${student.id}  ·  ${student.course}`, 105, 191, { align: 'center' })
  pdf.text(`Solde restant : ${formatMoney(student.total - student.paid)}`, 105, 219, { align: 'center' })
  pdf.save(`cashflow-${student.id}.pdf`)
  return true
}

export async function downloadAllStudentCards(students) {
  if (!students.length) return false
  const pdf = new jsPDF()
  const cardWidth = 95, cardHeight = 63, left = 10, top = 13, gapX = 10, gapY = 7
  students.forEach((student, index) => {
    const slot = index % 8, column = slot % 2, row = Math.floor(slot / 2)
    if (index > 0 && slot === 0) pdf.addPage()
    const x = left + column * (cardWidth + gapX), y = top + row * (cardHeight + gapY)
    pdf.setDrawColor(211, 218, 205)
    pdf.setLineWidth(0.35)
    pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2)
    const image = qrCanvasDataUrl(`[data-qr="${student.id}"]`)
    if (image) pdf.addImage(image, 'PNG', x + 30, y + 5, 35, 35)
    pdf.setTextColor(39, 53, 45)
    pdf.setFontSize(12)
    pdf.text(student.name, x + cardWidth / 2, y + 51, { align: 'center', maxWidth: cardWidth - 10 })
  })
  pdf.save('cashflow-cartes-etudiants.pdf')
  return true
}

export async function downloadRegistrationQrPdf(branding = {}) {
  const image = qrCanvasDataUrl('[data-register-qr="1"]')
  if (!image) return false
  const logoDataUrl = await toDataUrl(branding.logoUrl)
  const pdf = new jsPDF()
  paintCover(pdf, branding.brandColor)
  pdf.setTextColor(246, 243, 233)
  drawHeaderBrand(pdf, logoDataUrl, branding.centreName, 20, 30)
  pdf.setFontSize(12)
  pdf.text('QR d’inscription', 20, 42)
  pdf.addImage(image, 'PNG', 55, 70, 100, 100)
  pdf.setTextColor(39, 53, 45)
  pdf.setFontSize(20)
  pdf.text('Inscrivez-vous ici', 105, 205, { align: 'center', maxWidth: 170 })
  pdf.setFontSize(11)
  pdf.text('Scannez ce code et choisissez votre formation', 105, 220, { align: 'center' })
  pdf.save('cashflow-qr-inscription.pdf')
  return true
}

export async function downloadReceipt(student, amount, receiptNumber, branding = {}) {
  const logoDataUrl = await toDataUrl(branding.logoUrl)
  const pdf = new jsPDF()
  paintCover(pdf, branding.brandColor)
  pdf.setTextColor(246, 243, 233)
  drawHeaderBrand(pdf, logoDataUrl, branding.centreName, 20, 30)
  pdf.setFontSize(11)
  pdf.text('Reçu de paiement', 20, 40)
  pdf.setTextColor(39, 53, 45)
  pdf.setFillColor(246, 248, 242)
  pdf.roundedRect(18, 62, 174, 124, 4, 4, 'F')
  pdf.setFontSize(10)
  pdf.text('N° DE REÇU', 30, 82)
  pdf.setFontSize(13)
  pdf.text(receiptNumber, 30, 91)
  pdf.setFontSize(10)
  pdf.text('ÉTUDIANT', 30, 112)
  pdf.setFontSize(16)
  pdf.text(student.name, 30, 124)
  pdf.setFontSize(10)
  pdf.text(`${student.id} · ${student.course}`, 30, 136)
  pdf.text('MONTANT VERSÉ', 30, 158)
  pdf.setFontSize(18)
  pdf.text(formatMoney(amount), 30, 172)
  pdf.setFontSize(10)
  pdf.setTextColor(102, 119, 105)
  pdf.text(`Solde restant après paiement : ${formatMoney(Math.max(0, student.total - student.paid - amount))}`, 30, 205)
  pdf.save(`${receiptNumber}.pdf`)
}

export function downloadPaymentsReportCsv(payments, students, customFields = []) {
  const paymentRows = [
    ['Date', 'N° reçu', 'Étudiant', 'Identifiant', 'Cursus', 'Montant versé'],
    ...payments.map((p) => [
      p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString('fr-FR') : new Date(p.createdAt).toLocaleString('fr-FR'),
      p.receiptNumber || '',
      p.studentName,
      p.studentId,
      p.course,
      p.amount,
    ]),
  ]

  const studentRows = [
    ['Nom', 'Identifiant', 'Cursus', 'Total', 'Payé', 'Reste', ...customFields.map((f) => f.label)],
    ...students.map((s) => [
      s.name, s.id, s.course, s.total, s.paid, s.total - s.paid,
      ...customFields.map((f) => s.customAnswers?.[f.id] || ''),
    ]),
  ]

  const toCsv = (rows) => rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(';')).join('\n')
  const csv = `=== Paiements ===\n${toCsv(paymentRows)}\n\n=== Étudiants ===\n${toCsv(studentRows)}`
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `rapport-paiements-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}