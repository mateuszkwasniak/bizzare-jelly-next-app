import AddToCartButton from "@/app/components/cart/AddToCartButton";
import Image from "next/image";
import React from "react";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="w-full max-w-[200px] xl:max-w-[262px] h-fit flex flex-col gap-3 cursor-pointer shadow-card transition duration-300 hover:scale-[1.01]"
      href={`products/${product.id}`}
    >
      <div className="flex flex-col justify-between w-full h-[175px] md:h-[250px] xl:h-[349px] p-4 relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${product.attributes.pictures.data[0].attributes.url}`}
          alt="product"
          width={262}
          height={349}
          className="w-full h-full object-cover absolute left-0 top-0 -z-20"
        />
      </div>
    </Link>
  );
}
