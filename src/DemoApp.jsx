import { useLocalDemo } from './hooks/useLocalDemo'
import { useHashRoute } from './hooks/useHashRoute'
import { useWorkspaceUI } from './hooks/useWorkspaceUI'
import { useToast } from './hooks/useToast'
import { formatMoney } from './lib/format'
import CentreSetup from './components/auth/CentreSetup'
import StudentStatus from './components/public/StudentStatus'
import PublicRegistration from './components/public/PublicRegistration'
import AppShell from './components/layout/AppShell'
import { downloadReceipt } from './services/pdf'

const DEMO_CENTRE_ID = 'demo'

function clearDemoStorage() {
  ;[
    'cashflow-centre-setup', 'cashflow-centre-name', 'cashflow-students', 'cashflow-payments',
    'cashflow-courses', 'cashflow-course-descriptions', 'cashflow-logo', 'cashflow-brand-color', 'cashflow-receipt-seq',
  ].forEach((key) => localStorage.removeItem(key))
}

export default function DemoApp({ theme }) {
  const data = useLocalDemo()
  const { route, clear } = useHashRoute()
  const ui = useWorkspaceUI()
  const { toast, notify } = useToast()

  if (route.studentId) {
    const student = data.students.find((s) => s.id === route.studentId) || null
    return <StudentStatus student={student} loading={false} onBack={clear} />
  }

  if (route.registerCourse !== null) {
    return (
      <PublicRegistration
        courses={data.courses}
        initialCourse={route.registerCourse}
        loading={false}
        onSubmit={async ({ name, course, total }) => {
          const student = data.addStudent({ name, course, total })
          window.location.hash = `student=${student.id}&centre=${DEMO_CENTRE_ID}`
        }}
      />
    )
  }

  if (!data.centreSetup) {
    return (
      <CentreSetup
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          const name = form.get('centreName').toString().trim()
          const course = form.get('courseName').toString().trim()
          const fee = Number(form.get('courseFee'))
          if (!name || !course || !fee || fee <= 0) return
          data.completeSetup({ name, course, fee })
        }}
      />
    )
  }

  return (
    <AppShell
      centreId={DEMO_CENTRE_ID}
      centreName={data.centreName}
      logoUrl={data.logoUrl}
      brandColor={data.brandColor}
      students={data.students}
      payments={data.payments}
      courses={data.courses}
      syncState={data.syncState}
      userLabel="Gestionnaire"
      userRole="Mode local"
      role="owner"
      accountLabel="Compte gestionnaire (démo)"
      ui={ui}
      toast={toast}
      notify={notify}
      theme={theme}
      onAddStudent={async (form) => { data.addStudent(form); notify('Étudiant inscrit et QR code prêt à partager') }}
      onAddPayment={async (student, amount) => {
        const { receiptNumber } = data.addPayment(student, amount)
        notify(`Paiement de ${formatMoney(amount)} enregistré`)
        await downloadReceipt(student, amount, receiptNumber, { centreName: data.centreName, brandColor: data.brandColor, logoUrl: data.logoUrl })
      }}
      onCreateCourse={async (form) => data.createCourse(form)}
      onSaveBranding={async (payload) => data.saveBranding(payload)}
      onUpdateLogo={data.updateLogo}
      onRemoveLogo={async () => data.removeLogo()}
      onLogout={() => { clearDemoStorage(); window.location.reload() }}
    />
  )
}