import { Check, Download, Plus, QrCode } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import StudentDirectoryCard from './StudentDirectoryCard'

export default function WorkspaceView({ nav, students, collected, expected, onAddStudent, onExportCards }) {
  if (nav === 'Vue d’ensemble') return null

  const openBalances = students.filter((s) => s.paid < s.total)

  if (nav === 'Étudiants') {
    return (
      <section className="workspace-view">
        <div className="view-heading">
          <div>
            <p className="eyebrow">GESTION DES INSCRIPTIONS</p>
            <h1>Tous les étudiants</h1>
            <p>Inscrivez, suivez et partagez les cartes QR de votre centre.</p>
          </div>
          <button className="button-primary" onClick={onAddStudent}><Plus size={17} /> Inscrire un étudiant</button>
        </div>
        <div className="view-stats">
          <div><span>Total inscrits</span><b>{students.length}</b></div>
          <div><span>À jour</span><b>{students.filter((s) => s.paid === s.total).length}</b></div>
          <div><span>Soldes ouverts</span><b>{openBalances.length}</b></div>
        </div>
        <div className="panel view-panel">
          <div className="panel-header">
            <div><h2>Répertoire étudiants</h2><p>Utilisez les actions de la vue d’ensemble pour ouvrir chaque dossier.</p></div>
            <button className="button-secondary" onClick={onExportCards}><Download size={15} /> Exporter les cartes QR</button>
          </div>
          <div className="directory-grid">
            {students.map((s) => <StudentDirectoryCard key={s.id} student={s} />)}
          </div>
        </div>
      </section>
    )
  }

  if (nav === 'Trésorerie') {
    return (
      <section className="workspace-view">
        <div className="view-heading">
          <div>
            <p className="eyebrow">SUIVI FINANCIER</p>
            <h1>Trésorerie</h1>
            <p>Une lecture claire de vos encaissements et soldes ouverts.</p>
          </div>
        </div>
        <div className="view-stats">
          <div><span>Encaissé</span><b>{formatMoney(collected)}</b></div>
          <div><span>À encaisser</span><b>{formatMoney(expected - collected)}</b></div>
          <div><span>Taux de recouvrement</span><b>{expected ? Math.round((collected / expected) * 100) : 0}%</b></div>
        </div>
        <div className="panel view-panel">
          <div className="panel-header">
            <div><h2>Soldes à recouvrer</h2><p>Les étudiants qui ont encore un paiement à effectuer.</p></div>
          </div>
          <div className="directory-grid">
            {openBalances.map((s) => <StudentDirectoryCard key={s.id} student={s} balanceClassName="paid-open" />)}
          </div>
        </div>
      </section>
    )
  }

  // 'Codes QR'
  return (
    <section className="workspace-view">
      <div className="view-heading">
        <div>
          <p className="eyebrow">IDENTIFICATION</p>
          <h1>Codes QR étudiants</h1>
          <p>Préparez et imprimez les cartes individuelles de votre centre.</p>
        </div>
        <button className="button-primary" onClick={onExportCards}><Download size={17} /> Télécharger le PDF complet</button>
      </div>
      <div className="panel view-panel">
        <div className="qr-guide">
          <QrCode size={28} />
          <div><b>Cartes prêtes à imprimer</b><span>{students.length} QR codes personnalisés, avec le nom de chaque étudiant.</span></div>
          <Check size={19} />
        </div>
      </div>
    </section>
  )
}
