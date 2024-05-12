import React from "react";
import ProductCard from "./ProductCard";
import Loader from "@/app/components/loaders/Loader";
import ImageProductCard from "./ImageProductCard";

export default function ProductsList({
  products,
  view,
}: {
  products?: Product[];
  view: "image" | "detailed";
}) {
  return (
    <div
      id="products_list"
      className={`grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap items-center justify-center sm:items-start w-full h-full sm:justify-start px-2 md:px-0 scroll-m-44 ${
        view === "image" ? "gap-3" : "gap-3"
      }`}
    >
      {products && products?.length > 0 ? (
        products.map((product) =>
          view === "image" ? (
            <ImageProductCard key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          )
        )
      ) : products && products?.length === 0 ? (
        <p className="text-black-nav font-semibold">No products found</p>
      ) : (
        <Loader />
      )}
    </div>
  );
}
