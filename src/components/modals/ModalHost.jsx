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
import { downloadCourseQrPdf, downloadPaymentsReportCsv, downloadStudentCard } from '../../services/pdf'
import { courseUrl, inviteUrl } from '../../lib/urls'
import { createInvite } from '../../services/invites'

export default function ModalHost({
  modal, setModal, closeModal, selected, setSelected, formError, setFormError,
  centreId, centreName, branding, theme, role, students, payments, courses, syncState, userLabel,
  collected, expected,
  onAddStudent, onAddPayment, onCreateCourse, onSaveBranding, onUpdateLogo, onRemoveLogo, onLogout, notify,
}) {
  if (!modal) return null

  const isOwner = role !== 'cashier'
  const openBalances = students.filter((s) => s.paid < s.total).length

  switch (modal) {
    case 'student':
      return (
        <StudentModal
          courses={courses}
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
          close={closeModal}
          onRecordPayment={() => setModal('payment')}
          onDownloadCard={async () => {
            if (!(await downloadStudentCard(selected, branding))) notify('QR introuvable, réessayez.')
            else notify('PDF téléchargé')
          }}
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
          onLogout={onLogout}
          onUpdateLogo={onUpdateLogo}
          onRemoveLogo={onRemoveLogo}
          notify={notify}
          onSave={async (data) => { await onSaveBranding(data); closeModal(); notify('Paramètres enregistrés') }}
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
          onLogout={onLogout}
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
          onDownload={() => { downloadPaymentsReportCsv(payments, students); notify('Rapport des paiements téléchargé') }}
        />
      )

    case 'portal':
      return (
        <PortalModal
          centreId={centreId}
          courses={courses}
          close={closeModal}
          onCopyLink={(course) => { navigator.clipboard?.writeText(courseUrl(centreId, course)); notify('Lien de formation copié') }}
          onDownload={async () => { if (!(await downloadCourseQrPdf(courses, branding))) notify('Créez une formation avant d’exporter ses QR') }}
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

    default:
      return null
  }
}