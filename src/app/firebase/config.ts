// firebase/config.ts

// Import Firebase SDK functions
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";

// Firebase configuration (env variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signOutUser = async () => signOut(auth);

export const getUserDocRef = (uid: string) => doc(firestore, "users", uid);

export const createOrUpdateUserDocument = async (user: User, extra: Record<string, any> = {}) => {
  if (!user) return;
  const userRef = getUserDocRef(user.uid);
  const snap = await getDoc(userRef);

  const data = {
    uid: user.uid,
    email: user.email ?? null,
    name: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
    ...extra,
  };

  if (!snap.exists()) {
    await setDoc(userRef, data);
  } else {
    await updateDoc(userRef, { ...extra, email: data.email, name: data.name });
  }

  return userRef;
};


// Save an order for a specific user
export const createUserOrder = async (uid: string, orderData: any) => {
  const ordersRef = collection(firestore, "users", uid, "orders");
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

