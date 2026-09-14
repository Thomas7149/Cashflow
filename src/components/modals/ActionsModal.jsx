import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Check, Download, Pencil, Trash2, Wallet, X } from 'lucide-react'
import { formatMoney, paidPercent } from '../../lib/format'
import { studentUrl } from '../../lib/urls'
import Modal from './Modal'

export default function ActionsModal({ student, centreId, customFields = [], close, onRecordPayment, onDownloadCard, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(student.name)
  const [saving, setSaving] = useState(false)

  const saveName = async () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed === student.name) { setEditing(false); return }
    setSaving(true)
    try {
      await onRename(trimmed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={editing ? '' : student.name}
      subtitle={editing ? '' : `${student.id} · ${student.course}`}
      close={close}
    >
      {editing ? (
        <div className="form" style={{ marginTop: -8, marginBottom: 14 }}>
          <label>Nom complet
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <button type="button" className="button-primary" onClick={saveName} disabled={saving} style={{ paddingInline: 12 }}><Check size={16} /></button>
              <button type="button" className="button-secondary" onClick={() => { setName(student.name); setEditing(false) }} style={{ paddingInline: 12 }}><X size={16} /></button>
            </div>
          </label>
        </div>
      ) : (
        <button type="button" className="button-ghost" onClick={() => setEditing(true)} style={{ marginTop: -10, marginBottom: 10 }}>
          <Pencil size={13} /> Modifier le nom
        </button>
      )}

      <div className="qr-preview">
        <QRCodeCanvas value={studentUrl(centreId, student.id)} size={150} />
        <div><b>{paidPercent(student)}% payé</b><span>Reste {formatMoney(student.total - student.paid)}</span></div>
      </div>

      {student.customAnswers && Object.keys(student.customAnswers).length > 0 && (
        <div className="course-catalog" style={{ marginBottom: 14 }}>
          <b>Fiche d’inscription</b>
          {customFields
            .filter((field) => student.customAnswers[field.id])
            .map((field) => <div key={field.id}><span>{field.label}</span><strong>{student.customAnswers[field.id]}</strong></div>)}
        </div>
      )}
      <div className="modal-actions">
        <button className="button-primary full" onClick={onRecordPayment}><Wallet size={17} /> Enregistrer un paiement</button>
        <button className="button-secondary full" onClick={onDownloadCard}><Download size={17} /> Télécharger la carte PDF</button>
        <button className="button-secondary full" onClick={onDelete} style={{ color: '#a53b3b' }}><Trash2 size={17} /> Supprimer cet étudiant</button>
      </div>
    </Modal>
  )
}