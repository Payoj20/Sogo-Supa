"use client";
import React, { ReactNode, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({children} : {children: ReactNode}) => {

    const {firebaseUser, loading} = useAuth();
    const router = useRouter();

    useEffect(()=> {
        if(!loading && !firebaseUser) {
            router.push("/login");
        }
    },[loading, firebaseUser, router]);

    if(loading || firebaseUser) {
        return <div className='min-h-screen flex items-center justify-center animate-spin'><Loader /></div>
    }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute