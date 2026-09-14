import { useState } from 'react'
import { Check } from 'lucide-react'
import Modal from './Modal'

export default function CourseCreateModal({ close, onSubmit }) {
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('courseName').toString().trim()
    const fee = Number(data.get('courseFee'))
    const description = data.get('courseDescription').toString().trim()
    if (!name || !fee || fee <= 0) return
    setSubmitting(true)
    try {
      await onSubmit({ name, fee, description })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Créer une formation" subtitle="Définissez le programme et son montant de référence." close={close}>
      <form onSubmit={submit} className="form">
        <label>Nom de la formation<input name="courseName" placeholder="Ex. Infographie" autoFocus required /></label>
        <label>Frais de formation<input name="courseFee" type="number" min="1" step="1" placeholder="Ex. 350000" required /></label>
        <label>Description<input name="courseDescription" placeholder="Ex. Parcours certifiant de 6 mois" /></label>
        <button className="button-primary full" disabled={submitting}><Check size={17} /> {submitting ? 'Enregistrement...' : 'Enregistrer la formation'}</button>
      </form>
    </Modal>
  )
}