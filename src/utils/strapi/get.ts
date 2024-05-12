import { isNumber } from "class-validator";

const PRODUCTS_PER_PAGE = Number(process.env.PRODUCTS_PER_PAGE) || 15;

const baseFetch = async (
  endpoint: string,
  params?: string,
  headers?: { [key: string]: string }
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}${
        params ? params : ""
      }`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    );

    if (response?.ok) {
      const data = await response.json();
      // return { data };
      return { data, error: "" };
    } else {
      const { error } = await response.json();
      if (error?.status === 401) {
        return { data: undefined, error: "401" };
        // } else throw new Error(error?.message);
      }
      return { data: undefined, error: error?.message };
    }
  } catch (error: any) {
    // if (error?.message === "401") {
    //   throw new Error("401");
    // } else throw new Error(error?.message || "Unable to fetch data");
    return { data: undefined, error: "Unable to fetch data." };
  }
};

export const fetchHomePageDetails = async (): Promise<{
  data?: {
    SEO: SEO;
    pageSectionsData: PageSectionData[];
  };
  error?: string;
}> => {
  const result = await baseFetch(
    "home-page",
    "?fields=id&populate[SEO]=*&populate[sections][on][page-sections.hero-section][fields][0]=header&populate[sections][on][page-sections.hero-section][fields][1]=description&populate[sections][on][page-sections.hero-section][fields][2]=CTA&populate[sections][on][page-sections.hero-section][populate][heroImage][fields]=url&populate[sections][on][page-sections.arrivals-section][fields][0]=header&populate[sections][on][page-sections.arrivals-section][populate][newProducts][fields][0]=name&populate[sections][on][page-sections.arrivals-section][populate][newProducts][fields][1]=price&populate[sections][on][page-sections.arrivals-section][populate][newProducts][populate][pictures][fields]=url"
  );

  if (result?.error) {
    return result;
  } else {
    return {
      data: {
        SEO: result?.data?.data?.attributes?.SEO,
        pageSectionsData: result?.data?.data?.attributes?.sections,
      },
      error: "",
    };
  }
  // return {
  //   SEO: result?.data?.data?.attributes?.SEO,
  //   pageSectionsData: result?.data?.data?.attributes?.sections,
  // };
};

export const fetchSignInPageDetails = async (): Promise<{
  data?: {
    SEO: SEO;
    signInImage: string;
  };
  error?: string;
}> => {
  const result = await baseFetch(
    "sign-in-page",
    "?populate[0]=SEO&populate[1]=signInImage"
  );

  if (result?.error) {
    return result;
  } else {
    return {
      data: {
        SEO: result?.data?.data?.attributes?.SEO,
        signInImage:
          result?.data?.data?.attributes?.signInImage?.data?.attributes?.url,
      },
      error: "",
    };
  }
};

export const fetchSignUpPageDetails = async (): Promise<{
  data?: {
    SEO: SEO;
    signUpImage: string;
  };
  error?: string;
}> => {
  const result = await baseFetch(
    "sign-up-page",
    "?populate[0]=SEO&populate[1]=signUpImage"
  );

  if (result?.error) {
    return result;
  }

  return {
    data: {
      SEO: result?.data?.data?.attributes?.SEO,
      signUpImage:
        result?.data?.data?.attributes?.signUpImage?.data?.attributes?.url,
    },
    error: "",
  };
};

export const fetchProductsPageDetails = async (): Promise<{
  data?: {
    SEO: SEO;
    shopImage: string;
    categories: ProductCategory[];
    sortingOptions: ProductSortOption[];
  };
  error?: string;
}> => {
  const result = await baseFetch(
    "product-page",
    "?populate[0]=SEO&populate[1]=shopImage&populate[2]=category&populate[3]=sortingOption"
  );

  if (result?.error) {
    return result;
  }

  return {
    data: {
      SEO: result?.data?.data?.attributes?.SEO,
      shopImage:
        result?.data?.data?.attributes?.shopImage?.data?.attributes?.url,
      categories: result?.data?.data?.attributes?.category,
      sortingOptions: result?.data?.data?.attributes?.sortingOption,
    },
    error: "",
  };
};

export const fetchFooterDetails = async (): Promise<{
  data?: {
    header: string;
    description: string;
    footerImage: string;
  };
  error?: string;
}> => {
  const result = await baseFetch(
    "layout",
    "?populate[0]=footer&populate[1]=footer.footerImage"
  );

  if (result?.error) {
    return result;
  } else
    return {
      data: {
        header: result?.data?.data?.attributes?.footer?.header,
        description: result?.data?.data?.attributes?.footer?.description,
        footerImage:
          result?.data?.data?.attributes?.footer?.footerImage?.data?.attributes
            ?.url,
      },
      error: "",
    };
};

export const signInWithGoogleAccessToken = async (
  accessToken: string
): Promise<{
  data?: {
    jwt: string;
    username: string;
  };
  error?: string;
}> => {
  const result = await baseFetch(
    "auth/google/callback",
    `?access_token=${accessToken}`
  );

  if (result?.error) {
    return result;
  }

  const {
    jwt,
    user: { username },
  } = result.data;

  return { data: { jwt, username }, error: "" };
};

//Products
export const fetchAllProducts = async (): Promise<{
  data?: Product[];
  error?: string;
}> => {
  const result = await baseFetch(
    "products",
    "?fields[0]=name&fields[1]=price&fields[2]=category&populate[pictures][fields][0]=url"
  );

  if (result?.error) {
    return result;
  }

  return {
    data: result?.data?.data,
    error: "",
  };
};

export const fetchSingleProduct = async (
  id: string
): Promise<{ data?: Product; error?: string }> => {
  if (Number.isInteger(+id)) {
    const result = await baseFetch(
      `products/${id}`,
      "?populate[pictures][fields]=url"
    );

    if (result?.error) {
      return result;
    }
    return {
      data: result?.data?.data,
      error: "",
    };
  } else {
    return {
      data: undefined,
      error: "Invalid param!",
    };
  }
};

export const fetchCategoryProductsDataInPriceRange = async (
  min: number,
  max: number,
  field: string,
  type: string,
  page: number,
  category?: string
): Promise<{
  data?: {
    products: Product[];
    productsMeta: Meta;
  };
  error?: string;
}> => {
  //add validation of params!

  const priceQuery = `filters[price][$gte]=${min}&filters[price][$lte]=${max}&`;
  const sortQuery = `sort[0]=${field}:${type}&`;
  const paginationQuery = `pagination[page]=${page}&pagination[pageSize]=${PRODUCTS_PER_PAGE}&`;

  let categoryQuery: string;

  if (category) {
    categoryQuery = `filters[category][$eq]=${category}&`;
  } else {
    categoryQuery = "";
  }

  const result = await baseFetch(
    "products",
    `?${priceQuery}${sortQuery}${paginationQuery}${categoryQuery}fields[0]=name&fields[1]=price&fields[2]=category&populate[pictures][fields][0]=url`
  );

  if (result?.error) {
    return result;
  }

  return {
    data: {
      products: result?.data?.data,
      productsMeta: result?.data?.meta,
    },
    error: "",
  };
};

export const fetchProductCategories = async (): Promise<{
  data?: ProductCategory[];
  error?: string;
}> => {
  const result = await baseFetch("product-category", "?fields=id&populate=*");
  if (result?.error) {
    return result;
  }
  return {
    data: result?.data?.attributes?.category,
    error: "",
  };
};

export const fetchProductsDataBasedOnSearchParams = async (searchParams: {
  [key: string]: string | undefined;
}): Promise<{
  data?: {
    products: Product[];
    productsMeta: Meta;
  } | null;
  error?: string;
}> => {
  if (
    !searchParams?.category ||
    !searchParams?.min ||
    !searchParams?.max ||
    !searchParams?.field ||
    !searchParams?.type ||
    !searchParams.page
  ) {
    return fetchCategoryProductsDataInPriceRange(
      0,
      Number(process.env.NEXT_PUBLIC_MAX_PRODUCT_PRICE) || 500,
      "name",
      "asc",
      1
    );
  } else if (searchParams.category === "all") {
    return fetchCategoryProductsDataInPriceRange(
      Number(searchParams.min),
      Number(searchParams.max),
      searchParams.field,
      searchParams.type,
      Number(searchParams.page)
    );
  } else {
    return fetchCategoryProductsDataInPriceRange(
      Number(searchParams.min),
      Number(searchParams.max),
      searchParams.field,
      searchParams.type,
      Number(searchParams.page),
      searchParams.category
    );
  }
};

//Shipping Addresses

export const fetchUsersAddresses = async (
  jwt: string | undefined
): Promise<{ data?: IShippingAddress[]; error?: string }> => {
  if (!jwt)
    // throw new Error("Unauthorized access!");
    return {
      data: undefined,
      error: "Unauthorized access!",
    };

  const result = await baseFetch("shipping/me", "", {
    Authorization: `Bearer ${jwt}`,
  });

  return result;
};

//User Data

export const fetchUserData = async (
  jwt: string | undefined
): Promise<{ data?: User; error?: string }> => {
  if (!jwt) throw new Error("Unauthorized access!");

  const result = await baseFetch("users/me", "", {
    Authorization: `Bearer ${jwt}`,
  });

  return result;
};

//Delivery Methods

export const fetchDeliveryMethods = async (): Promise<{
  data?: DeliveryMethod[];
  error?: string;
}> => {
  const result = await baseFetch("delivery", "?fields=id&populate=*");

  if (result?.error) {
    return result;
  }

  return {
    data: result?.data?.data?.attributes?.method,
    error: "",
  };
};

export const fetchPaymentMethods = async (): Promise<{
  data?: PaymentMethod[];
  error?: string;
}> => {
  const result = await baseFetch("payment-option", "?fields=id&populate=*");

  if (result?.error) {
    return result;
  }

  return {
    data: result?.data?.data?.attributes?.option,
    error: "",
  };
};

//Orders

export const fetchUserOrders = async (
  page: number,
  jwt: string | undefined
): Promise<{
  data?: {
    orders: Partial<Order>[];
    ordersMeta: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: string;
}> => {
  if (!jwt || !isNumber(page)) {
    return {
      data: undefined,
      error: "Unauthorized access!",
    };
  }

  const paginationQuery = `?pagination[page]=${page}&pagination[pageSize]=${process.env.ORDERS_PER_PAGE}&`;

  const result = await baseFetch("orders/me", paginationQuery, {
    Authorization: `Bearer ${jwt}`,
  });

  if (result?.error) {
    return result;
  }

  return {
    data: {
      orders: result?.data?.data,
      ordersMeta: result?.data?.meta,
    },
    error: "",
  };
};
