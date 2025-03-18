import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



export const FIREBASE_APP = initializeApp(firebaseConfig);
export const dbFS = getFirestore(); //db firestore
export const AUTH = getAuth(FIREBASE_APP);
export const fbConfig = firebaseConfig;
export const storage = getStorage(FIREBASE_APP);
