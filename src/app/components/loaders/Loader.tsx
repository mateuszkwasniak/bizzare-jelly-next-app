"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

import loaderImg from "../../../../public/loader.png";

export const BearLoader = () => {
  return (
    <motion.div
      className="w-10 h-10 md:w-20 md:h-20 relative"
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Image src={loaderImg} alt="loader" className="object-cover" />
    </motion.div>
  );
};

export const StandardLoader = () => {
  return (
    <motion.div
      className="w-6 h-6 border-[3px] border-transparent border-t-white border-r-white rounded-full shadow-custom"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  );
};

export default function LoadingPage() {
  return (
    <div className="h-[calc(100vh-10rem)] w-full flex justify-center items-center">
      <BearLoader />
    </div>
  );
}
