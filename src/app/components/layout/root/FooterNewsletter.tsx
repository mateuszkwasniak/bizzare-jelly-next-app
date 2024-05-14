"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LuMail } from "react-icons/lu";

export default function FooterNewsletter({
  footerImage,
  header,
  description,
}: {
  footerImage: string;
  header: string;
  description: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={`h-[360px] 2xl:h-[460px] 3xl:h-[480px] 4xl:h-[560px] relative justify-center py-24 bg-black ${
        pathname !== "/auth/login" && pathname !== "/auth/register"
          ? "flex"
          : "hidden"
      }`}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${footerImage}`}
        alt="footer"
        width={2000}
        height={400}
        quality={100}
        className="w-full h-full object-cover absolute left-0 top-0 opacity-75"
      />
      <div className="max-w-[1920px] px-5 md:px-40 flex flex-col items-center justify-center gap-2 z-10">
        <h2 className="text-center font-semibold text-4xl md:text-5xl text-white mb-2">
          {header}
        </h2>
        <p className="text-center md:text-start text-md md:text-lg text-white mb-8">
          {description}
        </p>
        <div className="relative h-fit w-full border-b border-white">
          <input
            className="w-[calc(100%-5rem)] bg-transparent pb-3 pl-8 text-white placeholder:text-white outline-none"
            placeholder="Email address"
          />
          <LuMail className="absolute left-0 top-0 text-2xl text-white" />
          <button className="w-16 absolute right-0 top-0 font-semibold text-white">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
