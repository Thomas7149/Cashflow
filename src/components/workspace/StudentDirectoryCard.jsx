import { formatMoney } from '../../lib/format'

export default function StudentDirectoryCard({ student, balanceClassName }) {
  return (
    <div className="directory-card">
      <span className={`avatar ${student.color}`}>{student.initials}</span>
      <div><b>{student.name}</b><small>{student.id} · {student.course}</small></div>
      <strong className={balanceClassName}>
        {student.paid === student.total ? 'Soldé' : formatMoney(student.total - student.paid)}
      </strong>
    </div>
  )
}
