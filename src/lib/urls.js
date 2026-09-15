// Public links embedded in QR codes. Every link carries the centre ID explicitly,
// because an anonymous visitor scanning a QR code has no session and no other way
// to know which centre's data to read.

const base = () => `${window.location.origin}${window.location.pathname}`

export function studentUrl(centreId, studentId) {
  return `${base()}#student=${encodeURIComponent(studentId)}&centre=${encodeURIComponent(centreId)}`
}

// A single public registration link per centre. It used to encode a specific
// course, but the registration form always let the visitor pick any course
// from the list anyway, so per-course QR codes promised a specificity they
// never enforced. One link, one QR, and the student chooses their formation.
export function registerUrl(centreId) {
  return `${base()}#register=1&centre=${encodeURIComponent(centreId)}`
}

export function inviteUrl(centreId, inviteId) {
  return `${base()}#invite=${encodeURIComponent(inviteId)}&centre=${encodeURIComponent(centreId)}`
}

export function parseHash(hash) {
  const params = new URLSearchParams(hash.replace('#', '?'))
  return {
    studentId: params.get('student'),
    isRegistering: params.has('register'),
    inviteId: params.get('invite'),
    centreId: params.get('centre'),
  }
}