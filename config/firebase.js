import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQmfGZrwxtGnXC0I5axVWiyF6o7KejfqM",
  authDomain: "surfapp-18393.firebaseapp.com",
  projectId: "surfapp-18393",
  storageBucket: "surfapp-18393.appspot.com",
  messagingSenderId: "995244259355",
  appId: "1:995244259355:web:73b2edfaab6697e4d0e0be",
  measurementId: "G-Z6ZP6GRWB5"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const dbFS = getFirestore(); //db firestore
export const AUTH = getAuth(FIREBASE_APP);
export const fbConfig = firebaseConfig;
export const storage = getStorage(FIREBASE_APP);
