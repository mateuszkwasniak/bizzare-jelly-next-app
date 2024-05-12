import { fetchPaymentMethods } from "../strapi/get";

export const validatePaymentMethod = async (paymentMethod: string) => {
  try {
    const response = await fetchPaymentMethods();

    if (response?.data) {
      const availablePaymentMethods = response.data;
      if (
        !availablePaymentMethods.find((method) => method.name === paymentMethod)
      )
        throw new Error("Invalid delivery method");
    }
    if (response?.error) {
      throw new Error(response?.error);
    }
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};
