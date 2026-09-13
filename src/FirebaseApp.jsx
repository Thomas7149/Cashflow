import { useAuth } from './hooks/useAuth'
import { useCentreData } from './hooks/useCentreData'
import { useMembership } from './hooks/useMembership'
import { usePublicCourses, usePublicStudent, registerPublicStudent } from './hooks/usePublicCentre'
import { useHashRoute } from './hooks/useHashRoute'
import { useWorkspaceUI } from './hooks/useWorkspaceUI'
import { useToast } from './hooks/useToast'
import { formatMoney } from './lib/format'
import LoadingScreen from './components/auth/LoadingScreen'
import AuthScreen from './components/auth/AuthScreen'
import CentreSetup from './components/auth/CentreSetup'
import AcceptInvite from './components/auth/AcceptInvite'
import StudentStatus from './components/public/StudentStatus'
import PublicRegistration from './components/public/PublicRegistration'
import AppShell from './components/layout/AppShell'
import { downloadReceipt } from './services/pdf'

function PublicStudentRoute({ centreId, studentId, onBack }) {
  const { student, loading } = usePublicStudent(centreId, studentId)
  return <StudentStatus student={student} loading={loading} onBack={onBack} />
}

function PublicRegistrationRoute({ centreId, initialCourse, onRegistered }) {
  const { courses, loading } = usePublicCourses(centreId)
  const { toast, notify } = useToast()
  const submit = async ({ name, course, total }) => {
    try {
      const student = await registerPublicStudent(centreId, { name, course, total })
      onRegistered(student)
    } catch {
      notify('Inscription impossible, réessayez.')
    }
  }
  return (
    <>
      <PublicRegistration courses={courses} initialCourse={initialCourse} loading={loading} onSubmit={submit} />
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

function ManagerWorkspace({ user, centreId, role, logout, theme }) {
  const data = useCentreData(centreId, user)
  const ui = useWorkspaceUI()
  const { toast, notify } = useToast()
  const userLabel = user.displayName || user.email?.split('@')[0] || 'Gestionnaire'
  const isOwner = role === 'owner'

  if (!data.centreSetup) {
    // A cashier's centre is set up by its owner; there is nothing for them to
    // configure, and the write would be rejected by Firestore rules anyway
    // since the centre document ID belongs to the owner, not to them.
    if (!isOwner) return <LoadingScreen />
    return (
      <CentreSetup
        error={data.dataError}
        onSubmit={async (event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          const name = form.get('centreName').toString().trim()
          const currency = form.get('currency').toString()
          const course = form.get('courseName').toString().trim()
          const fee = Number(form.get('courseFee'))
          if (!name || !course || !fee || fee <= 0) return
          await data.completeSetup({ name, currency, course, fee })
        }}
      />
    )
  }

  return (
    <AppShell
      centreId={centreId}
      centreName={data.centreName}
      logoUrl={data.logoUrl}
      brandColor={data.brandColor}
      students={data.students}
      payments={data.payments}
      courses={data.courses}
      syncState={data.syncState}
      userLabel={userLabel}
      userRole={isOwner ? 'Gestionnaire' : 'Caissier'}
      role={role}
      accountLabel={user.email || 'Compte gestionnaire'}
      ui={ui}
      toast={toast}
      notify={notify}
      theme={theme}
      onAddStudent={async (form) => { await data.addStudent(form); notify('Étudiant inscrit et QR code prêt à partager') }}
      onAddPayment={async (student, amount) => {
        const { receiptNumber } = await data.addPayment(student, amount)
        notify(`Paiement de ${formatMoney(amount)} enregistré`)
        await downloadReceipt(student, amount, receiptNumber, { centreName: data.centreName, brandColor: data.brandColor, logoUrl: data.logoUrl })
      }}
      onCreateCourse={isOwner ? data.createCourse : undefined}
      onSaveBranding={isOwner ? data.saveBranding : undefined}
      onUpdateLogo={isOwner ? data.updateLogo : undefined}
      onRemoveLogo={isOwner ? data.removeLogo : undefined}
      onLogout={logout}
    />
  )
}

function ManagerWorkspaceResolver({ user, logout, theme }) {
  const membership = useMembership(user)
  if (membership.loading) return <LoadingScreen />
  return <ManagerWorkspace user={user} centreId={membership.centreId} role={membership.role} logout={logout} theme={theme} />
}

export default function FirebaseApp({ theme }) {
  const { route, clear } = useHashRoute()
  const { user, authLoading, authError, login, signup, loginWithGoogle, logout } = useAuth()

  if (route.studentId) return <PublicStudentRoute centreId={route.centreId} studentId={route.studentId} onBack={clear} />
  if (route.registerCourse !== null) {
    return (
      <PublicRegistrationRoute
        centreId={route.centreId}
        initialCourse={route.registerCourse}
        onRegistered={(student) => { window.location.hash = `student=${student.id}&centre=${route.centreId}` }}
      />
    )
  }

  if (route.inviteId) {
    if (authLoading) return <LoadingScreen />
    if (!user) return <AuthScreen error={authError} onLogin={login} onSignup={signup} onGoogle={loginWithGoogle} />
    return <AcceptInvite centreId={route.centreId} inviteId={route.inviteId} user={user} onDone={clear} />
  }

  if (authLoading) return <LoadingScreen />
  if (!user) return <AuthScreen error={authError} onLogin={login} onSignup={signup} onGoogle={loginWithGoogle} />

  return <ManagerWorkspaceResolver user={user} logout={logout} theme={theme} />
}