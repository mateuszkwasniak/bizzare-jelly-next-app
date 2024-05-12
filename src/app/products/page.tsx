import Image from "next/image";
import FiltersBar from "./components/FiltersBar";
import ProductsList from "./components/ProductsList";
import {
  fetchProductsDataBasedOnSearchParams,
  fetchProductsPageDetails,
} from "@/utils/strapi/get";
import { Suspense } from "react";
import Loader from "../components/loaders/Loader";
import { Metadata } from "next";
import AnimateWrapper from "../components/layout/root/AnimateWrapper";

export async function generateMetadata(): Promise<Metadata> {
  let SEO: SEO | undefined;

  const response = await fetchProductsPageDetails();

  SEO = response?.data?.SEO;

  return {
    title: SEO?.metaTitle || "Bizzare products page",
    description: SEO?.metaDescription || "Bizzare products description",
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  
  let shopImage: string = "";
  let categories: ProductCategory[] = [];
  let sortingOptions: ProductSortOption[] = [];
  let productsData: {
    products: Product[];
    productsMeta: Meta;
  } = {
    products: [],
    productsMeta: {
      pagination: {
        page: 0,
        pageSize: 0,
        pageCount: 0,
        total: 0,
      },
    },
  };

  try {
    const [pageDataResponse, productsDataResponse] = await Promise.all([
      fetchProductsPageDetails(),
      fetchProductsDataBasedOnSearchParams(searchParams),
    ]);

    if (pageDataResponse?.error || productsDataResponse?.error) {
      throw new Error(pageDataResponse?.error || productsDataResponse?.error);
    } else if (pageDataResponse?.data && productsDataResponse?.data) {
      shopImage = pageDataResponse.data.shopImage;
      categories = pageDataResponse.data.categories;
      sortingOptions = pageDataResponse.data.sortingOptions;
      productsData = productsDataResponse.data;
    }
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }

  return (
    <AnimateWrapper>
      <main className="w-full h-full px-0 md:px-20 xl:px-36 2xl:px-56">
        <div className="h-full max-w-[1920px] mx-auto">
          <div className="w-full h-fit md:h-[400px] relative flex flex-col justify-center items-center bg-black -z-10">
            <Image
              src={`${process.env.STRAPI_BASE_URL}${shopImage}`}
              width={2000}
              height={400}
              alt="Shop"
              className="w-full h-full object-cover absolute left-0 top-0 -z-10 opacity-75"
            />
            <div className="h-fit w-fit py-10 md:py-0">
              <h1 className="px-2 text-center text-white text-4xl md:text-6xl font-medium mb-6">
                Our Gummy Specifics
              </h1>
              <p className="px-2 text-center text-white text-xl md:text-2xl">
                Pick the jelliest one for you
              </p>
            </div>
          </div>
          <section className="w-full h-full flex flex-col sm:flex-row items-start gap-4 md:gap-14 pt-8 md:pt-16 pb-8 md:pb-24">
            <div className="w-full sm:w-fit px-5 md:px-0 sm:sticky top-[calc(76px+3rem)]">
              <FiltersBar
                categories={categories}
                sortingOptions={sortingOptions}
                productsMeta={productsData.productsMeta}
              />
            </div>
            <div className="w-full bg-none flex flex-col gap-5 mt-8 md:mt-0 md:min-h-[calc(100vh-(76px+9rem))]">
              <div className="flex justify-between items-center mb-5 md:mb-10 px-5">
                <h2 className="text-black font-semibold text-xl self-start">
                  {searchParams?.category
                    ? searchParams.category[0].toUpperCase() +
                      searchParams.category.slice(1) +
                      " gummies"
                    : "All gummies"}
                </h2>
                <div id="view_container" className="w-fit ml-auto"></div>
              </div>
              <Suspense fallback={<Loader />}>
                <ProductsList
                  products={productsData.products}
                  view={
                    (searchParams?.view as "image" | "detailed") || "detailed"
                  }
                />
              </Suspense>
              <div
                id="pagination_container"
                className="w-full pt-4 md:mt-24 flex items-center"
              ></div>
            </div>
          </section>
        </div>
      </main>
    </AnimateWrapper>
  );
}
