const MAX_DIMENSION = 220
const MAX_SOURCE_SIZE = 6 * 1024 * 1024 // generous ceiling before compression
const MAX_OUTPUT_CHARS = 700 * 1000 // stay well under Firestore's 1 MiB document limit
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

export function validateLogoFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Format non supporté. Utilisez PNG, JPG, WEBP ou SVG.'
  if (file.size > MAX_SOURCE_SIZE) return 'Le fichier est trop volumineux (6 Mo maximum avant compression).'
  return null
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image illisible.')) }
    img.src = url
  })
}

// Resizes and compresses the logo entirely in the browser so it can be stored
// as a small base64 string directly in the centre's Firestore document. This
// avoids Firebase Storage altogether -- Google now requires the paid Blaze
// plan just to enable Storage, even to stay within its free quota, which
// isn't worth it for a single small logo image.
export async function compressLogoToDataUrl(file) {
  const error = validateLogoFile(file)
  if (error) throw new Error(error)

  const img = await loadImage(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * scale))
  canvas.height = Math.max(1, Math.round(img.height * scale))
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let dataUrl = canvas.toDataURL('image/png')
  // PNG has no quality knob. If it's still too big (rare at 220px), fall back
  // to JPEG, which compresses much better for photographic logos -- at the
  // cost of transparency.
  if (dataUrl.length > MAX_OUTPUT_CHARS) {
    let quality = 0.9
    do {
      dataUrl = canvas.toDataURL('image/jpeg', quality)
      quality -= 0.1
    } while (dataUrl.length > MAX_OUTPUT_CHARS && quality > 0.3)
  }
  if (dataUrl.length > MAX_OUTPUT_CHARS) throw new Error('Impossible de compresser suffisamment ce logo. Essayez une image plus simple.')
  return dataUrl
}