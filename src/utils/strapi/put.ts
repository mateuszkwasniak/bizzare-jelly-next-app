const baseStrapiPut = async (
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: content ? JSON.stringify(content) : null,
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

//Shipping

export const updateShippingAddress = async (
  id: number,
  shippingAddress: IShippingAddress,
  jwt: string
): Promise<{ data?: { message: string }; error?: string }> => {
  const response = await baseStrapiPut(
    `shippings/me/${id}`,
    {
      data: {
        ...shippingAddress,
      },
    },
    "",
    { Authorization: `Bearer ${jwt}` }
  );

  return response;
};

export const detachShippingAddress = async (
  id: number,
  jwt: string
): Promise<{ data?: { message: string }; error?: string }> => {
  const response = await baseStrapiPut(`shippings/detach/${id}`, null, "", {
    Authorization: `Bearer ${jwt}`,
  });

  return response;
};
