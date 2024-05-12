"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { LuArrowLeft } from "react-icons/lu";
import { LuArrowRight } from "react-icons/lu";
import { useSliderState } from "@/hooks/slider";

export default function Slider({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  const currentImage = useSliderState((state) => state.currentImage);
  const nextImage = useSliderState((state) => state.nextImage);
  const previousImage = useSliderState((state) => state.previousImage);

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        className ? className : ""
      }`}
    >
      {images.map((image, idx) => {
        return (
          <motion.div
            key={image}
            className={`h-full w-full absolute left-0`}
            initial={{ x: idx + "00%" }}
            animate={{
              x: idx - currentImage + "00%",
              opacity: idx === currentImage ? 1 : 0,
            }}
            transition={{ duration: 0.6, type: "tweek" }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image}`}
              width={600}
              height={800}
              alt="slide"
              className="w-full h-full object-cover"
            />
            <button
              onClick={previousImage}
              className="w-10 h-10 absolute left-5 top-[50%] translate-y-[-50%] rounded-full flex items-center justify-center bg-white shadow-custom"
            >
              <LuArrowLeft className="text-xl" />
            </button>
            <button
              onClick={nextImage}
              className="w-10 h-10 absolute right-5 top-[50%] translate-y-[-50%] rounded-full flex items-center justify-center bg-white shadow-custom"
            >
              <LuArrowRight className="text-xl" />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
