"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CartItem, UserDoc } from "../types/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import {
  auth,
  createOrUpdateUserDocument,
  getUserDocRef,
  signInWithEmail,
  signInWithGooglePopup,
  signOutUser,
  signUpWithEmail,
} from "../firebase/config";
import { getDoc, updateDoc } from "firebase/firestore";

type AuthContextType = {
  user: UserDoc | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithEmailFn: (email: string, password: string) => Promise<FirebaseUser>;
  signUpWithEmailFn: (email: string, password: string, extra?: Record<string, unknown>) => Promise<FirebaseUser>;
  signInWithGoogleFn: () => Promise<FirebaseUser>;
  signOutFn: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await createOrUpdateUserDocument(fbUser);
        const ref = getUserDocRef(fbUser.uid);
        const snap = await getDoc(ref);
        setUser(snap.exists() ? (snap.data() as UserDoc) : null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithEmailFn = async (email: string, password: string) => {
    const res = await signInWithEmail(email, password);
    return res.user;
  };

  const signUpWithEmailFn = async (email: string, password: string, extra: Record<string, unknown> = {}) => {
    const res = await signUpWithEmail(email, password);
    if (res.user) await createOrUpdateUserDocument(res.user, extra);
    return res.user;
  };

  const signInWithGoogleFn = async () => {
    const res = await signInWithGooglePopup();
    if (res.user) await createOrUpdateUserDocument(res.user);
    return res.user;
  };

  const signOutFn = async () => {
    await signOutUser();
    setUser(null);
    setFirebaseUser(null);
  };

  const addToCart = async (item: CartItem) => {
  if (!firebaseUser) throw new Error("Not authenticated");

  const ref = getUserDocRef(firebaseUser.uid);
  const snap = await getDoc(ref);

  const data: UserDoc = snap.exists()
    ? (snap.data() as UserDoc)
    : {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? null,
        name: firebaseUser.displayName ?? null,
        photoURL: firebaseUser.photoURL ?? null,
        cart: [],
        createdAt: new Date(),
      };

  const existing = data.cart ?? [];

  const idx = existing.findIndex((i) => i.productId === item.productId);

  if (idx > -1) {
    existing[idx].qty += item.qty;
  } else {
    existing.push(item);
  }

  await updateDoc(ref, { cart: existing });

  setUser({ ...data, cart: existing });
};

  const clearCart = async () => {
    if (!firebaseUser) throw new Error("Not authenticated");
    const ref = getUserDocRef(firebaseUser.uid);
    await updateDoc(ref, { cart: [] });
    setUser((prev) => (prev ? { ...prev, cart: [] } : prev));
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithEmailFn,
    signUpWithEmailFn,
    signInWithGoogleFn,
    signOutFn,
    addToCart,
    clearCart,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
