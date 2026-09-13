import { ArrowUpRight, CircleHelp, LayoutDashboard, MoreHorizontal, QrCode, ScanLine, Settings, FileText, Users, Wallet, ChevronDown } from 'lucide-react'

const NAV_ITEMS = [
  [LayoutDashboard, 'Vue d’ensemble'],
  [Users, 'Étudiants'],
  [Wallet, 'Trésorerie'],
  [QrCode, 'Codes QR'],
  [ScanLine, 'Scanner'],
]
const TOOL_ITEMS = [
  [FileText, 'Rapports'],
  [Settings, 'Paramètres'],
]

export default function Sidebar({ open, centreName, logoUrl, studentsCount, nav, onNavigate, onOpenWorkspace, onOpenHelp, onOpenProfile, userLabel, userRole, isOwner = true }) {
  const toolItems = isOwner ? TOOL_ITEMS : TOOL_ITEMS.filter(([, label]) => label !== 'Paramètres')
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Wallet size={18} /></span>cashflow<span className="brand-dot">.</span></div>

      <button className="workspace-switch" onClick={onOpenWorkspace}>
        {logoUrl
          ? <img src={logoUrl} alt="" className="workspace-avatar workspace-logo" />
          : <span className="workspace-avatar">{(centreName || 'CE').slice(0, 2).toUpperCase()}</span>}
        <span><b>{centreName || 'Votre centre'}</b><small>{isOwner ? 'Gestionnaire' : 'Caissier'}</small></span>
        <ChevronDown size={15} />
      </button>

      <nav>
        <p className="nav-label">ESPACE DE TRAVAIL</p>
        {NAV_ITEMS.map(([Icon, label]) => (
          <button key={label} className={`nav-item ${nav === label ? 'active' : ''}`} onClick={() => onNavigate(label)}>
            <Icon size={17} />{label}
            {label === 'Étudiants' && <span className="nav-count">{studentsCount}</span>}
          </button>
        ))}
        <p className="nav-label second">OUTILS</p>
        {toolItems.map(([Icon, label]) => (
          <button key={label} className="nav-item" onClick={() => onNavigate(label)}>
            <Icon size={17} />{label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="help-card" onClick={onOpenHelp}>
          <CircleHelp size={20} />
          <div><b>Besoin d’aide ?</b><span>Consulter le guide rapide</span></div>
          <ArrowUpRight size={15} />
        </button>
        <button className="profile" onClick={onOpenProfile}>
          <span className="profile-avatar">{(userLabel || 'GE').slice(0, 2).toUpperCase()}</span>
          <span><b>{userLabel || 'Gestionnaire'}</b><small>{userRole || 'Administrateur'}</small></span>
          <MoreHorizontal size={18} />
        </button>
      </div>
    </aside>
  )
}