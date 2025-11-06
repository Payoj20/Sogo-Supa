"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "lucide-react";

const CartPage = () => {
  const {
    cartItems,
    total,
    removeFromCart,
    cartCount,
    increaseQty,
    decreaseQty,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); 

    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
    router.push("/checkout?fromCart=true");
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <Loader className="animate-spin w-8 h-8 text-purple-600 mb-3" />
        Loading your cart...
      </div>
    );

  {/* Empty cart */}
  
  if (cartItems.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <h1 className="text-4xl mt-30 font-semibold text-gray-600">Your Cart is Empty</h1>
        <p className="text-gray-500">
          Browse our collections to find something you love!
        </p>
        <img src="/empty-cart.png" alt="Empty Cart" className="w-150 h-90" />
        <Link href="/products">
          <Button className="mt-3">Shop Now</Button>
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cart ({cartCount})</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 border rounded-lg p-3 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-contain"
            />

            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="flex items-center gap-3 mt-2 select-none">
                <button
                  onClick={() => decreaseQty(item.productId)}
                  className="w-8 h-8 flex items-center justify-center border rounded-md text-lg font-semibold hover:bg-gray-100 transition"
                >
                  -
                </button>

                <span className="text-lg font-medium w-6 text-center">{item.qty}</span>

                <button
                  onClick={() => increaseQty(item.productId)}
                  className="w-8 h-8 flex items-center justify-center border rounded-md text-lg font-semibold hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold">${item.price * item.qty}</div>
              <Button variant="ghost" onClick={() => removeFromCart(item.productId)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <div className="text-lg font-semibold">Total: ${total}</div>
        <Button onClick={handleCheckout}>Place Order</Button>
      </div>
    </div>
  );
};

export default CartPage;
