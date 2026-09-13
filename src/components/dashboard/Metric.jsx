export default function Metric({ icon: Icon, label, value, detail, note }) {
  return (
    <div className="metric-card">
      <div className="metric-icon"><Icon size={18} /></div>
      <p>{label}</p>
      <b>{value}</b>
      <div className="metric-detail">
        <span className="neutral">{detail}</span>
        <span>{note}</span>
      </div>
    </div>
  )
}
