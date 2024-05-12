const baseStrapiDelete = async (
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
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
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
    return { data: undefined, error: "Unable to delete data." };
  }
};

//Shipping

export const deleteShippingAddress = async (
  id: number,
  jwt: string
): Promise<{ data?: { message: string }; error?: string }> => {
  const response = await baseStrapiDelete(`shippings/me/${id}`, "", {
    Authorization: `Bearer ${jwt}`,
  });

  return response;
};
