"use client";

import { motion } from "framer-motion";
import { SetStateAction } from "react";
import { LuPencilLine, LuTrash } from "react-icons/lu";

export default function AddressCard({
  address,
  cardTitle,
  setOpenForm,
  setShowModal,
}: {
  address: IShippingAddress;
  addressesCount: number;
  cardTitle: string;
  setOpenForm: React.Dispatch<SetStateAction<boolean>>;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <motion.article
      className="w-full md:w-[400px] h-fit py-4 px-6 order-2 flex flex-col gap-2 border border-gray-deep rounded-lg bg-white shadow-custom"
      layout
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-black text-sm md:text-base">
          {cardTitle}
        </h3>
        <div className="flex items-center justify-between gap-4">
          <button
            className="font-semibold text-gray-deep flex items-center gap-2 hover:text-black-nav transition duration-300"
            onClick={() => setOpenForm((prev) => !prev)}
          >
            <LuPencilLine className="w-4 h-4" />
            <span className="hidden md:block">Edit</span>
          </button>
          <button
            className="font-semibold text-gray-deep flex items-center gap-2 hover:text-black-nav transition duration-300"
            onClick={() => setShowModal(true)}
          >
            <LuTrash className="w-4 h-4" />
            <span className="hidden md:block">Delete</span>
          </button>
        </div>
      </div>
      <p className="text-xs md:text-sm text-black">
        {address.firstName} {address.lastName}
      </p>
      <p className="text-xs md:text-sm text-black">{address.phone}</p>
      <p className="text-xs md:text-sm text-black">
        {address.street} {address.local}, {address.postal} {address.city}
      </p>
    </motion.article>
  );
}
