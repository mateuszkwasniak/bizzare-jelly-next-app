const baseStrapiPost = async (
  endpoint: string,
  content: any,
  params?: string,
  headers?: { [key: string]: string }
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}${
        params ? params : ""
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(content),
      }
    );

    if (response?.ok) {
      const data = await response.json();
      return { data, error: "" };
    } else {
      const { error } = await response.json();
      if (error?.status === 401) {
        return { data: undefined, error: "401" };
      }
      return { data: undefined, error: error?.message };
    }
  } catch (error: any) {
  
    return { data: undefined, error: "Unable to send data." };
  }
};

export const strapiSignIn = async (
  creds: ICredential
): Promise<{
  data?: { jwt: string; user: { username: string } };
  error?: string;
}> => {
  const response = await baseStrapiPost("auth/local", {
    ...creds,
  });
  return response;
};

export const strapiSignUp = async (
  signUpCreds: ISignUpCredential
): Promise<{
  data?: {
    jwt: string;
    user: {
      username: string;
    };
  };
  error?: string;
}> => {
  const response = await baseStrapiPost("auth/local/register", {
    username: signUpCreds.username,
    firstName: signUpCreds.firstName,
    lastName: signUpCreds.lastName,
    email: signUpCreds.email,
    password: signUpCreds.password,
  });

  return response;

  // if (response?.error) {
  //   return response;
  // } else {
  //   return {
  //     data: response?.data,
  //     error: "",
  //   };
  // }
};

//Shipping

export const createShippingAddress = async (
  shippingAddress: IShippingAddress,
  jwt: string
): Promise<{ data?: { id: number }; error?: string }> => {
  const response = await baseStrapiPost(
    "shippings/me",
    {
      data: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        local: shippingAddress.local,
        postal: shippingAddress.postal,
        city: shippingAddress.city,
        main: shippingAddress.main,
      },
    },
    "",
    { Authorization: `Bearer ${jwt}` }
  );

  return response;
};

export const createShippingAddressWithNext = async (
  shippingAddress: IShippingAddress,
  jwt: string
): Promise<{ data?: { id: number }; error?: string }> => {
  const response = await baseStrapiPost(
    "shippings",
    {
      data: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        local: shippingAddress.local,
        postal: shippingAddress.postal,
        city: shippingAddress.city,
        main: shippingAddress.main,
      },
    },
    "",
    { Authorization: `Bearer ${jwt}` }
  );

  if (response?.error) {
    return response;
  } else {
    return {
      data: { id: response?.data?.data?.id },
      error: "",
    };
  }
};

//Order

export const createOrder = async (
  shippingAddressId: number,
  orderedProductsData: {
    count: number;
    id: number;
  }[],
  email: string,
  deliveryMethod: string,
  paymentMethod: string,
  token: string,
  orderedBy?: string
): Promise<{ data?: Order; error?: string }> => {
  //validation of parameters??
  const response = await baseStrapiPost(
    "orders",
    {
      data: {
        shipping: {
          id: shippingAddressId,
        },
        ordered: orderedProductsData.map((ordered) => ({
          count: ordered.count,
          product: {
            id: ordered.id,
          },
        })),
        delivery: deliveryMethod,
        email: email,
        payment: paymentMethod,
        orderedBy,
      },
    },
    "",
    { Authorization: `Bearer ${token}` }
  );

  throw new Error("blbllbblelbleb!");

  return response;
};
