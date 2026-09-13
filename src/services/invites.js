import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function createInvite(centreId, email) {
  const inviteRef = doc(collection(db, 'centres', centreId, 'invites'))
  await setDoc(inviteRef, { email, role: 'cashier', used: false, createdAt: serverTimestamp() })
  return inviteRef.id
}

async function fetchInvite(centreId, inviteId) {
  const snapshot = await getDoc(doc(db, 'centres', centreId, 'invites', inviteId))
  return snapshot.exists() ? snapshot.data() : null
}

// Two sequential writes, not a transaction: the invite is marked used first,
// then the membership documents are created referencing it. Firestore rules
// check that exact order (see firestore.rules), so a partial failure after
// the first write just leaves a used invite with no membership yet -- rare,
// and recoverable by the owner sending a new invite.
export async function claimInvite(centreId, inviteId, user) {
  const invite = await fetchInvite(centreId, inviteId)
  if (!invite) throw new Error('Invitation introuvable ou expirée.')
  if (invite.used) throw new Error('Cette invitation a déjà été utilisée.')

  await updateDoc(doc(db, 'centres', centreId, 'invites', inviteId), { used: true, claimedBy: user.uid })
  await setDoc(doc(db, 'centres', centreId, 'members', user.uid), {
    uid: user.uid,
    email: user.email || invite.email,
    role: invite.role,
    active: true,
    inviteId,
  })
  await setDoc(doc(db, 'memberships', user.uid), { centreId, role: invite.role })
}