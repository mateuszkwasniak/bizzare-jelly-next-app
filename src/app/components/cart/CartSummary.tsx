"use client";

import React, { useEffect, useState } from "react";
import DeliveryMethodPanel from "../customizable/RadioPanel";
import { calculateFixedSum, useCartState } from "@/hooks/store/cart";
import DefaultButton from "../customizable/DefaultButton";

const fetchDeliveryMethodFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  if (cart) {
    const cartData: {
      deliveryMethod: string;
    } = JSON.parse(cart);
    return cartData.deliveryMethod;
  } else return "";
};

export default function CartSummary({
  deliveryMethods,
}: {
  deliveryMethods: DeliveryMethod[];
}) {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<DeliveryMethod | null>(null);

  const totalSum = useCartState((state) => state.totalSum);
  const setDeliveryMethod = useCartState((state) => state.setDeliveryMethod);

  useEffect(() => {
    selectedDeliveryMethod && setDeliveryMethod(selectedDeliveryMethod.name);
  }, [selectedDeliveryMethod, setDeliveryMethod]);

  useEffect(() => {
    setSelectedDeliveryMethod(
      deliveryMethods.find(
        (method) => method.name === fetchDeliveryMethodFromLocalStorage()
      ) || deliveryMethods[0]
    );
  }, []);

  return (
    <div className="h-fit flex flex-col p-6 rounded-md border border-gray-deep shadow-custom">
      <h3 className="font-medium text-base md:text-xl text-black-nav mb-6 md:mb-4">
        Cart Summary
      </h3>
      <div className="w-full flex flex-col gap-3 mb-4">
        {deliveryMethods.map((delivery) => (
          <DeliveryMethodPanel
            key={delivery.id}
            value={delivery}
            selectedValue={selectedDeliveryMethod}
            setSelectedValue={setSelectedDeliveryMethod}
          />
        ))}
      </div>
      <div className="w-full flex items-center justify-between py-3 border-b border-gray-[#EAEAEA]">
        <p className="text-sm md:text-base text-black-header">Subtotal</p>
        <p className="text-sm md:text-base font-semibold text-black-nav">
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
            calculateFixedSum(
              totalSum + (Number(selectedDeliveryMethod?.price) || 0)
            )
          ).toFixed(2)}
        </p>
      </div>
      <DefaultButton
        text="Checkout"
        variant="link"
        href="/checkout?stage=details"
      />
    </div>
  );
}
