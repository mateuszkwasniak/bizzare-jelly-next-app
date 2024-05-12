"use client";

import React from "react";
import { calculateFixedSum, useCartState } from "@/hooks/store/cart";
import { CartItem } from "@/app/components/cart/CartItem";
import { useOrderState } from "@/hooks/store/order";
import { motion } from "framer-motion";

export default function OrderSummary({
  deliveryMethods,
}: {
  deliveryMethods: DeliveryMethod[];
}) {
  const totalSum = useCartState((state) => state.totalSum);
  const deliveryMethod = useCartState((state) => state.deliveryMethod);
  const products = useCartState((state) => state.products);
  const processing = useOrderState((state) => state.processingOrder);

  const deliveryPrice = deliveryMethods.find(
    (method) => method.name === deliveryMethod
  )?.price;

  return (
    <motion.div className="h-fit relative flex flex-col p-6 rounded-md border border-gray-deep shadow-custom">
      {processing ? (
        <div className="absolute left-0 top-0 bottom-0 right-0 opacity-50 bg-white z-10" />
      ) : null}
      <h3 className="font-medium text-base md:text-xl text-black-nav mb-2 md:mb-4">
        Order Summary
      </h3>
      <div className="w-full flex flex-col gap-3 mb-4">
        {products.map((product) => (
          <CartItem product={product} key={product.id} />
        ))}
      </div>
      <div className="w-full flex items-center justify-between py-3 border-b border-gray-[#EAEAEA]">
        <p className="text-black-header text-sm md:text-base">Shipping</p>
        <p className="font-semibold text-black-nav text-sm md:text-base">
          {deliveryMethod
            ? deliveryMethod[0].toUpperCase() + deliveryMethod.slice(1)
            : null}
        </p>
      </div>
      <div className="w-full flex items-center justify-between py-3 border-b border-gray-[#EAEAEA]">
        <p className="text-black-header text-sm md:text-base">Subtotal</p>
        <p className="font-semibold text-black-nav text-sm md:text-base">
          ${Number(totalSum).toFixed(2)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between py-3 mb-8">
        <p className="font-semibold text-base md:text-xl text-black-nav">
          Total
        </p>
        <p className="font-semibold text-base md:text-xl text-black-nav">
          $
          {Number(
            calculateFixedSum(totalSum + (Number(deliveryPrice) || 0))
          ).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}
