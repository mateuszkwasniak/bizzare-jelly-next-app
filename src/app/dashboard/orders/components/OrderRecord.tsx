"use client";

import React from "react";

export default function OrderRecord({ order }: { order: Partial<Order> }) {
  const details = (
    <>
      <p className="flex-1 md:flex-[1.25] text-sm md:text-base">#{order.id}</p>
      <p className="flex-1 text-sm md:text-base">
        {new Date(order?.createdAt ? order.createdAt : 0).toLocaleDateString(
          "pl"
        )}
      </p>
      <p className="flex-1 text-sm md:text-base">
        {order.status
          ? order.status[0]?.toUpperCase() + order.status.slice(1)
          : ""}
      </p>
      <p className="flex-1 text-sm md:text-base">${order.total}</p>
    </>
  );

  return (
    <>
      <div className="md:hidden w-full flex py-4 justify-between items-start border-b border-[#e8ecef]">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#6c7275]">Number ID</p>
          <p className="text-sm text-[#6c7275]">Dates</p>
          <p className="text-sm text-[#6c7275]">Status</p>
          <p className="text-sm text-[#6c7275]">Price</p>
        </div>
        <div className="flex flex-col gap-4">{details}</div>
      </div>
      <div className="w-full py-6 hidden md:flex text-black-nav border-b border-[#e8ecef]">
        {details}
      </div>
    </>
  );
}
