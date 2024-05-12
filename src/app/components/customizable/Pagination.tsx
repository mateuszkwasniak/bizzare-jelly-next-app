"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { SetStateAction } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Page = ({
  onClick,
  num,
  page,
  pageCount,
}: {
  onClick: () => void;
  num: number;
  page: number;
  pageCount: number;
}) => {
  return (
    <div
      className={`h-6 w-6 flex items-center justify-center text-sm font-medium ${
        page !== num ? "cursor-pointer" : ""
      } ${
        page === num && pageCount > 1
          ? "rounded-full bg-black-nav text-white transition duration-300"
          : "text-gray-deep"
      }`}
      onClick={onClick}
    >
      {num}
    </div>
  );
};

export default function Pagination({
  total,
  page,
  pageCount,
  scrollTo,
  setPage,
}: {
  total: number;
  page: number;
  pageCount: number;
  scrollTo: string;
  setPage?: React.Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToTop = () => {
    const el = document.querySelector(`#${scrollTo}`);
    if (el) {
      el.scrollIntoView();
    }
  };

  const changePage = (page: number) => {
    setPage
      ? setPage(page)
      : router.push(`${pathname}?page=${page}`, { scroll: false });
    scrollToTop();
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-0 w-full h-fit pt-8 md:pt-0 items-center justify-start">
      <div className="order-last md:order-first">
        <span className="text-sm text-gray-deep font-medium text-nowrap">
          Total: {total}
        </span>
      </div>
      <div
        className={`flex justify-between items-center w-full md:w-[400px] mx-auto`}
      >
        {page !== 1 ? (
          <LuChevronLeft
            onClick={() => changePage(page - 1)}
            className="cursor-pointer w-5 h-5 text-gray-deep font-semibold"
          />
        ) : (
          <span className="w-5 h-5" />
        )}
        <div className="flex gap-4">
          {pageCount > 4 ? (
            page === 1 ? (
              <>
                <Page
                  onClick={() => changePage(page)}
                  num={page}
                  page={page}
                  pageCount={pageCount}
                />
                <Page
                  onClick={() => changePage(page + 1)}
                  num={page + 1}
                  page={page}
                  pageCount={pageCount}
                />
                <Page
                  onClick={() => changePage(page + 2)}
                  num={page + 2}
                  page={page}
                  pageCount={pageCount}
                />
                <span className="w-6 h-6">...</span>
                <Page
                  onClick={() => changePage(pageCount)}
                  num={pageCount}
                  page={page}
                  pageCount={pageCount}
                />
              </>
            ) : page === pageCount ? (
              <>
                <Page
                  onClick={() => changePage(1)}
                  num={1}
                  page={page}
                  pageCount={pageCount}
                />
                <span className="w-6 h-6 text-black-nav">...</span>
                <Page
                  onClick={() => changePage(page - 2)}
                  num={page - 2}
                  page={page}
                  pageCount={pageCount}
                />
                <Page
                  onClick={() => changePage(page - 1)}
                  num={page - 1}
                  page={page}
                  pageCount={pageCount}
                />
                <Page
                  onClick={() => changePage(page)}
                  num={page}
                  page={page}
                  pageCount={pageCount}
                />
              </>
            ) : (
              <>
                {page > 2 ? (
                  <>
                    <Page
                      onClick={() => changePage(1)}
                      num={1}
                      page={page}
                      pageCount={pageCount}
                    />{" "}
                    {page > 3 ? <span className="w-6 h-6">...</span> : ""}
                  </>
                ) : null}
                <Page
                  onClick={() => changePage(page - 1)}
                  num={page - 1}
                  page={page}
                  pageCount={pageCount}
                />

                <Page
                  onClick={() => changePage(page)}
                  num={page}
                  page={page}
                  pageCount={pageCount}
                />

                <Page
                  onClick={() => changePage(page + 1)}
                  num={page + 1}
                  page={page}
                  pageCount={pageCount}
                />

                {page < pageCount - 1 ? (
                  <>
                    {page + 2 === pageCount ? (
                      ""
                    ) : (
                      <span className="w-6 h-6 text-black-nav">...</span>
                    )}
                    <Page
                      onClick={() => changePage(pageCount)}
                      num={pageCount}
                      page={page}
                      pageCount={pageCount}
                    />
                  </>
                ) : null}
              </>
            )
          ) : pageCount === 1 ? (
            <span className="text-sm text-gray-deep font-medium">1 of 1</span>
          ) : (
            [...Array(pageCount)].map((_, idx) => (
              <Page
                key={idx}
                onClick={() => changePage(idx + 1)}
                page={page}
                pageCount={pageCount}
                num={idx + 1}
              />
            ))
          )}
        </div>
        {page !== pageCount && pageCount !== 0 ? (
          <LuChevronRight
            className="cursor-pointer w-5 h-5 text-gray-deep font-semibold"
            onClick={() => changePage(page + 1)}
          />
        ) : (
          <span className="w-5 h-5" />
        )}
      </div>
    </div>
  );
}
