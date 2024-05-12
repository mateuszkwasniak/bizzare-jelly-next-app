"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import PriceRangeSlider from "./PriceRangeSlider";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Pagination from "../../components/customizable/Pagination";
import { createPortal } from "react-dom";
import ViewPanel from "./ViewPanel";

const filterProducts = (
  category: string,
  min: number,
  max: number,
  field: string,
  type: string,
  page: number,
  view: "detailed" | "image",
  router: AppRouterInstance,
  pathname: string
) => {
  const params = `?category=${category}&field=${field}&type=${type}&min=${min}&max=${max}&page=${page}&view=${view}`;
  router.push(`${pathname}${params}`, { scroll: false });
};

export default function FiltersBar({
  categories,
  sortingOptions,
  productsMeta,
}: {
  categories: ProductCategory[];
  sortingOptions: ProductSortOption[];
  productsMeta?: Meta;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    0,
    Number(process.env.NEXT_PUBLIC_MAX_PRODUCT_PRICE) || 500,
  ]);
  const [displayedPriceRange, setDisplayedPriceRange] = useState<number[]>([
    0,
    Number(process.env.NEXT_PUBLIC_MAX_PRODUCT_PRICE) || 500,
  ]);
  const [selectedSortingOption, setSelectedSortingOption] = useState<{
    field: string;
    type: string;
  }>({
    field: "name",
    type: "asc",
  });
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [paginationContainer, setPaginationContainer] =
    useState<HTMLElement | null>(null);
  const [view, setView] = useState<"detailed" | "image">("detailed");
  const [viewContainer, setViewContainer] = useState<HTMLElement | null>(null);
  const [priceRangeTimeout, setPriceRangeTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [init, setInit] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setPaginationContainer(document.getElementById("pagination_container"));
    setViewContainer(document.getElementById("view_container"));
  }, []);

  useEffect(() => {
    if (init) {
      setInit(false);
      return;
    } else
      filterProducts(
        selectedCategory,
        selectedPriceRange[0],
        selectedPriceRange[1],
        selectedSortingOption.field,
        selectedSortingOption.type,
        selectedPage,
        view,
        router,
        pathname
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPriceRange,
    selectedCategory,
    router,
    pathname,
    selectedSortingOption.field,
    selectedSortingOption.type,
    selectedPage,
    view,
  ]);

  return (
    <div className="w-full sm:w-[200px] 2xl:w-[220px] flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <LuSettings2 className="text-xl md:text-2xl text-black-nav" />
        <h3 className="text-lg md:text-xl font-semibold text-black-header">
          Filters
        </h3>
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm md:text-base font-semibold text-black-header mb-4">
          CATEGORIES
        </h3>
        <ul className="flex flex-col gap-3">
          {categories ? (
            categories.map((category) => (
              <li
                key={category.value}
                className={`font-semibold text-xs md:text-sm cursor-pointer transition duration-[0.3] underline-offset-4 ${
                  selectedCategory === category.value
                    ? "text-black-header underline"
                    : "text-gray-text"
                }`}
                onClick={() => {
                  setSelectedPage(1);
                  setSelectedCategory(category.value);
                }}
              >
                {category.label}
              </li>
            ))
          ) : (
            <p>Loading..</p>
          )}
        </ul>
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm md:text-base font-semibold text-black-header mb-4">
          PRICE
        </h3>
        <PriceRangeSlider
          min={0}
          max={Number(process.env.NEXT_PUBLIC_MAX_PRODUCT_PRICE) || 1000}
          step={10}
          value={displayedPriceRange}
          onInputChange={(input: number[]) => {
            if (priceRangeTimeout) clearTimeout(priceRangeTimeout);
            setDisplayedPriceRange(input);
            const timeout = setTimeout(() => {
              setSelectedPage(1);
              setSelectedPriceRange(input);
            }, 1000);
            setPriceRangeTimeout(timeout);
          }}
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm md:text-base font-semibold text-black-header mb-4">
          SORT BY
        </h3>
        <ul className="flex flex-col gap-2 md:gap-3">
          {sortingOptions.map((option) => (
            <li
              key={option.label}
              className={`text-sm md:text-base flex justify-between items-center`}
            >
              <span className="font-semibold text-gray-text text-xs md:text-sm">
                {option.label}
              </span>
              <div
                className="cursor-pointer"
                onClick={() =>
                  setSelectedSortingOption({
                    field: option.field,
                    type: option.type,
                  })
                }
              >
                {selectedSortingOption.field === option.field &&
                selectedSortingOption.type === option.type ? (
                  <MdCheckBox className="text-2xl text-black-nav" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-2xl text-gray-deep" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {productsMeta &&
        paginationContainer &&
        createPortal(
          <Pagination
            total={productsMeta?.pagination.total}
            page={productsMeta?.pagination.page}
            setPage={setSelectedPage}
            pageCount={productsMeta?.pagination.pageCount}
            scrollTo={"products_list"}
          />,
          paginationContainer
        )}
      {viewContainer &&
        createPortal(
          <ViewPanel view={view} setView={setView} />,
          viewContainer
        )}
    </div>
  );
}
