import { ArrowUpRight, Plus, QrCode, Users, Wallet } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import Metric from './Metric'
import PanelTitle from './PanelTitle'
import PaymentRow from './PaymentRow'
import StudentsTable from './StudentsTable'

export default function Overview({
  greetingName,
  todayLabel,
  students,
  payments,
  collected,
  expected,
  search,
  onSearchChange,
  onAddStudent,
  onOpenPortal,
  onExportCards,
  onSelectStudent,
  onViewAllPayments,
}) {
  const openBalances = students.filter((s) => s.paid < s.total).length

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{todayLabel.toUpperCase()}</p>
          <h1>Bonjour {greetingName} <span className="wave">✦</span></h1>
          <p className="heading-subtitle">Voici ce qui se passe dans votre centre aujourd’hui.</p>
        </div>
        <button className="button-primary" onClick={onAddStudent}><Plus size={17} /> Inscrire un étudiant</button>
      </div>

      <section className="metric-grid">
        <Metric icon={Wallet} label="Encaissé ce mois" value={formatMoney(collected)} detail={payments.length ? 'Activité réelle' : 'Aucune donnée'} note="selon les paiements enregistrés" />
        <Metric icon={ArrowUpRight} label="À encaisser" value={formatMoney(expected - collected)} detail={`${openBalances} étudiants`} note="avec un solde ouvert" />
        <Metric icon={Users} label="Étudiants actifs" value={students.length} detail={students.length ? `${students.length} inscrits` : 'Aucun étudiant'} note="dans votre centre" />
        <div className="quick-card">
          <div className="quick-top"><span className="quick-icon"><QrCode size={18} /></span><span className="tag tag-lime">PRÊT</span></div>
          <b>Portail d’inscription</b>
          <p>Permettez aux étudiants de s’inscrire eux-mêmes</p>
          <button onClick={onOpenPortal}>Voir le QR <ArrowUpRight size={14} /></button>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <PanelTitle title="Derniers paiements" subtitle="Les transactions enregistrées récemment" action="Voir tout" onAction={onViewAllPayments} />
          <div className="payment-list">
            {payments.length
              ? payments.slice(0, 3).map((payment, index) => <PaymentRow key={payment.id || index} payment={payment} index={index} />)
              : <p className="empty-state">Aucun paiement enregistré.</p>}
          </div>
          <div className="panel-footer">
            <span>Total encaissé enregistré</span>
            <b>{formatMoney(collected)}</b>
          </div>
        </div>

        {payments.length > 0 && (
          <div className="panel chart-panel">
            <PanelTitle title="Flux de trésorerie" subtitle="Évolution des encaissements" />
            <div className="chart-legend"><span><i className="legend-dot in" />Entrées</span><span><i className="legend-dot out" />Sorties</span></div>
            <div className="chart">
              <div className="y-labels"><span>2M</span><span>1,5M</span><span>1M</span><span>500K</span><span>0</span></div>
              <div className="chart-area">
                <div className="grid-lines"><i /><i /><i /><i /><i /></div>
                <div className="x-labels"><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span><span>Août</span><span>Sept</span></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <StudentsTable students={students} search={search} onSearchChange={onSearchChange} onExport={onExportCards} onSelectStudent={onSelectStudent} />
    </>
  )
}
