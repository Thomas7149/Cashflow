import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ value, onChange, placeholder, minLength, required, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        autoComplete={autoComplete}
      />
      <button type="button" className="password-toggle" onClick={() => setVisible((v) => !v)} tabIndex={-1} aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}