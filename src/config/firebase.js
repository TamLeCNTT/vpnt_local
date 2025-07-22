import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC71dOd2tVPYGWitFsoLzUblB-h5FCUAc",
  authDomain: "vnpt-c3591.firebaseapp.com",
  databaseURL: "https://vnpt-c3591-default-rtdb.firebaseio.com",
  projectId: "vnpt-c3591",
  storageBucket: "vnpt-c3591.firebasestorage.app",
  messagingSenderId: "384936659926",
  appId: "1:384936659926:web:ff7b9f63e32a5bf15cf277",
  measurementId: "G-R9NQGCX9GT"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
export const db = getDatabase(app);
