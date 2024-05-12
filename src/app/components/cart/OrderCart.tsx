"use client";

import React, { useEffect } from "react";
import { useCartState } from "@/hooks/store/cart";
import { useRouter } from "next/navigation";
import OrderCartItem from "./OrderCartItem";
import LoadingPage from "../loaders/Loader";
import { useMediaQuery } from "react-responsive";
import { CartItem } from "./CartItem";

const fetchProductCountFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  if (cart) {
    const cartData: {
      totalCount: number;
    } = JSON.parse(cart);
    return cartData.totalCount;
  } else return 0;
};

export default function OrderCart() {
  const products = useCartState((state) => state.products);
  const router = useRouter();

  const isSmall = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (fetchProductCountFromLocalStorage() === 0 && products.length === 0)
      router.replace("/");
  }, [router, products]);

  if (products?.length === 0) {
    return <LoadingPage />;
  } else
    return (
      <div className="w-full h-fit">
        <div className="w-full hidden md:flex items-center border-b border-gray-deep">
          <div className="flex-[3] pb-6 font-semibold text-black-header">
            Product
          </div>
          <div className="flex-1 pb-6 font-semibold text-black-header text-end">
            Quantity
          </div>
          <div className="flex-1 pb-6 font-semibold text-black-header text-end">
            Price
          </div>
          <div className="flex-1 pb-6 font-semibold text-black-header text-end">
            Subtotal
          </div>
        </div>
        {products.map((product) =>
          isSmall ? (
            <CartItem key={product.id} product={product} />
          ) : (
            <OrderCartItem key={product.id} product={product} />
          )
        )}
      </div>
    );
}
