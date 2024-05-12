import AddToCartButton from "@/app/components/cart/AddToCartButton";
import { fetchSingleProduct } from "@/utils/strapi/get";
import Slider from "./components/Slider";
import SlideMinis from "./components/SlideMinis";
import AnimateWrapper from "@/app/components/layout/root/AnimateWrapper";

export default async function SingleProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  let product: Product;

  const response = await fetchSingleProduct(id);

  if (response?.data) {
    product = response.data;
  } else throw new Error(response?.error);

  return (
    <AnimateWrapper>
      <main className="min-h-[calc(100vh-76px)] h-fit max-w-[1920px] flex flex-col md:flex-row justify-center md:py-10 gap-16 relative">
        <div className="w-full h-[450px] md:h-[calc(100vh-150px)] max-h-[1000px] md:w-[30%] 4xl:w-[40%] mb-auto flex flex-col gap-6">
          <Slider
            className="w-full md:h-full"
            images={product.attributes.pictures.data.map(
              (item) => item.attributes.url
            )}
          />
        </div>
        <div className="w-full min-h-fit max-h-[1000px] px-5 md:px-0 md:w-[25%] 4xl:w-[40%] flex flex-col gap-4">
          <h1 className="font-medium text-3xl md:text-4xl text-black-nav ">
            {product.attributes.name}
          </h1>
          <p className="text-gray-deep text-sm md:text-base">
            {product.attributes?.description || "No description available"}
          </p>
          <p className="font-medium text-3xl text-black-header">
            ${product.attributes.price}
          </p>
          <hr className="my-2 border-gray-border" />
          <AddToCartButton
            product={product}
            withCounter={true}
            className="justify-center"
          />
          <hr className="my-2 border-gray-border" />
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-deep">SKU</p>
              <p className="text-xs text-gray-deep">CATEGORY</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-black-nav">{product.id}</p>
              <p className="text-xs text-black-nav">
                {product.attributes.category}
              </p>
            </div>
          </div>
          <SlideMinis
            images={product.attributes.pictures.data.map(
              (item) => item.attributes.url
            )}
          />
        </div>
      </main>
    </AnimateWrapper>
  );
}
