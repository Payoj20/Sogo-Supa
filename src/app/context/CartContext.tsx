"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem, UserDoc } from "../types/firebase";
import { useAuth } from "./AuthContext";
import { getUserDocRef } from "../firebase/config";
import { getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  total: number;
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<{ ok: boolean; message: string }>;
  increaseQty: (productId: string) => Promise<void>;
  decreaseQty: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { firebaseUser } = useAuth();
  const [guestCart, setGuestCart] = useState<CartItem[]>([]);
  const [firebaseCart, setFirebaseCart] = useState<CartItem[]>([]);

  // Load guest cart
  useEffect(() => {
    const raw = localStorage.getItem("guestCart");
    if (raw) {
      try {
        setGuestCart(JSON.parse(raw));
      } catch {
        setGuestCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
  }, [guestCart]);

  // Load firebase cart
  useEffect(() => {
    const loadFirebaseCart = async () => {
      if (!firebaseUser) return;
      const snap = await getDoc(getUserDocRef(firebaseUser.uid));
      const data = snap.exists() ? (snap.data() as UserDoc) : { cart: [] };
      setFirebaseCart(data.cart ?? []);
    };
    loadFirebaseCart();
  }, [firebaseUser]);

  const cartItems = firebaseUser ? firebaseCart : guestCart;
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Increase Product Quantity
  const increaseQty = useCallback(async (productId: string) => {
    if (!firebaseUser) {
      setGuestCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + 1 } : item
        )
      );
      return;
    }

    const ref = getUserDocRef(firebaseUser.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as UserDoc) : { cart: [] };

    const cartArr = data.cart ?? [];
    const updated = cartArr.map((item) =>
      item.productId === productId ? { ...item, qty: item.qty + 1 } : item
    );

    await updateDoc(ref, { cart: updated });
    setFirebaseCart(updated);
  }, [firebaseUser]);

  // Decrease Product Quantity
  const decreaseQty = useCallback(async (productId: string) => {
    if (!firebaseUser) {
      setGuestCart((prev) =>
        prev
          .map((item) =>
            item.productId === productId ? { ...item, qty: item.qty - 1 } : item
          )
          .filter((item) => item.qty > 0)
      );
      return;
    }

    const ref = getUserDocRef(firebaseUser.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as UserDoc) : { cart: [] };

    const cartArr = data.cart ?? [];
    const updated = cartArr
      .map((item) =>
        item.productId === productId ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);

    await updateDoc(ref, { cart: updated });
    setFirebaseCart(updated);
  }, [firebaseUser]);

  // Add to product to cart
  const addLocal = async (item: CartItem) => {
    setGuestCart((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, item];
    });
  };

  const addToCart = useCallback(async (itemData: Omit<CartItem, "qty"> & { qty?: number }) => {
    const item: CartItem = { ...itemData, qty: itemData.qty ?? 1 };

    if (!firebaseUser) {
      await addLocal(item);
      toast.success("Product added to cart.");
      return;
    }

    const ref = getUserDocRef(firebaseUser.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as UserDoc) : { cart: [] };

    const cartArr = data.cart ?? [];
    const idx = cartArr.findIndex((p) => p.productId === item.productId);
    if (idx > -1) cartArr[idx].qty += item.qty;
    else cartArr.push(item);

    await updateDoc(ref, { cart: cartArr });
    setFirebaseCart(cartArr);
    toast.success("Product added to cart.");
  }, [firebaseUser]);

  // Remove product from cart
  const removeFromCart = useCallback(async (productId: string) => {
    if (!firebaseUser) {
      setGuestCart((prev) => prev.filter((item) => item.productId !== productId));
      toast.error("Product removed.");
      return;
    }

    const ref = getUserDocRef(firebaseUser.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as UserDoc) : { cart: [] };

    const updated = (data.cart ?? []).filter((item) => item.productId !== productId);
    await updateDoc(ref, { cart: updated });
    setFirebaseCart(updated);
    toast.error("Product removed.");
  }, [firebaseUser]);

  // Clear the cart after checkout
  const clearCart = useCallback(async () => {
    if (!firebaseUser) {
      setGuestCart([]);
      return;
    }
    const ref = getUserDocRef(firebaseUser.uid);
    await updateDoc(ref, { cart: [] });
    setFirebaseCart([]);
  }, [firebaseUser]);

  //  Checkout
  const checkout = useCallback(async () => {
    if (!firebaseUser) {
      toast.warning("Please sign in to place an order.");
      return { ok: false, message: "Please sign in to place an order." };
    }

    const ref = getUserDocRef(firebaseUser.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as UserDoc) : { cart: [], orders: [] };

    const newOrder = {
      id: Date.now().toString(),
      items: data.cart ?? [],
      date: new Date().toLocaleDateString(),
      deliveryDate: new Date(Date.now() + 5 * 86400000).toLocaleDateString(),
      status: "Processing",
    };

    await updateDoc(ref, {
      orders: [...(data.orders ?? []), newOrder],
      cart: [],
    });

    setFirebaseCart([]);
    toast.success("Order placed successfully!");
    return { ok: true, message: "Order placed successfully!" };
  }, [firebaseUser]);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      total,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      increaseQty,
      decreaseQty,
    }),
    [cartItems, cartCount, total, addToCart, removeFromCart, clearCart, checkout, increaseQty, decreaseQty]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
