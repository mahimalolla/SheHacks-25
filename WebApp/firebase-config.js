// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "return2tech-647cb.firebaseapp.com",
  projectId: "return2tech-647cb",
  storageBucket: "return2tech-647cb.firebasestorage.app",
  messagingSenderId: "370542194318",
  appId: "1:370542194318:web:5ce706a97f0e4c8901e3df"
};
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

  
export { db };
export default app;