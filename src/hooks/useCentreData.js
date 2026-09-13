import { useCallback, useEffect, useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { generateStudentId } from '../lib/ids'
import { compressLogoToDataUrl } from '../lib/image'

// Manages a signed-in manager's own centre: setup status, course catalogue,
// student roster and payment history, all synced live from Firestore.
//
// The previous version updated a student's balance and created the payment
// record as two separate writes. Two payments made in quick succession (e.g.
// a double-tap, or two staff members scanning the same card) could both read
// the same "remaining balance" and both succeed, pushing paid above total.
// addPayment now does both writes inside a single Firestore transaction, so
// the balance check and the update happen atomically against the server.
export function useCentreData(centreId, user) {
  const [centreSetup, setCentreSetup] = useState(false)
  const [centreName, setCentreName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [brandColor, setBrandColor] = useState('#315c48')
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [courses, setCourses] = useState({})
  const [courseDescriptions, setCourseDescriptions] = useState({})
  const [syncState, setSyncState] = useState('Synchronisation...')
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    setCentreSetup(false)
    setCentreName('')
    setLogoUrl('')
    setBrandColor('#315c48')
    setStudents([])
    setPayments([])
    setCourses({})
    setCourseDescriptions({})
    setDataError('')
  }, [centreId])

  useEffect(() => {
    if (!centreId) return undefined
    setSyncState('Synchronisation...')
    getDoc(doc(db, 'centres', centreId))
      .then((snapshot) => {
        setCentreSetup(snapshot.exists() && snapshot.data().setupComplete === true)
        if (snapshot.exists()) {
          setCentreName(snapshot.data().name || '')
          setLogoUrl(snapshot.data().logoUrl || '')
          setBrandColor(snapshot.data().brandColor || '#315c48')
        }
      })
      .catch(() => setDataError('Impossible de charger le centre.'))
    return undefined
  }, [centreId])

  useEffect(() => {
    if (!centreId) return undefined
    return onSnapshot(
      collection(db, 'centres', centreId, 'students'),
      (snapshot) => {
        setStudents(snapshot.docs.map((item) => item.data()))
        setSyncState('Synchronisé avec Firebase')
      },
      () => { setDataError('Impossible de synchroniser les étudiants.'); setSyncState('Erreur de synchronisation') }
    )
  }, [centreId])

  useEffect(() => {
    if (!centreId) return undefined
    return onSnapshot(
      collection(db, 'centres', centreId, 'payments'),
      (snapshot) =>
        setPayments(
          snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        ),
      () => setDataError('Impossible de charger l’historique des paiements.')
    )
  }, [centreId])

  useEffect(() => {
    if (!centreId) return undefined
    return onSnapshot(
      collection(db, 'centres', centreId, 'courses'),
      (snapshot) => {
        const nextCourses = {}
        const nextDescriptions = {}
        snapshot.docs.forEach((item) => {
          const course = item.data()
          nextCourses[course.name] = course.fee
          nextDescriptions[course.name] = course.description || ''
        })
        setCourses(nextCourses)
        setCourseDescriptions(nextDescriptions)
      },
      () => setDataError('Impossible de charger le catalogue des formations.')
    )
  }, [centreId])

  const completeSetup = useCallback(
    async ({ name, currency, course, fee }) => {
      await setDoc(doc(db, 'centres', centreId), { ownerId: centreId, name, currency, setupComplete: true }, { merge: true })
      await setDoc(
        doc(db, 'centres', centreId, 'members', centreId),
        { uid: centreId, email: user?.email || '', role: 'owner', active: true },
        { merge: true }
      )
      await setDoc(doc(db, 'centres', centreId, 'courses', course), { name: course, fee, description: '' }, { merge: true })
      setCentreName(name)
      setCentreSetup(true)
    },
    [centreId, user]
  )

  const addStudent = useCallback(
    async ({ name, course, total }) => {
      const student = {
        id: generateStudentId(),
        name,
        course,
        total,
        paid: 0,
        color: 'lemon',
        initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
        createdAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'centres', centreId, 'students', student.id), student)
      return student
    },
    [centreId]
  )

  const addPayment = useCallback(
    async (student, amount) => {
      const studentRef = doc(db, 'centres', centreId, 'students', student.id)
      const paymentRef = doc(collection(db, 'centres', centreId, 'payments'))
      const counterRef = doc(db, 'centres', centreId, 'meta', 'counters')

      const receiptNumber = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(studentRef)
        if (!snapshot.exists()) throw new Error('Étudiant introuvable.')
        const current = snapshot.data()
        const remaining = current.total - current.paid
        if (!(amount > 0) || amount > remaining) throw new Error('Montant invalide ou supérieur au solde restant.')

        const counterSnapshot = await transaction.get(counterRef)
        const nextSeq = (counterSnapshot.exists() ? counterSnapshot.data().receipts || 0 : 0) + 1
        const receiptLabel = `REC-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`

        transaction.set(studentRef, { ...current, paid: current.paid + amount }, { merge: true })
        transaction.set(counterRef, { receipts: nextSeq }, { merge: true })
        transaction.set(paymentRef, {
          studentId: student.id,
          studentName: current.name,
          amount,
          course: current.course,
          receiptNumber: receiptLabel,
          createdBy: user?.uid || 'unknown',
          createdAt: serverTimestamp(),
        })
        return receiptLabel
      })

      return { paymentId: paymentRef.id, receiptNumber }
    },
    [centreId, user]
  )

  const createCourse = useCallback(
    async ({ name, fee, description }) => {
      await setDoc(doc(db, 'centres', centreId, 'courses', name), { name, fee, description }, { merge: true })
    },
    [centreId]
  )

  const saveBranding = useCallback(
    async ({ name, brandColor: color }) => {
      await setDoc(doc(db, 'centres', centreId), { name, brandColor: color }, { merge: true })
      setCentreName(name)
      setBrandColor(color)
    },
    [centreId]
  )

  const updateLogo = useCallback(
    async (file) => {
      const dataUrl = await compressLogoToDataUrl(file)
      await setDoc(doc(db, 'centres', centreId), { logoUrl: dataUrl }, { merge: true })
      setLogoUrl(dataUrl)
    },
    [centreId]
  )

  const removeLogo = useCallback(async () => {
    await setDoc(doc(db, 'centres', centreId), { logoUrl: '' }, { merge: true })
    setLogoUrl('')
  }, [centreId])

  return {
    centreSetup,
    centreName,
    logoUrl,
    brandColor,
    students,
    payments,
    courses,
    courseDescriptions,
    syncState,
    dataError,
    completeSetup,
    addStudent,
    addPayment,
    createCourse,
    saveBranding,
    updateLogo,
    removeLogo,
  }
}