"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaOpencart } from "react-icons/fa";
import Image from "next/image";
import { LogOut, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const Topbar = () => {
  const { user, firebaseUser, signOutFn, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  
  if (loading) return null;


  const displayName =
    firebaseUser?.displayName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  return (
    <nav className="fixed w-full z-40 transition-all duration-300 border-b py-3 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 relative font-montserrat">

        {/* Logo */}
        <Link
          className="text-2xl font-bold ml-6 flex items-center hover:text-[#7F22FE]"
          href="/"
        >
          SogoSupa
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-10 font-lato">

          {/* Not Logged in user */}
          {!user ? (
            <>
              <Link href="/login" className="transition-transform duration-200 hover:scale-110 hover:text-[#7F22FE]">Login</Link>
              <Link href="/signup" className="transition-transform duration-200 hover:scale-110 hover:text-[#7F22FE]">SignUp</Link>

              <Link href="/cart" className="relative mr-6 transition-transform duration-200 hover:scale-110 hover:text-[#7F22FE]">
                <FaOpencart size={25} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
                )}
              </Link>

              <Link href="/orders" className="relative mr-6 transition-transform duration-200 hover:scale-110 hover:text-[#7F22FE]">
                Orders
              </Link>
            </>
          ) : (
            <>
              {/* Logged in user */}
              <Link href="/cart" className="relative mr-6 transition-transform duration-200 hover:scale-110 hover:text-[#7F22FE]">
                <FaOpencart size={25} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
                )}
              </Link>

              <Link href="/orders" className="relative mr-6 transition-transform duration-200 hover:scale-110 hover:text-[#7F22FE]">Orders</Link>

              {/* User dropdown */}
              <div className="relative font-lato">
                <button onClick={toggleDropdown} className="flex items-center gap-2 hover:scale-110 hover:text-[#7F22FE] transition">
                  
                  {firebaseUser?.photoURL ? (
                    <Image src={firebaseUser.photoURL} alt="User Avatar" width={36} height={36} className="rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 font-medium">
                      {displayName[0]?.toUpperCase()}
                    </div>
                  )}

                  <span className="text-sm font-semibold">{displayName}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                    <div className=" text-center py-2 text-xs text-gray-500 border-b">{user?.email}</div>
                    
                    <button
                      onClick={() => { signOutFn(); toast.success("Logged out successfully!"); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 hover:text-red-500"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-md hover:bg-gray-100">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">

          {!user ? (
            <>
              <Link href="/login" onClick={toggleMobileMenu} className="block py-2 hover:text-[#7F22FE]">Login</Link>
              <Link href="/signup" onClick={toggleMobileMenu} className="block py-2 hover:text-[#7F22FE]">SignUp</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 py-2 border-t pt-4">
                <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full font-medium">{displayName[0]?.toUpperCase()}</div>
                <div>
                  <span className="text-sm font-medium">{displayName}</span>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>

                <button
                  onClick={() => { signOutFn(); toast.success("Logged out successfully!"); }}
                  className="ml-auto text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          )}

          <Link href="/cart" onClick={toggleMobileMenu} className="flex items-center gap-2 hover:text-[#7F22FE]">
            <FaOpencart className="h-4 w-4" /> Cart ({cartCount})
          </Link>

          <Link href="/orders" onClick={toggleMobileMenu} className="block hover:text-[#7F22FE]">Orders</Link>
        </div>
      )}
    </nav>
  );
};

export default Topbar;
