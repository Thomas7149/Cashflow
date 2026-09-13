import { QrCode, X } from 'lucide-react'

export default function Modal({ title, subtitle, close, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal">
        <button className="modal-close" onClick={close}><X size={18} /></button>
        <div className="modal-heading">
          <div className="modal-symbol"><QrCode size={20} /></div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
