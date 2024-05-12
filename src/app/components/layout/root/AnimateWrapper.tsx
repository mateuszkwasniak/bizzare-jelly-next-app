"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function AnimateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
