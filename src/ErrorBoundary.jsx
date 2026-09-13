import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Cashflow Campus error:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return <main className="error-screen"><div className="error-card"><div className="error-icon"><AlertTriangle size={22} /></div><p className="eyebrow">ERREUR D’APPLICATION</p><h1>Une erreur inattendue est survenue</h1><p>Vos données enregistrées restent protégées. Rechargez la page pour reprendre votre travail.</p><button className="button-primary" onClick={() => window.location.reload()}><RefreshCw size={16} /> Recharger l’application</button></div></main>
  }
}
