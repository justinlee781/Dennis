import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcuBrlHxoYAiGbzTutPvwMi8ufOhWEZto",
  authDomain: "itmarketplace-78fc5.firebaseapp.com",
  projectId: "itmarketplace-78fc5",
  storageBucket: "itmarketplace-78fc5.appspot.com",
  messagingSenderId: "365622363258",
  appId: "1:365622363258:web:8b8d037f96b50fedc2e7c3",
  measurementId: "G-09LFH3Q083",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const dbFS = getFirestore(); //db firestore
export const AUTH = getAuth(FIREBASE_APP);
export const fbConfig = firebaseConfig;
export const storage = getStorage(FIREBASE_APP);
