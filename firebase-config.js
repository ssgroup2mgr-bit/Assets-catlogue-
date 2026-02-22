import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYTRsQS7DAU1iCRxtVrcDb_vPE6pzrpy4",
  authDomain: "catlogue-fa34b.firebaseapp.com",
  projectId: "catlogue-fa34b",
  storageBucket: "catlogue-fa34b.firebasestorage.app",
  messagingSenderId: "1004660298794",
  appId: "1:1004660298794:web:66468bb6b341d1ecbb5f53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
