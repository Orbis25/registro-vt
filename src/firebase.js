import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCHcKejwbMysIryIldgOlo6LVJ8bAWV0p4",
  authDomain: "faviel-registro-virtual.firebaseapp.com",
  projectId: "faviel-registro-virtual",
  storageBucket: "faviel-registro-virtual.firebasestorage.app",
  messagingSenderId: "1063479508041",
  appId: "1:1063479508041:web:ea11f4b5108742698b1398",
  measurementId: "G-YWX0WDGQJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export
export const db = getFirestore(app);

// Safe Analytics Initialization
export let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
