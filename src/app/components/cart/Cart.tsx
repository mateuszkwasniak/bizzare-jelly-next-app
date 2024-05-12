"use client";

import React, { useEffect } from "react";
import { useCartState } from "@/hooks/store/cart";
import { usePathname } from "next/navigation";
import { CartItem } from "./CartItem";
import { IoCloseOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import DefaultButton from "../customizable/DefaultButton";

export default function Cart({
  showCart,
  setShowCart,
}: {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const products = useCartState((state) => state.products);
  const totalSum = useCartState((state) => state.totalSum);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("checkout")) setShowCart(false);
  }, [pathname, setShowCart]);

  useEffect(() => {
    if (products.length === 0) {
      setShowCart(false);
    }
  }, [products, setShowCart]);

  return (
    <AnimatePresence>
      {showCart && (
        <div className="h-screen w-full justify-between fixed top-0 flex z-50">
          <motion.div
            className="h-full bg-gray-700"
            initial={{ opacity: 0, flex: 0 }}
            animate={{ opacity: 0.5, flex: 1 }}
            exit={{ opacity: 0, flex: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="h-screen w-full md:w-fit px-6 py-10 flex flex-col justify-between bg-white "
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 1000 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col [&::webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-black-header text-2xl md:text-[1.75rem] font-medium">
                  Cart
                </h3>
                <IoCloseOutline
                  className="text-2xl text-gray-deep cursor-pointer"
                  onClick={() => setShowCart(false)}
                />
              </div>
              {products.map((product) => (
                <CartItem
                  product={product}
                  setShowCart={setShowCart}
                  key={product.id}
                />
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-4 mb-2">
              <div className="flex justify-between">
                <p className="font-medium text-xl text-black-nav">Total</p>
                <span className="font-medium text-xl text-black-nav md:min-w-24 text-end">
                  ${Number(totalSum).toFixed(2)}
                </span>
              </div>

              <DefaultButton
                text="Checkout"
                variant="link"
                disabled={products?.length === 0}
                href={"/checkout?stage=cart"}
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
