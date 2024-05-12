"use client";

import React, { SetStateAction } from "react";
import InputMask from "react-input-mask";

export default function DefaultFormItem({
  label,
  name,
  value,
  setValue,
  onChange,
  setInvalidFormFields,
  placeholder,
  disabledInput = true,
  inputType = "text",
  error,
  className,
  mask,
}: {
  label: string;
  name: string;
  value: string;
  setValue?: React.Dispatch<SetStateAction<any>>;
  onChange?: () => void;
  setInvalidFormFields?: React.Dispatch<SetStateAction<any>>;
  placeholder?: string;
  disabledInput?: boolean;
  inputType?: "text" | "password" | "email";
  error?: string;
  className?: string;
  mask?: string;
}) {
  return (
    <div className={`flex flex-col ${className ? className : ""}`}>
      <label
        htmlFor={name}
        className="text-[10px] md:text-xs font-bold text-gray-deep mb-2"
      >
        {label}
      </label>
      <InputMask
        mask={mask || ""}
        id={name}
        name={name}
        className={`w-full px-4 py-2 text-xs md:text-base border ${
          error ? "border-red-500" : "border-[#CBCBCB]"
        } outline-none rounded-md placeholder:text-gray-deep focus:border-black-nav transition-all duration-300 scroll-m-32`}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange();
          }

          if (setValue) {
            setValue((prev: any) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }
        }}
        onFocus={(e) =>
          setInvalidFormFields &&
          setInvalidFormFields((prev: any) => ({
            ...prev,
            [e.target.name]: "",
          }))
        }
        placeholder={placeholder || value}
        disabled={disabledInput}
        type={inputType}
      />
      <p
        className={`h-4 mt-1 md:-mb-3 p-0 ${
          error ? "opacity-100" : "opacity-0"
        } text-red-500 text-[10px] md:text-xs`}
      >
        {error}
      </p>
    </div>
  );
}
