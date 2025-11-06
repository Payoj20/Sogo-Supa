"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, doc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  userDetails?: {
    name?: string;
    address?: string;
    phone?: string;
  };
  date: string;
  deliveryDate: string;
  status: string;
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(doc(firestore, "users", user.uid), "orders");
        const snapshot = await getDocs(ordersRef);
        const data = snapshot.docs.map((docSnap) => {
          const orderData = docSnap.data() as Omit<Order, "id">;
          return { id: docSnap.id, ...orderData };
        });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading || loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <Loader className="animate-spin w-8 h-8 text-purple-600 mb-3" />
        Loading your orders...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-3">You're not logged in</h2>
        <img
          src="/notloggedin.png"
          alt="Not Logged In"
          className="w-150 h-100"
        />
        <p className="mb-6 text-gray-500">
          Please log in or create an account to view and manage your orders.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <Button >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );

  if (!orders.length)
    return (
      <div className="text-center py-20">
        <h2 className="text-4xl mt-5 font-semibold text-gray-600">No Orders Yet</h2>
        <Image
          src="/empty-order.png"
          alt="Empty Orders"
          width={500}
          height={250}
          className="mx-auto my-4"
        />
        <p className="mb-6 text-gray-500">
          You haven’t placed any orders yet. Start shopping your favorites!
        </p>
        <Link href="/products">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
            Browse Products
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="px-6 py-10 pt-18 md:px-16 lg:px-32 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-700">
        Your Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const items: OrderItem[] = Array.isArray(order.items)
            ? order.items
            : [];

          const total = items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
          );

          return (
            <div
              key={order.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg mb-2 text-purple-700">
                Order ID: {order.id}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                Ordered on: {new Date(order.date).toLocaleDateString()}
              </p>

              {/*  Ordered items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="object-contain rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-gray-600">
                        ${item.price} × {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & status */}
              <div className="border-t pt-3 flex justify-between text-gray-800">
                <p className="font-semibold">Total:</p>
                <p className="font-semibold text-purple-700">
                  ${total.toFixed(2)}
                </p>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Status:{" "}
                <span className="font-medium text-purple-600">
                  {order.status}
                </span>{" "}
                <br />
                Delivery by: {order.deliveryDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
