import React from "react";
import Image from "next/image";
import { LuMail } from "react-icons/lu";
import Link from "next/link";
import { LuInstagram } from "react-icons/lu";
import { LuFacebook } from "react-icons/lu";
import { LuYoutube } from "react-icons/lu";

import { fetchFooterDetails } from "@/utils/strapi/get";

const links: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Product", href: "/products" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

export default async function Footer() {
  let header: string = "";
  let description: string = "";
  let footerImage: string = "";

  try {
    const response = await fetchFooterDetails();
    if (response?.error) {
      throw new Error(response?.error);
    } else if (response?.data) {
      header = response.data.header;
      description = response.data.description;
      footerImage = response.data.footerImage;
    }
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }

  return (
    <footer className="w-full">
      <div className="h-[360px] 2xl:h-[460px] 3xl:h-[480px] 4xl:h-[560px] relative flex justify-center py-24 bg-black">
        <Image
          src={`${process.env.STRAPI_BASE_URL}${footerImage}`}
          alt="footer"
          width={2000}
          height={400}
          quality={100}
          className="w-full h-full object-cover absolute left-0 top-0 opacity-75"
        />
        <div className="max-w-[1920px] px-5 md:px-40 flex flex-col items-center justify-center gap-2 z-10">
          <h2 className="text-center md:text-start font-semibold text-4xl md:text-5xl text-white mb-2">
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
      <div className="h-fit w-full bg-black-nav pb-8 pt-12 flex justify-center">
        <div className="w-full max-w-[1920px] px-5 md:px-40">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6">
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-8 mb-4 md:mb-0">
              <span className="text-white font-bold text-2xl md:text-base">
                Bizzare Jelly
              </span>
              <div className="hidden md:block h-full w-[1px] bg-gray-deep" />
              <span className="hidden md:block text-gray-border">
                Gummy Zone
              </span>
            </div>
            <ul className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-10">
              {links.map((link, idx) => (
                <li className="text-sm text-[#FEFEFE]" key={idx}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0 pt-4 pb-5 border-t-[0.5px] border-gray-deep">
            <div className="flex flex-col md:flex-row items-center gap-7">
              <span className="text-xs text-[#E8ECEF] text-center md:text-start order-last md:order-first">
                Copyright &copy; 2024 Bizzare Jelly. All rights reserved
              </span>
              <span className="font-semibold text-xs text-[#FEFEFE]">
                Privacy Policy
              </span>
              <span className="font-semibold text-xs text-[#FEFEFE]">
                Terms of use
              </span>
            </div>
            <div className="flex gap-6 items-center order-first md:order-last">
              <LuInstagram className="text-2xl text-[#FEFEFE]" />
              <LuFacebook className="text-2xl text-[#FEFEFE]" />
              <LuYoutube className="text-2xl text-[#FEFEFE]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
