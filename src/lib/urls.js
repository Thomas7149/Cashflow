// Public links embedded in QR codes. Every link carries the centre ID explicitly,
// because an anonymous visitor scanning a QR code has no session and no other way
// to know which centre's data to read.

const base = () => `${window.location.origin}${window.location.pathname}`

export function studentUrl(centreId, studentId) {
  return `${base()}#student=${encodeURIComponent(studentId)}&centre=${encodeURIComponent(centreId)}`
}

export function courseUrl(centreId, course) {
  return `${base()}#register=${encodeURIComponent(course)}&centre=${encodeURIComponent(centreId)}`
}

export function inviteUrl(centreId, inviteId) {
  return `${base()}#invite=${encodeURIComponent(inviteId)}&centre=${encodeURIComponent(centreId)}`
}

export function parseHash(hash) {
  const params = new URLSearchParams(hash.replace('#', '?'))
  return {
    studentId: params.get('student'),
    registerCourse: params.has('register') ? params.get('register') || '' : null,
    inviteId: params.get('invite'),
    centreId: params.get('centre'),
  }
}