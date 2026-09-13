import { ArrowUpRight, ChevronDown, Download, MoreHorizontal, Search } from 'lucide-react'
import { formatDate, formatMoney, paidPercent } from '../../lib/format'
import PanelTitle from './PanelTitle'

export default function StudentsTable({ students, search, onSearchChange, onExport, onSelectStudent }) {
  const filtered = students.filter((s) => `${s.name} ${s.id} ${s.course}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="panel students-panel">
      <PanelTitle title="Suivi des étudiants" subtitle="Visualisez les soldes et partagez les cartes QR" />
      <div className="table-actions">
        <div className="search-box">
          <Search size={16} />
          <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Rechercher..." />
        </div>
        <button className="button-secondary export-button" onClick={onExport}><Download size={15} /> Exporter toutes les cartes</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ÉTUDIANT</th><th>CURSUS</th><th>PROGRESSION</th><th>RESTANT</th><th>INSCRIT LE</th><th /></tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="student-cell">
                    <span className={`avatar ${s.color}`}>{s.initials}</span>
                    <span><b>{s.name}</b><small>{s.id}</small></span>
                  </div>
                </td>
                <td>{s.course}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-track"><span style={{ width: `${paidPercent(s)}%` }} /></div>
                    <small>{paidPercent(s)}%</small>
                  </div>
                </td>
                <td><b className={s.paid === s.total ? 'paid' : ''}>{s.paid === s.total ? 'Soldé' : formatMoney(s.total - s.paid)}</b></td>
                <td>{formatDate(s.createdAt) || '—'}</td>
                <td><button className="row-menu" onClick={() => onSelectStudent(s)}><MoreHorizontal size={17} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>Affichage de {filtered.length} sur {students.length} étudiants</span>
        <button className="button-ghost" onClick={() => onSelectStudent(null)}>Gérer les étudiants <ArrowUpRight size={14} /></button>
      </div>
    </section>
  )
}
