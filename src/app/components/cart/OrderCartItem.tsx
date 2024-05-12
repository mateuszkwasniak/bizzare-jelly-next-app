import React from "react";
import Image from "next/image";
import ProductCountButton from "./ProductCountButton";
import { IoCloseOutline } from "react-icons/io5";
import { useCartState } from "@/hooks/store/cart";

export default function OrderCartItem({ product }: { product: CartProduct }) {
  const removeFromCart = useCartState((state) => state.removeFromCart);

  return (
    <div className="w-full py-6 border-b border-gray-border flex">
      <div className="flex-[3] flex gap-4">
        <div className="md:w-20 md:h-24 relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.picture}`}
            alt="product"
            width={80}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h4 className="font-semibold text-black-nav">{product.name}</h4>
          <button
            className="w-fit text-gray-deep cursor-pointer flex items-center gap-1 font-semibold hover:opacity-70 transition duration-300"
            onClick={() => removeFromCart(product.id)}
          >
            <IoCloseOutline className="text-3xl" /> Remove
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <ProductCountButton
          productId={product.id}
          count={product.count}
          className="h-fit"
        />
      </div>
      <div className="flex-1 flex justify-end items-center">
        <p className="text-lg text-black-header">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <p className="text-lg text-black-header font-semibold">
          ${Number(product.price * product.count).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
