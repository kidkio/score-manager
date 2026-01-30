import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGbqfdYkh62RuJIVwcpR4iFhWCa6TlJGw",
  authDomain: "score-manager-64e09.firebaseapp.com",
  projectId: "score-manager-64e09",
  storageBucket: "score-manager-64e09.firebasestorage.app",
  messagingSenderId: "481157686145",
  appId: "1:481157686145:web:56bd9cc7d2ec746df2be80",
  measurementId: "G-0NZF4RVFY8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);