import { useCallback, useEffect, useState } from 'react'
import { generateLocalPaymentId, generateStudentId } from '../lib/ids'
import { compressLogoToDataUrl } from '../lib/image'

// Used only when no Firebase config is present (VITE_FIREBASE_* missing).
// Everything lives in this browser's localStorage, as a single simulated
// centre -- there is no multi-user sync, which is fine since it's a local demo.
// The logo has no Storage bucket to live in here, so it is kept as a base64
// data URL directly in localStorage instead.
const KEYS = {
  setup: 'cashflow-centre-setup',
  name: 'cashflow-centre-name',
  students: 'cashflow-students',
  payments: 'cashflow-payments',
  courses: 'cashflow-courses',
  descriptions: 'cashflow-course-descriptions',
  logo: 'cashflow-logo',
  brandColor: 'cashflow-brand-color',
  receiptSeq: 'cashflow-receipt-seq',
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useLocalDemo() {
  const [centreSetup, setCentreSetup] = useState(() => localStorage.getItem(KEYS.setup) === 'true')
  const [centreName, setCentreName] = useState(() => localStorage.getItem(KEYS.name) || '')
  const [students, setStudents] = useState(() => readJSON(KEYS.students, []))
  const [payments, setPayments] = useState(() => readJSON(KEYS.payments, []))
  const [courses, setCourses] = useState(() => readJSON(KEYS.courses, {}))
  const [courseDescriptions, setCourseDescriptions] = useState(() => readJSON(KEYS.descriptions, {}))
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem(KEYS.logo) || '')
  const [brandColor, setBrandColor] = useState(() => localStorage.getItem(KEYS.brandColor) || '#315c48')

  useEffect(() => { localStorage.setItem(KEYS.students, JSON.stringify(students)) }, [students])
  useEffect(() => { localStorage.setItem(KEYS.payments, JSON.stringify(payments)) }, [payments])
  useEffect(() => { localStorage.setItem(KEYS.courses, JSON.stringify(courses)) }, [courses])
  useEffect(() => { localStorage.setItem(KEYS.descriptions, JSON.stringify(courseDescriptions)) }, [courseDescriptions])

  const completeSetup = useCallback(({ name, course, fee }) => {
    setCentreName(name)
    setCourses({ [course]: fee })
    setCentreSetup(true)
    localStorage.setItem(KEYS.name, name)
    localStorage.setItem(KEYS.setup, 'true')
  }, [])

  const addStudent = useCallback(({ name, course, total }) => {
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
    setStudents((current) => [student, ...current])
    return student
  }, [])

  const addPayment = useCallback((student, amount) => {
    const remaining = student.total - student.paid
    if (!(amount > 0) || amount > remaining) throw new Error('Montant invalide ou supérieur au solde restant.')
    const paymentId = generateLocalPaymentId()
    const nextSeq = Number(localStorage.getItem(KEYS.receiptSeq) || '0') + 1
    localStorage.setItem(KEYS.receiptSeq, String(nextSeq))
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(nextSeq).padStart(4, '0')}`
    setStudents((current) => current.map((s) => (s.id === student.id ? { ...s, paid: s.paid + amount } : s)))
    setPayments((current) => [
      { id: paymentId, studentId: student.id, studentName: student.name, amount, course: student.course, receiptNumber, createdAt: new Date().toISOString() },
      ...current,
    ])
    return { paymentId, receiptNumber }
  }, [])

  const createCourse = useCallback(({ name, fee, description }) => {
    setCourses((current) => ({ ...current, [name]: fee }))
    setCourseDescriptions((current) => ({ ...current, [name]: description }))
  }, [])

  const saveBranding = useCallback(({ name, brandColor: color }) => {
    setCentreName(name)
    setBrandColor(color)
    localStorage.setItem(KEYS.name, name)
    localStorage.setItem(KEYS.brandColor, color)
  }, [])

  const updateLogo = useCallback(async (file) => {
    const dataUrl = await compressLogoToDataUrl(file)
    localStorage.setItem(KEYS.logo, dataUrl)
    setLogoUrl(dataUrl)
  }, [])

  const removeLogo = useCallback(() => {
    localStorage.removeItem(KEYS.logo)
    setLogoUrl('')
  }, [])

  return {
    centreSetup,
    centreName,
    logoUrl,
    brandColor,
    students,
    payments,
    courses,
    courseDescriptions,
    syncState: 'Mode local',
    dataError: '',
    completeSetup,
    addStudent,
    addPayment,
    createCourse,
    saveBranding,
    updateLogo,
    removeLogo,
  }
}