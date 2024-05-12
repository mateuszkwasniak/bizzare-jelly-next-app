"use client";

import { useCartState } from "@/hooks/store/cart";
import React from "react";
import { IoAddOutline } from "react-icons/io5";
import { IoRemoveOutline } from "react-icons/io5";

const MAX_SINGLE_CART_ITEM_COUNT =
  Number(process.env.NEXT_PUBLIC_MAX_SINGLE_CART_ITEM_COUNT) || 50;

export default function ProductCountButton({
  productId,
  count,
  setCount,
  className,
}: {
  count: number;
  productId?: number;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}) {
  const increaseProductCount = useCartState(
    (state) => state.increaseProductCount
  );
  const decreaseProductCount = useCartState(
    (state) => state.decreaseProductCount
  );

  const increaseCartProductCount = (productId: number) =>
    increaseProductCount(productId);

  const decreaseCartProductCount = (productId: number) =>
    decreaseProductCount(productId);

  return (
    <button
      className={`w-fit px-2 py-1.5 rounded border border-gray-deep flex items-center gap-1 ${
        className ? className : ""
      }`}
    >
      <IoAddOutline
        onClick={() =>
          productId
            ? increaseCartProductCount(productId)
            : setCount &&
              setCount((prev) =>
                prev < MAX_SINGLE_CART_ITEM_COUNT
                  ? prev + 1
                  : MAX_SINGLE_CART_ITEM_COUNT
              )
        }
        className="text-black-header text-base"
      />
      <span className="font-semibold text-sm min-w-[2rem]">{count}</span>
      <IoRemoveOutline
        onClick={() =>
          productId
            ? decreaseCartProductCount(productId)
            : setCount && setCount((prev) => (prev > 0 ? prev - 1 : 0))
        }
        className="text-black-header text-base"
      />
    </button>
  );
}
