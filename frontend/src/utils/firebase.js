import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: 'crop-38fc3.firebaseapp.com',
  projectId: 'crop-38fc3',
  storageBucket: 'crop-38fc3.firebasestorage.app',
  messagingSenderId: '416242623276',
  appId: '1:416242623276:web:fa8f397e807e7d7c798289',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { app, auth, provider }