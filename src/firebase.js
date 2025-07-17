// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUX_y-182uS9_3Z8605cWRpykcBttmBJk",
  authDomain: "to-do-list-40dcb.firebaseapp.com",
  projectId: "to-do-list-40dcb",
  storageBucket: "to-do-list-40dcb.appspot.com", // ← fix small typo here
  messagingSenderId: "495120561856",
  appId: "1:495120561856:web:f2cb0b163b9d1479745f25",
  measurementId: "G-N7XQ9QX0L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
