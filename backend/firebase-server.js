import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "return2techhckathon.firebaseapp.com",
    projectId: "return2techhckathon",
    storageBucket: "return2techhckathon.firebasestorage.app",
    messagingSenderId: "610152830157",
    appId: "1:610152830157:web:90a120f1e5c36cc7950584",
    measurementId: "G-H63TTCPRF2"
  };

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore instance
const db = getFirestore(app);
export { db };
