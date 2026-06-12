import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKGEmTNwO6BUuM7Z192sPLgIKdBppgNAI",
  authDomain: "course-7098e.firebaseapp.com",
  projectId: "course-7098e",
  storageBucket: "course-7098e.firebasestorage.app",
  messagingSenderId: "503715464122",
  appId: "1:503715464122:web:b3a579846584652a821383",
  measurementId: "G-HEYZ8MHENK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
