import StudentModal from './StudentModal'
import PaymentModal from './PaymentModal'
import ScanModal from './ScanModal'
import ActionsModal from './ActionsModal'
import SettingsModal from './SettingsModal'
import WorkspaceModal from './WorkspaceModal'
import MembersModal from './MembersModal'
import CreateCentreModal from './CreateCentreModal'
import CourseCreateModal from './CourseCreateModal'
import ReportsModal from './ReportsModal'
import PortalModal from './PortalModal'
import HelpModal from './HelpModal'
import TroubleshootingModal from './TroubleshootingModal'
import NotificationsModal from './NotificationsModal'
import CustomFieldsModal from './CustomFieldsModal'
import EditProfileModal from './EditProfileModal'
import ConfirmModal from './ConfirmModal'
import { downloadPaymentsReportCsv, downloadRegistrationQrPdf, downloadStudentCard } from '../../services/pdf'
import { inviteUrl, registerUrl } from '../../lib/urls'
import { createInvite } from '../../services/invites'

export default function ModalHost({
  modal, setModal, closeModal, selected, setSelected, formError, setFormError,
  centreId, centreName, branding, theme, role, students, payments, courses, customFields, syncState, userLabel, profileName,
  collected, expected,
  onAddStudent, onRenameStudent, onDeleteStudent, onAddPayment, onCreateCourse, onSaveBranding, onSaveCustomFields, onUpdateLogo, onRemoveLogo, onLogout, onUpdateProfileName, notify,
}) {
  if (!modal) return null

  const isOwner = role !== 'cashier'
  const openBalances = students.filter((s) => s.paid < s.total).length

  switch (modal) {
    case 'student':
      return (
        <StudentModal
          courses={courses}
          customFields={customFields}
          close={closeModal}
          onCreateCourse={isOwner ? () => setModal('course-create') : undefined}
          onSubmit={async (data) => { await onAddStudent(data); closeModal() }}
        />
      )

    case 'payment':
      return (
        <PaymentModal
          student={selected}
          error={formError}
          close={closeModal}
          onSubmit={async (amount) => {
            setFormError('')
            try {
              await onAddPayment(selected, amount)
              closeModal()
            } catch (error) {
              setFormError(error.message || 'Une erreur est survenue.')
            }
          }}
        />
      )

    case 'scan':
      return (
        <ScanModal
          students={students}
          close={closeModal}
          onFound={(id) => {
            const found = students.find((s) => s.id === id)
            if (found) { setSelected(found); setModal('payment') } else notify('QR non reconnu dans ce centre')
          }}
          onPick={(student) => { setSelected(student); setModal('payment') }}
        />
      )

    case 'actions':
      return (
        <ActionsModal
          student={selected}
          centreId={centreId}
          customFields={customFields}
          close={closeModal}
          onRecordPayment={() => setModal('payment')}
          onRename={async (name) => {
            await onRenameStudent(selected, name)
            setSelected({ ...selected, name })
            notify('Nom mis à jour')
          }}
          onDelete={() => setModal('confirm-delete-student')}
          onDownloadCard={async () => {
            if (!(await downloadStudentCard(selected, branding))) notify('QR introuvable, réessayez.')
            else notify('PDF téléchargé')
          }}
        />
      )

    case 'confirm-delete-student':
      return (
        <ConfirmModal
          title="Supprimer cet étudiant ?"
          message={`${selected.name} et son historique de paiement lié seront définitivement retirés de la liste. Cette action est irréversible.`}
          confirmLabel="Supprimer"
          danger
          close={() => setModal('actions')}
          onConfirm={async () => {
            await onDeleteStudent(selected)
            notify('Étudiant supprimé')
            closeModal()
          }}
        />
      )

    case 'edit-profile':
      return (
        <EditProfileModal
          currentName={profileName}
          email={userLabel}
          close={closeModal}
          onSave={async (name) => { await onUpdateProfileName(name); notify('Profil mis à jour') }}
        />
      )

    case 'settings':
      return (
        <SettingsModal
          centreName={centreName}
          brandColor={branding.brandColor}
          logoUrl={branding.logoUrl}
          courses={courses}
          userLabel={userLabel}
          theme={theme}
          isOwner={isOwner}
          close={closeModal}
          onCreateCourse={() => setModal('course-create')}
          onOpenCustomFields={() => setModal('custom-fields')}
          onLogout={() => setModal('confirm-logout')}
          onUpdateLogo={onUpdateLogo}
          onRemoveLogo={onRemoveLogo}
          notify={notify}
          onSave={async (data) => { await onSaveBranding(data); closeModal(); notify('Paramètres enregistrés') }}
        />
      )

    case 'custom-fields':
      return (
        <CustomFieldsModal
          fields={customFields}
          close={() => setModal('settings')}
          notify={notify}
          onSave={onSaveCustomFields}
        />
      )

    case 'workspace':
      return (
        <WorkspaceModal
          centreName={centreName}
          userLabel={userLabel}
          isOwner={isOwner}
          close={closeModal}
          onCreateCentre={() => setModal('create-centre')}
          onMembers={() => setModal('members')}
          onSettings={() => setModal('settings')}
          onLogout={() => setModal('confirm-logout')}
        />
      )

    case 'members':
      return (
        <MembersModal
          userLabel={userLabel}
          close={() => setModal('workspace')}
          notify={notify}
          onInvite={async (email) => {
            const inviteId = await createInvite(centreId, email)
            return inviteUrl(centreId, inviteId)
          }}
        />
      )

    case 'create-centre':
      return <CreateCentreModal close={() => setModal('workspace')} />

    case 'course-create':
      return (
        <CourseCreateModal
          close={() => setModal('settings')}
          onSubmit={async (data) => { await onCreateCourse(data); setModal('settings'); notify('Formation créée et synchronisée') }}
        />
      )

    case 'reports':
      return (
        <ReportsModal
          studentsCount={students.length}
          collected={collected}
          remaining={expected - collected}
          close={closeModal}
          onDownload={() => { downloadPaymentsReportCsv(payments, students, customFields); notify('Rapport des paiements téléchargé') }}
        />
      )

    case 'portal':
      return (
        <PortalModal
          centreId={centreId}
          courses={courses}
          close={closeModal}
          onCopyLink={() => { navigator.clipboard?.writeText(registerUrl(centreId)); notify('Lien d’inscription copié') }}
          onDownload={async () => { if (!(await downloadRegistrationQrPdf(branding))) notify('QR introuvable, réessayez.') }}
        />
      )

    case 'help':
      return (
        <HelpModal
          close={closeModal}
          onAddStudent={() => setModal('student')}
          onPortal={() => setModal('portal')}
          onScan={() => setModal('scan')}
          onReports={() => setModal('reports')}
          onTroubleshooting={() => setModal('troubleshooting')}
        />
      )

    case 'troubleshooting':
      return <TroubleshootingModal close={closeModal} onBack={() => setModal('help')} />

    case 'notifications':
      return <NotificationsModal close={closeModal} syncState={syncState} openBalancesCount={openBalances} studentsCount={students.length} />

    case 'confirm-logout':
      return (
        <ConfirmModal
          title="Se déconnecter ?"
          message="Vous devrez vous reconnecter pour accéder à votre tableau de bord."
          confirmLabel="Se déconnecter"
          danger
          close={closeModal}
          onConfirm={onLogout}
        />
      )

    default:
      return null
  }
}