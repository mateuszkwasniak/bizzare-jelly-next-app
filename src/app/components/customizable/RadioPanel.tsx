import React, { SetStateAction } from "react";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { FaCcPaypal } from "react-icons/fa";

const icons = {
  card: <FaRegCreditCard className="text-base md:text-2xl" />,
  paypal: <FaCcPaypal className="text-base md:text-2xl" />,
};

export default function RadioPanel({
  value,
  selectedValue,
  setSelectedValue,
}: {
  value: any;
  selectedValue: any;
  setSelectedValue: React.Dispatch<SetStateAction<any>>;
}) {
  const { text, name, price, icon } = value;

  return (
    <div
      className={`px-4 py-2 md:py-3 w-full flex items-center rounded border transition duration-300 cursor-pointer ${
        name === selectedValue?.name
          ? "bg-[#F3F5F7] border-black-nav"
          : "bg-[#FEFEFE] border-gray-deep"
      }`}
      onClick={() => setSelectedValue(value)}
    >
      <div className="mr-3">
        {name === selectedValue?.name ? (
          <MdOutlineRadioButtonChecked className="text-base md:text-2xl" />
        ) : (
          <MdOutlineRadioButtonUnchecked className="text-base md:text-2xl" />
        )}
      </div>
      <p className="font-semibold text-black-nav text-xs md:text-sm">{text}</p>
      <p className="font-semibold text-xs md:text-sm text-black-nav ml-auto">
        {value?.price >= 0
          ? `$${Number(price).toFixed(2)}`
          : value?.icon
          ? icons[icon as keyof typeof icons]
          : null}
      </p>
    </div>
  );
}
