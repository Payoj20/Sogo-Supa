"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Banner from "./banner";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data.slice(0, 6));
        setRandomProducts(data.sort(() => 0.5 - Math.random()).slice(0, 6));
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured products */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Featured Products
          </h2>
          <Link href="/products">
            <Button variant="outline" className="text-sm sm:text-base">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="w-full h-56 sm:h-60 flex justify-center items-center">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="object-contain w-auto h-full"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base sm:text-sm font-medium truncate text-gray-900">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-bold text-purple-700 mt-2">
                    ${product.price}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Banner/>
        
        {/* Random products */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-16 mb-6">
          You Might Also Like
        </h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {randomProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="w-full h-56 sm:h-60 flex justify-center items-center">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="object-contain w-auto h-full"
                      unoptimized
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base sm:text-sm font-medium truncate text-gray-900">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-bold text-purple-700 mt-2">
                    ${product.price}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
