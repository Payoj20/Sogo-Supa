"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../firebase/config";
import { useCart } from "../context/CartContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import Image from "next/image";

type CheckoutItem = {
  id?: number;
  productId?: number;
  title: string;
  price: number;
  image: string;
  qty?: number;
};

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
};

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const fromCart = searchParams.get("fromCart");
  const router = useRouter();
  const { user, loading } = useAuth();
  const { clearCart } = useCart();

  const [product, setProduct] = useState<CheckoutItem | null>(null);
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.warning("Please log in to place an order.");
        router.push("/login");
      } else {
        setPageLoading(false);
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        if (fromCart) {
          const storedCart = localStorage.getItem("checkoutCart");
          if (storedCart) setCartItems(JSON.parse(storedCart));
        } else if (productId) {
          const res = await fetch(
            `https://fakestoreapi.com/products/${productId}`
          );
          const data = await res.json();
          setProduct(data);
        }
        setPageLoading(false);
      };
      loadData();
    }
  }, [productId, fromCart, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all required fields before proceeding.");
      return;
    }

    if (!user) {
      toast.warning("Please log in to place your order.");
      router.push("/login");
      return;
    }

    try {
      const userOrdersRef = collection(
        doc(firestore, "users", user.uid),
        "orders"
      );
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);

      const items: CheckoutItem[] = fromCart
        ? cartItems
        : product
        ? [
            {
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              qty: 1,
            },
          ]
        : [];

      await addDoc(userOrdersRef, {
        items,
        userDetails: form,
        date: new Date().toISOString(),
        deliveryDate: deliveryDate.toDateString(),
        status: "Processing",
      });

      if (fromCart) {
        clearCart();
        localStorage.removeItem("checkoutCart");
      }

      toast.success("Your order has been placed successfully!");
      router.push("/orders");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong while placing your order.");
    }
  };

  if (pageLoading || loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <Loader className="animate-spin w-8 h-8 text-purple-600 mb-3" />
        Loading checkout...
      </div>
    );

  const itemsToDisplay = fromCart ? cartItems : product ? [product] : [];

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 py-12 px-6 md:px-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Card className="w-full max-w-2xl shadow-lg border-t-4 border-purple-600">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Checkout
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {itemsToDisplay.length > 0 && (
            <div className="space-y-4">
              {itemsToDisplay.map((item) => (
                <div
                  key={item.productId || item.id}
                  className="flex items-center gap-4 p-3 border rounded-lg bg-white dark:bg-gray-900"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-contain"
                  />
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-green-600 font-medium">
                      ${item.price} × {item.qty ?? 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="mt-3"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-3"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 00000 00000"
                required
                className="mt-3"
              />
            </div>
            <div>
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Street, City, State, ZIP"
                required
                className="mt-3"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-md transition-all"
          >
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage;
