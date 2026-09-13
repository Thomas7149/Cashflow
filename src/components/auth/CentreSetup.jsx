import { Check, Wallet } from 'lucide-react'

export default function CentreSetup({ onSubmit, error }) {
  return (
    <main className="auth-shell">
      <div className="auth-brand brand"><span className="brand-mark"><Wallet size={18} /></span>cashflow<span className="brand-dot">.</span></div>
      <div className="auth-card setup-card">
        <div className="auth-heading">
          <p className="eyebrow">PREMIÈRE CONFIGURATION</p>
          <h1>Configurez votre centre.</h1>
          <p>Ces informations seront utilisées pour votre espace et vos inscriptions.</p>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <label>Nom du centre<input name="centreName" placeholder="Ex. Institut Horizon" required autoFocus /></label>
          <label>Devise
            <select name="currency" defaultValue="FCFA">
              <option>FCFA</option><option>EUR</option><option>USD</option>
            </select>
          </label>
          <p className="form-section-label">Votre première formation</p>
          <label>Nom de la formation<input name="courseName" placeholder="Ex. Développement web" required /></label>
          <label>Frais de formation<input name="courseFee" type="number" min="1" step="1" placeholder="Saisissez le montant exact" required /></label>
          {error && <p className="auth-error">{error}</p>}
          <button className="button-primary full"><Check size={17} /> Enregistrer et accéder au tableau de bord</button>
        </form>
      </div>
    </main>
  )
}
