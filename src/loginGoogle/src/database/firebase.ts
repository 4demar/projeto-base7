import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  type Auth
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);

// Persistência local (sobrevive reload, fecha de aba e instalação PWA)
setPersistence(firebaseAuth, browserLocalPersistence).catch((err) => {
  // logado pelo AuthLogger no boot
  console.error('[firebase] setPersistence error', err);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
