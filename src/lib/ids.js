// Student and payment IDs used to be derived from Date.now(), which is predictable
// and, since student records are readable by anyone who knows the ID (QR access),
// made it possible to enumerate other students' names and balances by guessing
// nearby timestamps. These IDs are random instead.

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous 0/O/1/I characters

function randomToken(length) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint32Array(length))
    return Array.from(bytes, (n) => ALPHABET[n % ALPHABET.length]).join('')
  }
  // Extremely old browsers without the Web Crypto API: not cryptographically
  // strong, but still unpredictable enough to avoid trivial enumeration.
  let out = ''
  for (let i = 0; i < length; i += 1) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  return out
}

export const generateStudentId = () => `ST-${randomToken(10)}`
export const generateLocalPaymentId = () => `local-${randomToken(10)}`
