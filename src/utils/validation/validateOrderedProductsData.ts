import { isNumber } from "class-validator";

export const validateOrderedProductsData = (
  productsData: { id: number; count: number }[]
) => {
  productsData.forEach((product) => {
    if (!isNumber(product.id) || !isNumber(product.count)) {
      throw new Error("Invalid products data");
    }
  });
};
