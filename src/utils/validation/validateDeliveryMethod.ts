import { fetchDeliveryMethods } from "../strapi/get";

export const validateDeliveryMethod = async (deliveryMethod: string) => {
  try {
    const response = await fetchDeliveryMethods();

    if (response?.data) {
      const availableDeliveryMethods = response.data;
      if (
        !availableDeliveryMethods.find(
          (method) => method.name === deliveryMethod
        )
      )
        throw new Error("Invalid delivery method");
    } else throw new Error(response?.error);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};
