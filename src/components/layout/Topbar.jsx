import { Bell, ChevronDown, Menu } from 'lucide-react'

const RANGE_CYCLE = { 'Ce mois': 'Cette semaine', 'Cette semaine': 'Cette année', 'Cette année': 'Ce mois' }

export default function Topbar({ centreName, nav, syncState, dateRange, onCycleDateRange, onOpenMenu, onOpenNotifications, today }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onOpenMenu}><Menu size={20} /></button>
      <div className="breadcrumb"><span>{centreName}</span><span>/</span><b>{nav}</b></div>
      <div className="top-actions">
        <div className="online"><i />{syncState}</div>
        <button className="icon-button" onClick={onOpenNotifications}><Bell size={18} /></button>
        <button className="date-chip" onClick={() => onCycleDateRange(RANGE_CYCLE[dateRange])}>
          {dateRange} · {today} <ChevronDown size={14} />
        </button>
      </div>
    </header>
  )
}
