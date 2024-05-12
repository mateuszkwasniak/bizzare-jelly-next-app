"use client";

import React from "react";
import "react-range-slider-input/dist/style.css";
import RangeSlider from "react-range-slider-input";

export default function PriceRangeSlider({
  min,
  max,
  step,
  value,
  onInputChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number[];
  onInputChange: (input: number[]) => void;
}) {
  return (
    <div className="w-full">
      <RangeSlider
        className="[&>*:nth-child(3)]:!bg-black-nav [&>*:nth-child(3)]:!h-4 [&>*:nth-child(3)]:!w-4 [&>*:nth-child(4)]:!bg-black-nav [&>*:nth-child(4)]:!h-4 [&>*:nth-child(4)]:!w-4 [&>*:nth-child(5)]:!bg-gray-400"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={onInputChange}
      />
      <div className="w-full flex justify-between text-sm text-gray-deep mt-3">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
    </div>
  );
}
