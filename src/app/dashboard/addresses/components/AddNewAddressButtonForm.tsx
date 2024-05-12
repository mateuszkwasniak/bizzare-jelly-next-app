"use client";

import DefaultButton from "@/app/components/customizable/DefaultButton";
import React, { useEffect, useState } from "react";
import AddOrEditAddressForm from "./AddOrEditAddressForm";
import { AnimatePresence, motion } from "framer-motion";

export default function AddNewAddressButton({
  addressesCount,
}: {
  addressesCount: number;
}) {
  const [openForm, setOpenForm] = useState<boolean>(false);

  useEffect(() => {
    if (!openForm) {
      window.scrollTo({ top: 0 });
    }
  }, [openForm]);

  return (
    <AnimatePresence>
      {openForm ? (
        <AddOrEditAddressForm
          key="newForm"
          setOpenForm={setOpenForm}
          addressesCount={addressesCount}
        />
      ) : (
        <motion.div
          className="w-full md:w-fit h-fit order-3"
          layout
          animate={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          transition={{ duration: "0.3", ease: "easeInOut" }}
        >
          <DefaultButton
            key="button"
            text={
              addressesCount === 0
                ? "ADD SHIPPING ADDRESS"
                : addressesCount === 1
                ? "ADD SECONDARY ADDRESS"
                : "ADD TERTIARY ADDRESS"
            }
            onClick={() => setOpenForm(true)}
            className="w-full md:w-[350px] h-fit py-4 px-6 flex flex-col items-center justify-center cursor-pointer gap-3 border border-gray-deep rounded-lg shadow-custom  text-xl font-bold"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
