"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSliderState } from "@/hooks/slider";

export default function SlideMinis({ images }: { images: string[] }) {
  const setCurrentImage = useSliderState((state) => state.setCurrentImage);

  useEffect(() => {
    setCurrentImage(0);
  }, []);

  return (
    <div className="w-full mt-auto flex gap-2 md:gap-6 pb-5 md:pb-0">
      {images.map((picture, idx) => (
        <div
          key={idx}
          className="flex-1 h-[100px] md:h-[150px] 4xl:h-[240px] relative cursor-pointer"
          onClick={() => {
            setCurrentImage(idx);
            window.scrollTo({ top: 0 });
          }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${picture}`}
            alt="product-small"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
