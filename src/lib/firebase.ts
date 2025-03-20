
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAreY2V-TBkm0VRaB78JA0TtxY4rTw94Bg",
  authDomain: "linkinbio-5b0d1.firebaseapp.com",
  projectId: "linkinbio-5b0d1",
  storageBucket: "linkinbio-5b0d1.firebasestorage.app",
  messagingSenderId: "887434787134",
  appId: "1:887434787134:web:787f8464c399028e9cd46f",
  measurementId: "G-YBX4GQ9QSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
