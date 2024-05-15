"use client";

import React, { useState } from "react";
import DefaultButton from "../customizable/DefaultButton";
import { useCartState } from "@/hooks/store/cart";
import ProductCountButton from "./ProductCountButton";
import toast, { Toaster } from "react-hot-toast";

const notify = () => toast("Added to cart");

export default function AddToCartButton({
  product,
  className,
  withCounter,
}: {
  product: Product;
  className?: string;
  withCounter?: boolean;
}) {
  const [count, setCount] = useState<number>(1);
  const addToCart = useCartState((state) => state.addToCart);

  const cartProduct: CartProduct = {
    id: product.id,
    name: product.attributes.name,
    price: product.attributes.price,
    picture: product.attributes.pictures.data[0].attributes.url,
    count: withCounter ? count : 1,
  };

  const button = (
    <>
      <DefaultButton
        text="Add to Cart"
        onClick={(e) => {
          e.preventDefault();
          addToCart(cartProduct);
          notify();
        }}
        className={`px-2 py-1.5 rounded border border-gray-deep flex gap-2.5 ${
          className ? className : ""
        }`}
      />
    </>
  );

  if (withCounter) {
    return (
      <div className="flex flex-col gap-4">
        <ProductCountButton
          count={count}
          setCount={setCount}
          className="py-3 px-4 gap-[20px] border-none rounded-lg bg-[#F5F5F5]"
        />
        {button}
      </div>
    );
  } else {
    return <>{button}</>;
  }
}
