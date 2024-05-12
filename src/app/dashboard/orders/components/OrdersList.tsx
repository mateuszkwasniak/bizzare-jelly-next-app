"use client";

import { motion } from "framer-motion";
import React from "react";
import OrderRecord from "./OrderRecord";

export default function OrdersList({ orders }: { orders: Partial<Order>[] }) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full hidden md:flex border-b pb-2 border-[#e8ecef] text-sm text-[#6c7275]">
        <p className="flex-[1.25] h-fit">Number ID</p>
        <p className="flex-1 h-fit">Dates</p>
        <p className="flex-1 h-fit">Status</p>
        <p className="flex-1 h-fit">Price</p>
      </div>
      {orders?.map((order, idx) => (
        <OrderRecord key={order.id} order={order} />
      ))}
    </motion.div>
  );
}
