import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZVJROvwUObeg2z40ZTl8FzdmXbMgQMpY",
  authDomain: "e-commerce-8dadf.firebaseapp.com",
  projectId: "e-commerce-8dadf",
  storageBucket: "e-commerce-8dadf.firebasestorage.app",
  messagingSenderId: "148718946565",
  appId: "1:148718946565:web:2014decdf770b7d17f8f6c",
  measurementId: "G-6CM3X12NHC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
