import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Apni Firebase configuration yahan daalein
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcBb5Zdtps4dEkL43jrngMBAZ5xI6KhiQ",
  authDomain: "sstradersbill-108c1.firebaseapp.com",
  databaseURL: "https://sstradersbill-108c1-default-rtdb.firebaseio.com",
  projectId: "sstradersbill-108c1",
  storageBucket: "sstradersbill-108c1.firebasestorage.app",
  messagingSenderId: "1071080469005",
  appId: "1:1071080469005:web:991c0e9ccd898a6b395b44",
  measurementId: "G-DE6PVF37SF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
