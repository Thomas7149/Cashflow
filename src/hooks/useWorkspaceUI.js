import { useState } from 'react'

export function useWorkspaceUI() {
  const [nav, setNav] = useState('Vue d’ensemble')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [dateRange, setDateRange] = useState('Ce mois')
  const [formError, setFormError] = useState('')

  const openNav = (label) => {
    setNav(label)
    setOpenMenu(false)
    if (label === 'Rapports') setModal('reports')
    if (label === 'Paramètres') setModal('settings')
    if (label === 'Scanner') setModal('scan')
  }

  const closeModal = () => { setModal(null); setFormError('') }

  return {
    nav, setNav, openNav,
    modal, setModal, closeModal,
    selected, setSelected,
    search, setSearch,
    openMenu, setOpenMenu,
    dateRange, setDateRange,
    formError, setFormError,
  }
}
