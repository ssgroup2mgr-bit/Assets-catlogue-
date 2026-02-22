import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Apni Firebase configuration yahan daalein
const firebaseConfig = {
  apiKey: "AIzaSyDeO8uhUVWP98NrhSyZ-oTImjKB0GDDe6M",
  authDomain: "nano-c5292.firebaseapp.com",
  databaseURL: "https://nano-c5292-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nano-c5292",
  storageBucket: "nano-c5292.firebasestorage.app",
  messagingSenderId: "772738888247",
  appId: "1:772738888247:web:4d6733b30e0ac9e27d05b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
