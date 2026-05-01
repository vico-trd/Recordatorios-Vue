import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdD7qvUIfbeaHIJYeUhchigvDEP_ovWXI",
  authDomain: "recordatorios-app-d0bb0.firebaseapp.com",
  projectId: "recordatorios-app-d0bb0",
  storageBucket: "recordatorios-app-d0bb0.firebasestorage.app",
  messagingSenderId: "768059298260",
  appId: "1:768059298260:web:3c6f72ec0d5548218cc641",
  measurementId: "G-TDFMHT78YH"
}

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
