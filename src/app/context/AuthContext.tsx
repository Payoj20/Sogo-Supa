"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CartItem, UserDoc } from "../types/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth, createOrUpdateUserDocument, getUserDocRef, signInWithEmail, signInWithGooglePopup, signOutUser, signUpWithEmail } from "../firebase/config";
import { getDoc, updateDoc } from "firebase/firestore";

type AuthContextType = {
    user: UserDoc | null;
    firebaseUser: any | null;
    loading : boolean;
    signInWithEmailFn: (email: string, password: string) => Promise<any>;
    signUpWithEmailFn: (email: string, password: string, extra?: any) => Promise<any>;
    signInWithGoogleFn: () => Promise<any>;
    signOutFn: () => Promise<void>;
    addToCart: (item: CartItem) => Promise<void>;
    clearCart: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error ("useAuth must be used within AuthProvider");
        return ctx;
};

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
    const [user, setUser] = useState<UserDoc | null>(null);
    const [loading, setLoading] = useState(true);

    //listen to auth state
    useEffect(()=> {
        const unsub = onAuthStateChanged(auth, async (fbUser)=> {
            setFirebaseUser(fbUser);
            if(fbUser) {
                //ensure user document exists and pull it
                await createOrUpdateUserDocument(fbUser);
                const ref = getUserDocRef(fbUser.uid);
                const snap = await getDoc(ref);
                setUser((snap.exists() ? (snap.data() as UserDoc) : null) ?? null);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return() => unsub();
    }, []);

    const signInWithEmailFn = (email: string, password:string ) => signInWithEmail(email, password);

    const signUpWithEmailFn= async (email:string, password:string, extra = {}) => {
        const res = await signUpWithEmail(email, password);
        if(res.user) {
            await createOrUpdateUserDocument(res.user, extra);
        }
        return res;
    };

    const signInWithGoogleFn = async () => {
        const res = await signInWithGooglePopup();
        if(res.user) {
            //create user document if needed
            await createOrUpdateUserDocument(res.user);
        }
        return res;
    };

    const signOutFn = async () => {
        await signOutUser();
        setUser(null);
        setFirebaseUser(null);
    };

    //cart helper to store cart inside user document under 'cart' array.
    const addToCart = async (item: CartItem) => {
        if(!firebaseUser) throw new Error("Not authenticated");
        const ref = getUserDocRef(firebaseUser.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? (snap.data() as UserDoc) : {cart: []};
        const existing = data.cart ?? [];

        //merge the cart for the guest user to loggedd in user
        const idx = existing.findIndex((i)=> i.productId === item.productId);
        if(idx > -1) {
            existing[idx].qty += item.qty;
        } else {
            existing.push(item);
        }
        await updateDoc(ref, { cart: existing});
        setUser({...(data as UserDoc), cart: existing});
    };

    const clearCart = async () => {
        if(!firebaseUser) throw new Error("Not authenticated");
        const ref = getUserDocRef(firebaseUser.uid);
        await updateDoc(ref, {cart: []});
        setUser((u)=> (u ? {...u, cart: []}: u));
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

