import React from "react";
import Image from "next/image";
import AnimateWrapper from "./components/layout/root/AnimateWrapper";
import notFound from "../../public/not_found.png";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <AnimateWrapper>
      <main className="w-full h-[calc(100vh-40px)] md:h-[calc(100vh-76px)] flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-full md:relative opacity-20 md:opacity-100 absolute">
          <Image
            src={notFound}
            alt="Not Found"
            className="h-full w-full object-cover"
            placeholder="blur"
          />
        </div>
        <div className="p-2 md:p-0 md:pl-8 flex flex-col items-center justify-center md:items-start gap-2 h-full md:h-fit w-full md:w-fit opacity-100 z-20">
          <h2 className="text-4xl sm:text-5xl xl:text-7xl 2xl:text-8xl font-medium text-black-nav text-center md:text-start">
            OOPS, page <br className="hidden md:inline" /> not found
          </h2>
          <p className="mb-4 text-xl text-black-nav text-center md:text-start">
            Breath, eat your jelly & try again.
          </p>
          <a
            href="/"
            className="w-fit rounded-lg flex items-center justify-center text-center text-base xl:text-sm 2xl:text-base px-6 py-2 xl:px-14 xl:py-3 text-white bg-black-nav hover:bg-slate-800 transition-all duration-[0.3s] shadow-custom "
          >
            Back Home
          </a>
        </div>
      </main>
    </AnimateWrapper>
  );
}
