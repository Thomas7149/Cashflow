export default function PanelTitle({ title, subtitle, action, onAction }) {
  return (
    <div className="panel-header">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      {action && <button className="button-ghost" onClick={onAction}>{action}</button>}
    </div>
  )
}
