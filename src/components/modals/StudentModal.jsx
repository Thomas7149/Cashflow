import { useState } from 'react'
import { Plus, QrCode } from 'lucide-react'
import Modal from './Modal'

export default function StudentModal({ courses, customFields = [], close, onSubmit, onCreateCourse }) {
  const courseNames = Object.keys(courses)
  const [course, setCourse] = useState(courseNames[0] || '')
  const [total, setTotal] = useState(courses[courseNames[0]] ?? '')
  const [submitting, setSubmitting] = useState(false)

  const selectCourse = (nextCourse) => {
    setCourse(nextCourse)
    setTotal(courses[nextCourse] ?? '') // pre-fill from the course fee; the manager can still edit it below
  }

  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name')?.toString().trim()
    const amount = Number(total)
    if (!name || !course || !amount || amount <= 0) return

    const customAnswers = {}
    customFields.forEach((field) => {
      const value = data.get(`custom-${field.id}`)?.toString().trim()
      if (value) customAnswers[field.id] = value
    })

    setSubmitting(true)
    try {
      await onSubmit({ name, course, total: amount, customAnswers })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Inscrire un étudiant" subtitle="Créez son profil et générez sa carte QR." close={close}>
      <form onSubmit={submit} className="form">
        <label>Nom complet<input name="name" placeholder="Ex. Aminata Fall" autoFocus required /></label>
        <label>Formation
          <select name="course" value={course} onChange={(e) => selectCourse(e.target.value)}>
            {courseNames.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <label>Montant total de la formation
          <input name="total" type="number" value={total} onChange={(e) => setTotal(e.target.value)} min="1" step="1" required />
        </label>
        {customFields.map((field) => (
          <label key={field.id}>{field.label}
            <input name={`custom-${field.id}`} required={field.required} />
          </label>
        ))}
        <button className="button-primary full" disabled={submitting}><QrCode size={17} /> {submitting ? 'Inscription...' : 'Inscrire et générer le QR'}</button>
      </form>
      {onCreateCourse && (
        <button className="button-secondary full course-create-link" onClick={onCreateCourse}><Plus size={16} /> Créer une nouvelle formation</button>
      )}
    </Modal>
  )
}