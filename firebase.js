// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXkvVXwll3j9sCcvv5LzSekH1DBF-IG1A",
  authDomain: "instagram-nextjs-a72b5.firebaseapp.com",
  projectId: "instagram-nextjs-a72b5",
  storageBucket: "instagram-nextjs-a72b5.appspot.com",
  messagingSenderId: "875832560653",
  appId: "1:875832560653:web:b363cc7a7a063b7403d944",
  measurementId: "G-E8YXXQ0JQ0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

// const analytics = getAnalytics(app);

export {app, db, storage};