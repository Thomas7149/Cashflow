import { Check, QrCode, Wallet } from 'lucide-react'
import Modal from './Modal'

export default function NotificationsModal({ close, syncState, openBalancesCount, studentsCount }) {
  return (
    <Modal title="Notifications" subtitle="Les événements importants de votre centre." close={close}>
      <div className="notification-list">
        <div><Check size={16} /><span><b>Synchronisation active</b><small>{syncState}</small></span></div>
        <div><Wallet size={16} /><span><b>{openBalancesCount} soldes à suivre</b><small>Consultez la trésorerie pour relancer les paiements.</small></span></div>
        <div><QrCode size={16} /><span><b>Cartes QR disponibles</b><small>{studentsCount} cartes peuvent être exportées en PDF.</small></span></div>
      </div>
    </Modal>
  )
}
