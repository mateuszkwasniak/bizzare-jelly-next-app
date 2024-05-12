"use client";

import React, { SetStateAction } from "react";
import Image from "next/image";
import ProductCountButton from "./ProductCountButton";
import { IoCloseOutline } from "react-icons/io5";
import { calculateFixedSum, useCartState } from "@/hooks/store/cart";
import Link from "next/link";

export const CartItem = ({
  product,
  setShowCart,
}: {
  product: CartProduct;
  setShowCart?: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const removeFromCart = useCartState((state) => state.removeFromCart);

  return (
    <div className="h-fit py-6 border-b border-gray-border text-black flex justify-between gap-4 bg-white">
      <Link
        href={`/products/${product.id}`}
        className="w-16 h-20 md:w-20 md:h-24 relative"
        onClick={() => (setShowCart ? setShowCart(false) : null)}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.picture}`}
          alt="product"
          width={80}
          height={96}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1 md:min-w-[12.5rem] flex flex-col gap-2">
        <h4 className="font-semibold text-black-nav text-sm">{product.name}</h4>
        <ProductCountButton productId={product.id} count={product.count} />
      </div>
      <div className="flex flex-col items-end justify-start gap-2">
        <p className="text-sm font-semibold text-black-header md:min-w-20 text-end">
          ${Number(calculateFixedSum(product.count * product.price)).toFixed(2)}
        </p>
        <IoCloseOutline
          className="text-2xl text-gray-deep cursor-pointer"
          onClick={() => removeFromCart(product.id)}
        />
      </div>
    </div>
  );
};
