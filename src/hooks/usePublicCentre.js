import { useEffect, useState } from 'react'
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { generateStudentId } from '../lib/ids'

// Reads for anonymous visitors who arrive through a QR link: the course
// catalogue of one specific centre (to self-register) and the status of one
// specific student (their own card). Firestore rules make courses readable by
// anyone and make a student document readable by its exact ID only — visitors
// can never browse a centre's full roster.
export function usePublicCourses(centreId) {
  const [courses, setCourses] = useState({})
  const [loading, setLoading] = useState(Boolean(centreId))

  useEffect(() => {
    if (!centreId || !db) { setLoading(false); return undefined }
    return onSnapshot(
      collection(db, 'centres', centreId, 'courses'),
      (snapshot) => {
        const next = {}
        snapshot.docs.forEach((item) => { next[item.data().name] = item.data().fee })
        setCourses(next)
        setLoading(false)
      },
      () => setLoading(false)
    )
  }, [centreId])

  return { courses, loading }
}

export function usePublicStudent(centreId, studentId) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(Boolean(centreId && studentId))

  useEffect(() => {
    if (!centreId || !studentId || !db) { setLoading(false); return }
    let active = true
    getDoc(doc(db, 'centres', centreId, 'students', studentId))
      .then((snapshot) => { if (active) setStudent(snapshot.exists() ? snapshot.data() : null) })
      .catch(() => { if (active) setStudent(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [centreId, studentId])

  return { student, loading }
}

export async function registerPublicStudent(centreId, { name, course, total }) {
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
}
