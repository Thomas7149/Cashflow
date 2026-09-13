import { firebaseReady } from './firebase'
import { useTheme } from './hooks/useTheme'
import FirebaseApp from './FirebaseApp'
import DemoApp from './DemoApp'

export default function App() {
  const theme = useTheme()
  return firebaseReady ? <FirebaseApp theme={theme} /> : <DemoApp theme={theme} />
}