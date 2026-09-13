import { AlertTriangle, ArrowUpRight, CircleHelp, FileText, Plus, QrCode, ScanLine } from 'lucide-react'
import Modal from './Modal'

export default function HelpModal({ close, onAddStudent, onPortal, onScan, onReports, onTroubleshooting }) {
  const actions = [
    [Plus, 'Démarrer avec un étudiant', 'Créer un dossier manuellement et générer son QR.', onAddStudent],
    [QrCode, 'Créer le portail d’inscription', 'Partager un QR pour que les étudiants s’inscrivent seuls.', onPortal],
    [ScanLine, 'Enregistrer un paiement', 'Scanner une carte et valider un versement.', onScan],
    [FileText, 'Exporter un rapport', 'Télécharger les paiements et soldes en CSV.', onReports],
    [AlertTriangle, 'Résoudre un problème', 'Synchronisation, caméra, QR ou connexion.', onTroubleshooting],
  ]

  return (
    <Modal title="Centre d’aide" subtitle="Les bons raccourcis pour gérer votre centre." close={close}>
      <div className="help-intro">
        <CircleHelp size={20} />
        <span><b>Comment pouvons-nous vous aider ?</b><small>Choisissez une action ou consultez un guide.</small></span>
      </div>
      <div className="help-list">
        {actions.map(([Icon, title, subtitle, onClick]) => (
          <button key={title} onClick={onClick}>
            <Icon size={17} /><span><b>{title}</b><small>{subtitle}</small></span><ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      <p className="help-contact">Support : contact@cashflow-campus.app</p>
    </Modal>
  )
}
