"use client";

import { useOrderState } from "@/hooks/store/order";
import React, { useEffect } from "react";
import Image from "next/image";
import rocketGummy from "../../../../../public/rocket_gummy.svg";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartState } from "@/hooks/store/cart";
import { useAuthState } from "@/hooks/store/auth";
import DefaultButton from "@/app/components/customizable/DefaultButton";

export default function OrderCompleteCard() {
  const order = useOrderState((state) => state.order);
  const clearCart = useCartState((state) => state.clearCart);

  const jwt = useAuthState((state) => state.auth.jwt);

  const router = useRouter();

  useEffect(() => {
    if (!order) {
      router.replace("/");
    }
  }, [router, order]);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <motion.div
      className="w-[750px] h-fit rounded-lg pt-40 pb-20 px-10 md:px-24 flex flex-col items-center shadow-lg relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-6 gap-2 w-24 h-48 absolute"
        initial={{ opacity: 0, top: 220 }}
        animate={{ opacity: 1, top: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          alt="Rocket"
          src={rocketGummy}
          width={100}
          height={200}
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div
        className="w-full flex flex-col gap-4 items-center justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <p className="font-semibold text-lg md:text-2xl text-[#6c7275] relative">
          Thank you!
        </p>
        <h2 className="w-full md:w-3/4 mb-10 font-semibold text-3xl md:text-4xl text-[rgba(35, 38, 47, 1)] text-center">
          Your order has been received
        </h2>
      </motion.div>
      <motion.div className="mb-10 flex flex-wrap items-center justify-center gap-6 md:gap-14">
        {order?.ordered &&
          order?.ordered.map((item, idx) => (
            <motion.div
              key={item.id}
              className="w-16 h-20 md:w-20 md:h-24 relative bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, delay: 1.1 + idx / 3 }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.product.pictures[0].url}`}
                alt="product"
                width={80}
                height={96}
                className="w-full h-full object-cover"
              />
              <div className="absolute w-6 h-6 md:w-8 md:h-8 -right-4 -top-4 text-xs md:text-base rounded-full flex items-center justify-center text-[#fcfcfd] bg-[#141718]">
                {item.count}
              </div>
            </motion.div>
          ))}
      </motion.div>
      <motion.div
        className="flex justify-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 2 }}
      >
        <div className="flex flex-col gap-5">
          <p className="font-semibold text-sm text-[#6c7275]">Order code:</p>
          <p className="font-semibold text-sm text-[#6c7275]">Date:</p>
          <p className="font-semibold text-sm text-[#6c7275]">Total:</p>
          <p className="font-semibold text-sm text-[#6c7275]">
            Payment method:
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <p className="font-semibold text-sm text-[rgba(20, 23, 24, 1)]">
            #{order?.id}
          </p>
          <p className="font-semibold text-sm text-[rgba(20, 23, 24, 1)]">
            {new Date(order?.createdAt || 0).toLocaleDateString()}
          </p>
          <p className="font-semibold text-sm text-[rgba(20, 23, 24, 1)]">
            ${Number(order?.total).toFixed(2)}
          </p>
          <p className="font-semibold text-sm text-[rgba(20, 23, 24, 1)]">
            {order?.payment
              ? order?.payment[0].toUpperCase() + order?.payment.slice(1)
              : ""}
          </p>
        </div>
      </motion.div>
      {jwt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.5 }}
          className="w-full flex items-center justify-center"
        >
          <DefaultButton
            text="Purchase history"
            variant="link"
            href="/dashboard/orders"
            className="!rounded-full !mt-12"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
