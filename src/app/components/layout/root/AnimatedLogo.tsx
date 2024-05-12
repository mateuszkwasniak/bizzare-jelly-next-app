"use client";

import React from "react";
import { motion } from "framer-motion";
import logo from "../../../../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function AnimatedLogo() {
  return (
    <Link href="/" className="flex items-center justify-center">
      <motion.div
        animate={{
          scaleX: [1, 1.18, 0.5, 1.12, 0.75, 1.1, 0.9, 1],
          scaleY: [1, 0.25, 1.18, 0.5, 1.12, 0.75, 1.1, 1],
          opacity: [0, 1],
        }}
        transition={{
          duration: 0.7,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center relative w-28 md:w-44 xl:w-64 h-fit opacity-0"
      >
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={50}
          className="object-cover w-full"
        />
      </motion.div>
    </Link>
  );
}
