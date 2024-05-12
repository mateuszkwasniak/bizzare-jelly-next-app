import AddToCartButton from "@/app/components/cart/AddToCartButton";
import Image from "next/image";
import React from "react";
import { LuHeart } from "react-icons/lu";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="w-full max-w-[175px] xl:max-w-[262px] h-fit flex flex-col gap-3 cursor-pointer shadow-card transition duration-300 hover:scale-[1.01]"
      href={`products/${product.id}`}
    >
      <div className="flex flex-col justify-between w-full h-[175px] md:h-[250px] xl:h-[349px] p-4 relative">
        <div className="w-full flex justify-between">
          <div className="h-fit py-0.5 px-3 bg-white font-bold text-black-header text-center text-[10px] xl:text-base rounded-sm">
            NEW
          </div>
          <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full flex items-center justify-center shadow-custom bg-white">
            <LuHeart className="text-gray-deep text-base xl:text-lg hover:fill-red-500 hover:text-white transition duration-0.3 cursor-pointer" />
          </div>
        </div>
        <AddToCartButton
          product={product}
          className="w-full rounded-md border-none font-medium justify-center uppercase !text-[10px] xl:!text-base"
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.attributes.pictures.data[0].attributes.url}`}
          alt="product"
          width={262}
          height={349}
          className="w-full h-full object-cover absolute left-0 top-0 -z-20"
        />
      </div>
      <div className="h-[60px] px-3 pb-4 overflow-hidden">
        <p className="text-xs xl:text-base font-semibold text-black-nav mb-1">
          {product.attributes.name}
        </p>
        <p className="text-xs xl:text-base font-semibold text-black-header">
          ${product.attributes.price}
        </p>
      </div>
    </Link>
  );
}
