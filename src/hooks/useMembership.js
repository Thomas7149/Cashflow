import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

// An owner's centre ID is always their own uid (set at first setup, no lookup
// needed). An invited member's uid has no direct relationship to the centre
// they joined, so their centre ID lives in a separate top-level pointer
// written when they claimed their invite (see services/invites.js). Absence
// of that pointer means "first time here" -- treated as an owner about to
// set up their own centre.
export function useMembership(user) {
  const [state, setState] = useState({ loading: true, centreId: null, role: null })

  useEffect(() => {
    if (!user) { setState({ loading: false, centreId: null, role: null }); return undefined }
    let active = true
    getDoc(doc(db, 'memberships', user.uid))
      .then((snapshot) => {
        if (!active) return
        if (snapshot.exists()) setState({ loading: false, centreId: snapshot.data().centreId, role: snapshot.data().role })
        else setState({ loading: false, centreId: user.uid, role: 'owner' })
      })
      .catch(() => { if (active) setState({ loading: false, centreId: user.uid, role: 'owner' }) })
    return () => { active = false }
  }, [user])

  return state
}