// Pure formatting helpers shared across the app. No side effects, no DOM access.

export function formatMoney(value) {
  return `${new Intl.NumberFormat('fr-FR').format(value || 0)} FCFA`
}

export function paidPercent(student) {
  if (!student?.total) return 0
  return Math.round((student.paid / student.total) * 100)
}

export function initialsOf(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatDate(value) {
  const date = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
