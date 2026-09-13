import { Check } from 'lucide-react'
import Modal from './Modal'

const ITEMS = [
  ['Firebase', 'Vérifiez que le statut indique « Synchronisé ».'],
  ['Caméra', 'Autorisez la caméra et utilisez HTTPS pour scanner un QR.'],
  ['QR non reconnu', 'Utilisez une carte générée par ce centre.'],
  ['Paiement', 'Le montant doit être positif et inférieur au solde restant.'],
]

export default function TroubleshootingModal({ close, onBack }) {
  return (
    <Modal title="Résoudre un problème" subtitle="Vérifications rapides avant de contacter le support." close={close}>
      <div className="help-checklist">
        {ITEMS.map(([title, text]) => (
          <div key={title}><Check size={15} /><span><b>{title}</b><small>{text}</small></span></div>
        ))}
      </div>
      <button className="button-secondary full" onClick={onBack}>Retour au centre d’aide</button>
    </Modal>
  )
}
