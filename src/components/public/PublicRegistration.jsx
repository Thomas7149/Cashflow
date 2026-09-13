import { useState } from 'react'
import { Check, QrCode } from 'lucide-react'

export default function PublicRegistration({ courses, initialCourse, loading, onSubmit, error }) {
  const [submitting, setSubmitting] = useState(false)
  const courseNames = Object.keys(courses)
  const decodedInitial = initialCourse ? decodeURIComponent(initialCourse) : ''
  const selectedCourse = courseNames.includes(decodedInitial) ? decodedInitial : courseNames[0] || ''

  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name').toString().trim()
    const course = data.get('course')
    const total = Number(courses[course])
    if (!name || !course || !total) return
    setSubmitting(true)
    try {
      await onSubmit({ name, course, total })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="student-public">
        <div className="public-brand">cashflow<span>.</span></div>
        <div className="public-card"><p>Chargement des formations...</p></div>
      </div>
    )
  }

  if (!courseNames.length) {
    return (
      <div className="student-public">
        <div className="public-brand">cashflow<span>.</span></div>
        <div className="public-card">
          <div className="modal-symbol"><QrCode size={20} /></div>
          <h1>Inscription indisponible</h1>
          <p>Ce lien d’inscription n’est plus valide ou ce centre n’a pas encore de formation ouverte.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="student-public">
      <div className="public-brand">cashflow<span>.</span></div>
      <div className="public-card">
        <div className="modal-symbol"><QrCode size={20} /></div>
        <p className="eyebrow">INSCRIPTION FORMATION</p>
        <h1>{selectedCourse || 'Inscription étudiant'}</h1>
        <p className="public-course">Remplissez vos informations pour créer votre dossier.</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={submit} className="form">
          <label>Nom complet<input name="name" placeholder="Ex. Aminata Fall" required autoFocus /></label>
          <label>Formation
            <select name="course" defaultValue={selectedCourse} required>
              {courseNames.map((course) => <option key={course}>{course}</option>)}
            </select>
          </label>
          <button className="button-primary full" disabled={submitting}><Check size={17} /> {submitting ? 'Inscription...' : 'Valider mon inscription'}</button>
        </form>
      </div>
    </div>
  )
}
