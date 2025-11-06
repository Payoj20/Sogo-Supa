"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const ProductDetail = () => {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const { addToCart } = useCart();
  const router = useRouter();

  // Fetch the main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!product?.category) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `https://fakestoreapi.com/products/category/${product.category}`
        );
        const data = await res.json();
        const filtered = data.filter((p: Product) => p.id !== product.id);
        setRelated(filtered.slice(0, 6));
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-10 h-10 text-purple-600" />
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen text-center p-6">
        <p className="text-gray-600 text-lg">Product not found 😢</p>
      </div>
    );

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Product details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Product image */}
        <div className="relative w-full bg-white border rounded-2xl shadow-sm flex items-center justify-center p-4">
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className="object-contain max-h-[400px] w-auto transition-transform duration-300 hover:scale-105"
            priority
            unoptimized
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {product.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-500 capitalize">
            {product.category}
          </p>

          <p className="text-purple-700 text-3xl font-extrabold mt-2">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Add to cart */}
            <Button
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              onClick={() =>
                addToCart({
                  productId: String(product.id),
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  qty: 1,
                })
              }
            >
              Add to Cart
            </Button>

            {/* Buy now button */}
            <Button
              variant="outline"
              className="w-full sm:w-auto border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-semibold"
              onClick={() => router.push(`/checkout?productId=${product.id}`)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Related products section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          You Might Also Like
        </h2>

        {loadingRelated ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="animate-spin w-8 h-8 text-purple-600" />
          </div>
        ) : related.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link
                href={`/product/${item.id}`}
                key={item.id}
                className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-48 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-3 text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-purple-600">
                  {item.title}
                </h3>
                <p className="text-purple-700 font-semibold mt-1">
                  ${item.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No related products found.</p>
        )}
      </div>

      <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[400px] xl:h-[400px] flex justify-center items-center overflow-hidden mt-10 sm:mt-16">
      <a href="/products">
            <Image
              src="/banner6.png"
              alt="Ad Banner"
              fill
              className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="100vw"
            />
      </a>
            </div>

    </div>
  );
};

export default ProductDetail;
