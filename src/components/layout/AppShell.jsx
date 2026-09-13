import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Overview from '../dashboard/Overview'
import WorkspaceView from '../workspace/WorkspaceView'
import ModalHost from '../modals/ModalHost'
import QrExportBank from '../QrExportBank'
import Toast from '../Toast'
import { hexToRgba } from '../../lib/color'
import { downloadAllStudentCards } from '../../services/pdf'

export default function AppShell({
  centreId, centreName, logoUrl, brandColor, students, payments, courses, syncState,
  userLabel, userRole, role, accountLabel, ui, toast, notify, theme,
  onAddStudent, onAddPayment, onCreateCourse, onSaveBranding, onUpdateLogo, onRemoveLogo, onLogout,
}) {
  const isOwner = role !== 'cashier'
  const collected = students.reduce((sum, s) => sum + s.paid, 0)
  const expected = students.reduce((sum, s) => sum + s.total, 0)
  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  const branding = { centreName, brandColor, logoUrl }

  // The centre's chosen accent color is applied as CSS custom properties on
  // the whole shell — see the small set of rules in index.css that read
  // var(--accent)/var(--accent-soft)/var(--green) instead of a fixed hex.
  const accentStyle = { '--green': brandColor, '--accent': brandColor, '--accent-soft': hexToRgba(brandColor, 0.16) }

  return (
    <div className="app-shell" style={accentStyle}>
      <Sidebar
        open={ui.openMenu}
        centreName={centreName}
        logoUrl={logoUrl}
        studentsCount={students.length}
        nav={ui.nav}
        onNavigate={ui.openNav}
        onOpenWorkspace={() => ui.setModal('workspace')}
        onOpenHelp={() => ui.setModal('help')}
        onOpenProfile={() => ui.setModal('settings')}
        userLabel={userLabel}
        userRole={userRole}
        isOwner={isOwner}
      />

      <main className="main-content">
        <Topbar
          centreName={centreName}
          nav={ui.nav}
          syncState={syncState}
          dateRange={ui.dateRange}
          onCycleDateRange={ui.setDateRange}
          onOpenMenu={() => ui.setOpenMenu(true)}
          onOpenNotifications={() => ui.setModal('notifications')}
          today={todayLabel}
        />

        <div className={`page-content ${ui.nav === 'Vue d’ensemble' ? '' : 'section-view'}`}>
          <WorkspaceView
            nav={ui.nav}
            students={students}
            collected={collected}
            expected={expected}
            onAddStudent={() => ui.setModal('student')}
            onExportCards={async () => { if (!(await downloadAllStudentCards(students))) notify('Aucun étudiant à exporter') }}
          />

          {ui.nav === 'Vue d’ensemble' && (
            <Overview
              greetingName={userLabel}
              todayLabel={todayLabel}
              students={students}
              payments={payments}
              collected={collected}
              expected={expected}
              search={ui.search}
              onSearchChange={ui.setSearch}
              onAddStudent={() => ui.setModal('student')}
              onOpenPortal={() => ui.setModal('portal')}
              onExportCards={async () => { if (!(await downloadAllStudentCards(students))) notify('Aucun étudiant à exporter') }}
              onSelectStudent={(student) => { if (student) { ui.setSelected(student); ui.setModal('actions') } else ui.openNav('Étudiants') }}
              onViewAllPayments={() => ui.openNav('Trésorerie')}
            />
          )}
        </div>
      </main>

      <ModalHost
        modal={ui.modal}
        setModal={ui.setModal}
        closeModal={ui.closeModal}
        selected={ui.selected}
        setSelected={ui.setSelected}
        formError={ui.formError}
        setFormError={ui.setFormError}
        centreId={centreId}
        centreName={centreName}
        branding={branding}
        theme={theme}
        role={role}
        students={students}
        payments={payments}
        courses={courses}
        syncState={syncState}
        userLabel={accountLabel}
        collected={collected}
        expected={expected}
        onAddStudent={onAddStudent}
        onAddPayment={onAddPayment}
        onCreateCourse={onCreateCourse}
        onSaveBranding={onSaveBranding}
        onUpdateLogo={onUpdateLogo}
        onRemoveLogo={onRemoveLogo}
        onLogout={onLogout}
        notify={notify}
      />

      <QrExportBank centreId={centreId} students={students} courses={courses} />
      <Toast message={toast} />
    </div>
  )
}