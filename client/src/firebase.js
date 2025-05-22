// client/src/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// 1) Your Firebase config (from your .env via Vite)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 2) Initialize the app (only once)
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// 3) Initialize and export the Realtime Database instance
export const db = getDatabase(app);
