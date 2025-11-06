"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "lucide-react";

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <Loader className="animate-spin w-8 h-8 text-purple-600 mb-3" />
        Loading products...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800 mt-2">
          All Products
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="border rounded-2xl bg-white shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col p-4"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  unoptimized
                />
              </div>

              <div className="mt-4 flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-lg font-semibold text-purple-700 mt-2">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
