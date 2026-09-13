import { ArrowUpRight, Check, Plus, Settings, Users } from 'lucide-react'
import Modal from './Modal'

export default function WorkspaceModal({ centreName, userLabel, isOwner = true, close, onCreateCentre, onMembers, onSettings, onLogout }) {
  return (
    <Modal title={centreName || 'Votre espace'} subtitle="Votre espace de travail actuel." close={close}>
      <div className="workspace-menu-modal">
        <div className="active-workspace">
          <span className="workspace-avatar">{(centreName || 'CE').slice(0, 2).toUpperCase()}</span>
          <span><b>{centreName || 'Votre centre'}</b><small>Centre de formation · Actif</small></span>
          <Check size={16} />
        </div>
        {isOwner && (
          <button onClick={onCreateCentre}>
            <Plus size={17} /><span><b>Créer un autre centre</b><small>Ajouter un nouvel espace de travail</small></span><ArrowUpRight size={14} />
          </button>
        )}
        {isOwner && (
          <button onClick={onMembers}>
            <Users size={17} /><span><b>Gérer les membres</b><small>Inviter des gestionnaires ou caissiers</small></span><ArrowUpRight size={14} />
          </button>
        )}
        <button onClick={onSettings}>
          <Settings size={17} /><span><b>Paramètres</b><small>{isOwner ? 'Nom, formations et tarifs' : 'Votre compte et l’affichage'}</small></span><ArrowUpRight size={14} />
        </button>
        <button onClick={onLogout}>
          <ArrowUpRight size={17} /><span><b>Se déconnecter</b><small>{userLabel || 'Compte actuel'}</small></span>
        </button>
      </div>
    </Modal>
  )
}