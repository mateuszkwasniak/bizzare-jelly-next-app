"use client";

import { motion } from "framer-motion";
import React, { SetStateAction } from "react";
import Select, { ActionMeta } from "react-select";

interface Option {
  label: string;
  value: IShippingAddress;
}

export default function SelectShippingAddress({
  shippingAddresses,
  selectedShippingAddress,
  setSelectedShippingAddress,
  setClearInputs,
  clearInvalidFormFields,
}: {
  shippingAddresses: IShippingAddress[];
  selectedShippingAddress: IShippingAddress;
  setSelectedShippingAddress: React.Dispatch<
    SetStateAction<IShippingAddress | null>
  >;
  setClearInputs: React.Dispatch<SetStateAction<boolean>>;
  clearInvalidFormFields: () => void;
}) {
  const options: Option[] = shippingAddresses.map((address) =>
    address.id !== -1
      ? {
          value: address,
          label: `${address.street} ${address.local}, ${address.city}`,
        }
      : { value: address, label: `Custom address` }
  );

  const handleOption: (
    option: Option | null,
    actionMeta: ActionMeta<Option>
  ) => void = (option) => {
    setSelectedShippingAddress(option?.value || null);
    setClearInputs(true);
    clearInvalidFormFields();
  };

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h3 className="font-medium text-base xl:text-xl text-black mb-4">
        Your saved addresses
      </h3>
      <div className="w-full md:w-[45%]">
        <Select
          onChange={handleOption}
          options={options}
          value={options.filter(
            (option) => option.value.id === selectedShippingAddress.id
          )}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "#121212",
              primary25: "rgb(134 239 172)",
            },
          })}
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              width: "100%",
              transition: "all 0.3s ease-in-out",
            }),

            control: (baseStyles) => ({
              ...baseStyles,
              border: "1px solid #121212",
            }),

            option: (baseStyles) => ({
              ...baseStyles,
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
            }),
          }}
        />
      </div>
    </motion.div>
  );
}
