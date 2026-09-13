// Small helpers to derive usable CSS values from a single hex color the
// manager picks, without needing a color-manipulation library.

export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const int = parseInt(full, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

export function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const isValidHexColor = (value) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)

export const ACCENT_PRESETS = [
  { name: 'Forêt (par défaut)', value: '#315c48' },
  { name: 'Bleu nuit', value: '#2a4365' },
  { name: 'Bordeaux', value: '#7a2e3b' },
  { name: 'Ocre', value: '#8a5a20' },
  { name: 'Violet', value: '#4c3a7a' },
]