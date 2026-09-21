import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Support reading config from localStorage (for easy browser setup) OR import.meta.env
const getCustomConfig = () => {
  try {
    const saved = localStorage.getItem('ipc_firebase_config');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

const customConfig = getCustomConfig();

// Firebase configuration from environment variables or custom UI configuration
export const firebaseConfig = {
  apiKey: customConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: customConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: customConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: customConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: customConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: customConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: customConfig.measurementId || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Check if credentials have been configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  !firebaseConfig.apiKey.includes('your_')
);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialized successfully for project:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('⚠️ Firebase initialization error:', error);
  }
} else {
  console.info('ℹ️ Firebase is in Offline / LocalStorage mode. Add your Firebase keys in .env or Settings to sync with Cloud Firestore.');
}

export { app, db, auth };
export default db;
