"use client";

import React from "react";
import Image from "next/image";
import DefaultButton from "../customizable/DefaultButton";
import ProductCard from "@/app/products/components/ProductCard";
import { motion } from "framer-motion";

export default function ArrivalsSection({
  header,
  newProducts,
}: {
  header: string;
  newProducts: Product[];
}) {
  return (
    <motion.section
      className="w-full px-4 md:px-0 pb-12 md:pb-20 flex flex-col items-center gap-12"
      initial={{ opacity: 0, translateY: 100 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ margin: "-150px", once: true }}
    >
      <h2 className="font-medium text-2xl md:text-4xl text-black-header">
        {header}
      </h2>
      <div className="w-full flex flex-wrap flex-row justify-center items-center gap-4 md:gap-6">
        {newProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.section>
  );
}
