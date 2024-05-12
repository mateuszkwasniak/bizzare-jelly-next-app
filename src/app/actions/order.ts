"use server";

import { ShippingAddress } from "@/models/ShippingAddress";
import { verify } from "@/utils/jwt";
import {
  createOrder,
  createShippingAddressWithNext,
} from "@/utils/strapi/post";
import { validateDeliveryMethod } from "@/utils/validation/validateDeliveryMethod";
import { validateOrderedProductsData } from "@/utils/validation/validateOrderedProductsData";
import { validatePaymentMethod } from "@/utils/validation/validatePaymentMethod";
import { validateOrReject } from "class-validator";
import { JWTPayload } from "jose";
import { cookies } from "next/headers";

export async function createShippingAddressAndOrder(
  shippingAddressData: IShippingAddress,
  orderedProductsData: { count: number; id: number }[],
  email: string,
  deliveryMethod: string,
  paymentMethod: string
): Promise<{
  data?: Order;
  error?: string;
}> {
  try {
    const userJWT = cookies().get(
      process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string
    )?.value;

    let payload: JWTPayload | null = null;

    if (userJWT) {
      payload = await verify(userJWT, process.env.JWT_SECRET as string);
    }

    const shippingAddress = new ShippingAddress(
      shippingAddressData.street,
      shippingAddressData.local,
      shippingAddressData.city,
      shippingAddressData.postal,
      shippingAddressData.firstName,
      shippingAddressData.lastName,
      shippingAddressData.phone,
      false
    );

    await validateOrReject(shippingAddress);

    const shippingResponse = await createShippingAddressWithNext(
      shippingAddressData,
      process.env.NEXT_STRAPI_API_TOKEN as string
    );

    validateOrderedProductsData(orderedProductsData);

    await validateDeliveryMethod(deliveryMethod);

    await validatePaymentMethod(paymentMethod);

    const responseOrder = await createOrder(
      shippingResponse?.data?.id as number,
      orderedProductsData,
      email,
      deliveryMethod,
      paymentMethod,
      process.env.NEXT_STRAPI_API_TOKEN as string,
      payload?.id as string | undefined
    );

    return responseOrder;
  } catch (error: any) {
    if (error?.code === "ERR_JWT_EXPIRED") {
      return {
        error: "401",
      };
    } else
      return {
        data: undefined,
        error: error?.message || "Something went wrong",
      };
  }
}
