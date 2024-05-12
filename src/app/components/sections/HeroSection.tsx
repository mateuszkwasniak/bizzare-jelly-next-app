"use client";

import React from "react";
import Image from "next/image";
import DefaultButton from "../customizable/DefaultButton";
import { motion } from "framer-motion";

export default function HeroSection({
  header,
  description,
  CTA,
  heroImage,
}: {
  header: string;
  description: string;
  CTA: string;
  heroImage: string;
}) {
  return (
    <motion.section
      className="w-full flex flex-col md:flex-row justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative flex-1 h-[calc(100vh-40px)] md:h-[calc(100vh-76px)]">
        <Image
          alt="hero"
          src={heroImage}
          width={960}
          height={1000}
          quality={100}
          className="h-full object-cover md:object-contain"
        />
      </div>
      <motion.div
        className="md:flex-1 mt-[50px] md:mt-0 mx-5 md:mx-0 flex flex-col justify-center order-first md:order-last"
        initial={{ translateX: 100 }}
        whileInView={{ translateX: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h1 className="text-black-header font-medium text-4xl lg:text-[3rem] xl:text-[4rem] 2xl:text-[5rem] leading-[36px] lg:leading-[48px] xl:leading-[72px] 2xl:leading-[84px] w-3/4 mb-3">
          {header}
        </h1>
        <p className="w-fit text-black-header text-base xl:text-lg 2xl:text-xl mb-7">
          {description}
        </p>
        <DefaultButton
          text={CTA || "Shopping Now"}
          className="md:w-fit !text-base"
          variant="link"
          href="/products"
        />
      </motion.div>
    </motion.section>
  );
}
