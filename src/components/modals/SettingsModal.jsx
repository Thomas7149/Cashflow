import { useRef, useState } from 'react'
import { Check, Monitor, Moon, Plus, Sun, Upload, X } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import { ACCENT_PRESETS, isValidHexColor } from '../../lib/color'
import Modal from './Modal'

const THEME_OPTIONS = [
  { value: 'light', label: 'Clair', Icon: Sun },
  { value: 'dark', label: 'Sombre', Icon: Moon },
  { value: 'auto', label: 'Auto', Icon: Monitor },
]

export default function SettingsModal({ centreName, brandColor, logoUrl, courses, close, onCreateCourse, onOpenCustomFields, onLogout, userLabel, theme, isOwner = true, onSave, onUpdateLogo, onRemoveLogo, notify }) {
  const [color, setColor] = useState(brandColor || '#315c48')
  const [logoBusy, setLogoBusy] = useState(false)
  const [logoError, setLogoError] = useState('')
  const fileInputRef = useRef(null)

  const submit = (event) => {
    event.preventDefault()
    const name = new FormData(event.currentTarget).get('centreName').toString().trim() || 'Le Campus'
    onSave({ name, brandColor: color })
  }

  const pickFile = () => fileInputRef.current?.click()

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setLogoError('')
    setLogoBusy(true)
    try {
      await onUpdateLogo(file)
      notify?.('Logo mis à jour')
    } catch (error) {
      setLogoError(error.message || 'Envoi du logo impossible.')
    } finally {
      setLogoBusy(false)
    }
  }

  const handleRemoveLogo = async () => {
    setLogoBusy(true)
    try {
      await onRemoveLogo()
    } finally {
      setLogoBusy(false)
    }
  }

  return (
    <Modal title="Paramètres" subtitle={isOwner ? 'Identité visuelle, formations et affichage.' : 'Votre compte et l’affichage.'} close={close}>
      {isOwner && (
        <>
          <p className="form-section-label">Logo du centre</p>
          <div className="logo-uploader">
            {logoUrl
              ? <img src={logoUrl} alt="Logo du centre" className="sidebar-logo-preview" />
              : <div className="sidebar-logo-preview" style={{ display: 'grid', placeItems: 'center', color: '#a0a79f', fontSize: 10 }}>Aucun</div>}
            <div className="logo-uploader-actions">
              <button type="button" className="button-secondary" onClick={pickFile} disabled={logoBusy}>
                <Upload size={14} /> {logoBusy ? 'Envoi...' : logoUrl ? 'Remplacer' : 'Importer un logo'}
              </button>
              {logoUrl && <button type="button" className="button-secondary" onClick={handleRemoveLogo} disabled={logoBusy}><X size={14} /> Retirer</button>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={handleFile} />
          </div>
          {logoError && <p className="auth-error">{logoError}</p>}
          <p style={{ fontSize: 10, color: '#9ba39c', margin: '2px 0 16px' }}>PNG, JPG, WEBP ou SVG · 2 Mo maximum. Utilisé sur l’app, le portail public et les PDF.</p>

          <p className="form-section-label">Couleur d’accent</p>
          <div className="color-swatches" style={{ marginBottom: 18 }}>
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.name}
                className={`color-swatch ${color === preset.value ? 'selected' : ''}`}
                style={{ background: preset.value }}
                onClick={() => setColor(preset.value)}
              />
            ))}
            <label className="color-swatch" style={{ background: isValidHexColor(color) ? color : '#ccc', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <input type="color" value={isValidHexColor(color) ? color : '#315c48'} onChange={(e) => setColor(e.target.value)} style={{ opacity: 0, width: 1, height: 1 }} />
            </label>
          </div>
        </>
      )}

      {theme && (
        <>
          <p className="form-section-label">Thème d’affichage (sur cet appareil)</p>
          <div className="theme-options" style={{ marginBottom: 18 }}>
            {THEME_OPTIONS.map(({ value, label, Icon }) => (
              <button key={value} type="button" className={`theme-option ${theme.mode === value ? 'selected' : ''}`} onClick={() => theme.setMode(value)}>
                <Icon size={14} style={{ marginBottom: 3 }} /><br />{label}
              </button>
            ))}
          </div>
        </>
      )}

      {isOwner ? (
        <>
          <p className="form-section-label">Inscriptions</p>
          <button className="button-secondary full" onClick={onCreateCourse}><Plus size={16} /> Créer une formation</button>
          <button className="button-secondary full" onClick={onOpenCustomFields} style={{ marginTop: 8, marginBottom: 18 }}>
            <Plus size={16} /> Personnaliser la fiche d’inscription
          </button>

          <form className="form" onSubmit={submit}>
            <label>Nom du centre<input name="centreName" defaultValue={centreName} /></label>
            <div className="course-catalog">
              <b>Formations configurées</b>
              {Object.entries(courses).map(([course, fee]) => <div key={course}><span>{course}</span><strong>{formatMoney(fee)}</strong></div>)}
            </div>
            <button className="button-primary full"><Check size={17} /> Enregistrer les paramètres</button>
          </form>
        </>
      ) : (
        <div className="course-catalog" style={{ marginBottom: 4 }}>
          <b>{centreName}</b>
          <div><span>Rôle</span><strong>Caissier</strong></div>
        </div>
      )}
      <button className="button-secondary full settings-logout" onClick={onLogout}>{userLabel || 'Compte'} · Se déconnecter</button>
    </Modal>
  )
}