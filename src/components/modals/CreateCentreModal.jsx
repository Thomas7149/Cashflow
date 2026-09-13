import { Plus } from 'lucide-react'
import Modal from './Modal'

export default function CreateCentreModal({ close }) {
  return (
    <Modal title="Créer un autre centre" subtitle="Un gestionnaire peut gérer plusieurs espaces." close={close}>
      <div className="coming-soon">
        <Plus size={22} />
        <b>Multi-centres en préparation</b>
        <span>Votre espace actuel reste actif. Cette fonctionnalité sera disponible avec la gestion multi-établissements.</span>
      </div>
    </Modal>
  )
}
