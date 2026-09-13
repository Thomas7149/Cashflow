import { useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QrScanner({ onFound }) {
  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 220, height: 220 } }, onFound, () => {}).catch(() => {})
    return () => { scanner.stop().then(() => scanner.clear()).catch(() => {}) }
  }, [onFound])

  return <div id="qr-reader" className="qr-reader" />
}
