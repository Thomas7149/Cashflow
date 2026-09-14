import { useState } from 'react'
import { Check } from 'lucide-react'
import Modal from './Modal'

export default function EditProfileModal({ currentName, email, close, onSave }) {
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const name = new FormData(event.currentTarget).get('name').toString().trim()
    if (!name) return
    setSaving(true)
    try {
      await onSave(name)
      close()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Votre profil" subtitle={email || 'Votre compte'} close={close}>
      <form className="form" onSubmit={submit}>
        <label>Nom affiché<input name="name" defaultValue={currentName} placeholder="Ex. Aïcha Kponou" autoFocus required /></label>
        <button className="button-primary full" disabled={saving}><Check size={17} /> {saving ? 'Enregistrement...' : 'Enregistrer'}</button>
      </form>
    </Modal>
  )
}