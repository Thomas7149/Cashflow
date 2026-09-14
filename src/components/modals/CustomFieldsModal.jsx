import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import Modal from './Modal'

function makeFieldId() {
  return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export default function CustomFieldsModal({ fields, close, onSave, notify }) {
  const [items, setItems] = useState(fields)
  const [saving, setSaving] = useState(false)

  const addField = () => setItems((current) => [...current, { id: makeFieldId(), label: '', required: false }])
  const removeField = (id) => setItems((current) => current.filter((f) => f.id !== id))
  const updateField = (id, patch) => setItems((current) => current.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const save = async () => {
    const cleaned = items.map((f) => ({ ...f, label: f.label.trim() })).filter((f) => f.label)
    setSaving(true)
    try {
      await onSave(cleaned)
      notify?.('Fiche d’inscription mise à jour')
      close()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Fiche d’inscription" subtitle="Ajoutez les informations que vos étudiants devront remplir, en plus du nom et de la formation." close={close}>
      <div className="form" style={{ marginBottom: 14 }}>
        {items.map((field) => (
          <div key={field.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Ex. Numéro de téléphone"
              style={{ flex: 1 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} />
              Obligatoire
            </label>
            <button type="button" className="button-secondary" onClick={() => removeField(field.id)} style={{ paddingInline: 10 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {!items.length && <p style={{ fontSize: 11, color: '#8b9482', margin: 0 }}>Aucun champ pour l’instant — seuls le nom et la formation sont demandés.</p>}
      </div>
      <button type="button" className="button-secondary full" onClick={addField}><Plus size={16} /> Ajouter un champ</button>
      <button type="button" className="button-primary full" onClick={save} disabled={saving} style={{ marginTop: 10 }}>
        <Check size={17} /> {saving ? 'Enregistrement...' : 'Enregistrer la fiche'}
      </button>
    </Modal>
  )
}