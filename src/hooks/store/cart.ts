import { create } from "zustand";

const MAX_SINGLE_CART_ITEM_COUNT =
  Number(process.env.MAX_SINGLE_CART_ITEM_COUNT) || 50;

interface CartState {
  products: CartProduct[];
  totalCount: number;
  totalSum: number;
  deliveryMethod: string;
  setDeliveryMethod: (deliveryMethod: string) => void;
  addToCart: (productToAdd: CartProduct) => void;
  removeFromCart: (id: number) => void;
  decreaseProductCount: (id: number) => void;
  increaseProductCount: (id: number, count?: number) => void;
  clearCart: () => void;
  saveCartInLocalStorage: () => void;
  loadCartFromLocalStorage: () => void;
}

const sortProducts = (products: CartProduct[]) => {
  return products.sort((a, b) => (a.id > b.id ? 1 : -1));
};

export const calculateFixedSum = (totalSum: number) => {
  const pow = Math.pow(10, 2);
  return Math.round(totalSum * pow) / pow;
};

export const useCartState = create<CartState>((set, get) => ({
  products: [],
  totalCount: 0,
  totalSum: 0,
  deliveryMethod: "",
  addToCart: (productToAdd) => {
    const existingProduct = get().products.find(
      (product) => product.id === productToAdd.id
    );

    if (existingProduct) {
      get().increaseProductCount(productToAdd.id, productToAdd.count);
    } else
      set((state) => ({
        products: sortProducts([
          ...state.products,
          {
            ...productToAdd,
            count:
              productToAdd.count <= MAX_SINGLE_CART_ITEM_COUNT
                ? productToAdd.count
                : 1,
          },
        ]),
        totalCount:
          state.totalCount +
          (productToAdd.count <= MAX_SINGLE_CART_ITEM_COUNT
            ? productToAdd.count
            : 1),
        totalSum: calculateFixedSum(
          state.totalSum +
            productToAdd.price *
              (productToAdd.count <= MAX_SINGLE_CART_ITEM_COUNT
                ? productToAdd.count
                : 1)
        ),
      }));

    get().saveCartInLocalStorage();
  },

  removeFromCart: (id: number) => {
    set((state) => {
      const productToBeRemoved = state.products.find(
        (product) => product.id === id
      );

      if (!productToBeRemoved) return state;

      const currProductCount = productToBeRemoved.count;

      return {
        products: sortProducts([
          ...state.products.filter((product) => product.id !== id),
        ]),
        totalCount: state.totalCount - currProductCount,
        totalSum: calculateFixedSum(
          state.totalSum - currProductCount * productToBeRemoved.price
        ),
      };
    }),
      get().saveCartInLocalStorage();
  },

  decreaseProductCount: (id: number) => {
    set((state) => {
      const existingProduct = state.products.find(
        (product) => product.id === id
      );

      if (!existingProduct) return state;

      const updatedProduct = {
        ...existingProduct,
        count: existingProduct.count - 1,
      };

      let filteredProducts = state.products.filter(
        (product) => product.id !== id
      );

      if (updatedProduct.count !== 0) {
        filteredProducts.push(updatedProduct);
      }

      return {
        products: sortProducts(filteredProducts),
        totalCount: state.totalCount - 1,
        totalSum: calculateFixedSum(state.totalSum - updatedProduct.price),
      };
    });

    get().saveCartInLocalStorage();
  },

  increaseProductCount: (id: number, count?: number) => {
    set((state) => {
      const existingProduct = state.products.find(
        (product) => product.id === id
      );

      if (
        !existingProduct ||
        existingProduct?.count === MAX_SINGLE_CART_ITEM_COUNT
      )
        return state;

      const updatedProduct = {
        ...existingProduct,
        count: existingProduct.count + (count ? count : 1),
      };

      let toBeAddedToTotalCount: number = count || 1;

      if (updatedProduct.count > MAX_SINGLE_CART_ITEM_COUNT) {
        updatedProduct.count = MAX_SINGLE_CART_ITEM_COUNT;
        toBeAddedToTotalCount =
          MAX_SINGLE_CART_ITEM_COUNT - existingProduct.count;
      }

      let filteredProducts = state.products.filter(
        (product) => product.id !== id
      );

      filteredProducts.push(updatedProduct);

      return {
        products: sortProducts(filteredProducts),
        totalCount: state.totalCount + (count ? toBeAddedToTotalCount : 1),
        totalSum: calculateFixedSum(
          state.totalSum +
            updatedProduct.price * (count ? toBeAddedToTotalCount : 1)
        ),
      };
    });

    get().saveCartInLocalStorage();
  },

  clearCart: () => {
    set(() => {
      return {
        products: [],
        totalCount: 0,
        totalSum: 0,
        deliveryMethod: "",
      };
    });
    get().saveCartInLocalStorage();
  },

  saveCartInLocalStorage: () => {
    const cart = {
      products: get().products,
      totalCount: get().totalCount,
      totalSum: get().totalSum,
      deliveryMethod: get().deliveryMethod,
    };

    localStorage.setItem("cart", JSON.stringify(cart));
  },

  loadCartFromLocalStorage: () => {
    set((state) => {
      let cart = localStorage.getItem("cart");
      if (cart) {
        const data: {
          products: CartProduct[];
          totalCount: number;
          totalSum: number;
          deliveryMethod: string;
        } = JSON.parse(cart);
        return {
          products: data.products,
          totalCount: data.totalCount,
          totalSum: data.totalSum,
          deliveryMethod: data.deliveryMethod,
        };
      } else return state;
    });
  },

  setDeliveryMethod: (deliveryMethod: string) => {
    set(() => {
      return {
        deliveryMethod: deliveryMethod,
      };
    });

    get().saveCartInLocalStorage();
  },
}));
