import React from "react";
import OrderStage from "./components/CheckoutStage";
import OrderCart from "../components/cart/OrderCart";
import { fetchDeliveryMethods, fetchPaymentMethods } from "@/utils/strapi/get";
import { redirect } from "next/navigation";
import CartSummary from "../components/cart/CartSummary";
import OrderDetailsForm from "./components/order/OrderDetailsForm";
import OrderSummary from "./components/order/OrderSummary";
import OrderCompleteCard from "./components/order/OrderCompleteCard";
import AnimateWrapper from "../components/layout/root/AnimateWrapper";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let deliveryMethods: DeliveryMethod[] | null = null;
  let paymentMethods: PaymentMethod[] | null = null;
  let title: string;

  try {
    switch (searchParams?.stage) {
      case "cart": {
        const deliveryMethodsResponse = await fetchDeliveryMethods();
        if (deliveryMethodsResponse?.data) {
          deliveryMethods = deliveryMethodsResponse.data;
        } else throw new Error(deliveryMethodsResponse?.error);
        title = "Cart";
        break;
      }

      case "details": {
        const deliveryMethodsResponse = await fetchDeliveryMethods();
        if (deliveryMethodsResponse?.data) {
          deliveryMethods = deliveryMethodsResponse.data;
        } else throw new Error(deliveryMethodsResponse?.error);

        const paymentMethodsResponse = await fetchPaymentMethods();
        if (paymentMethodsResponse?.data) {
          paymentMethods = paymentMethodsResponse.data;
        } else throw new Error(paymentMethodsResponse?.error);
        title = "Order details";
        break;
      }

      case "complete": {
        title = "Complete!";
        break;
      }

      default:
        redirect("/checkout?stage=cart");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }

  return (
    <AnimateWrapper>
      <main className="w-full h-full px-5 md:px-20 xl:px-36 2xl:px-56">
        <div className="h-full max-w-[1920px] mx-auto py-10 md:py-20">
          <h1 className="mb-12 md:mb-16 text-black font-medium text-3xl md:text-5xl text-center">
            {title}
          </h1>
          <div className="w-full mb-12 md:mb-16 xl:mb-32 flex items-center justify-between md:justify-center md:gap-16">
            <OrderStage
              text={"Shopping cart"}
              stage={"cart"}
              activeStage={searchParams?.stage}
              num={1}
              completed={
                searchParams?.stage === "details" ||
                searchParams?.stage === "complete"
              }
              className={`${
                searchParams?.stage === "details" ||
                searchParams?.stage === "complete"
                  ? "hidden md:flex"
                  : ""
              }`}
            />
            <OrderStage
              text={"Checkout details"}
              stage={"details"}
              activeStage={searchParams?.stage}
              num={2}
              completed={searchParams?.stage === "complete"}
              className={`${
                searchParams?.stage === "cart" ||
                searchParams?.stage === "complete"
                  ? "hidden md:flex"
                  : ""
              }`}
            />

            <OrderStage
              text={"Order complete"}
              stage={"complete"}
              activeStage={searchParams?.stage}
              num={3}
              completed={false}
              className={`${
                searchParams?.stage === "cart" ||
                searchParams?.stage === "details"
                  ? "hidden md:flex"
                  : ""
              }`}
            />
            <div
              className={`flex items-center justify-center rounded-full w-10 h-10 mb-4 md:mb-6 text-white
              bg-[#B1B5C3] ${
                searchParams?.stage === "complete" ? "hidden" : "md:hidden"
              }`}
            >
              {searchParams?.stage === "cart"
                ? 2
                : searchParams?.stage === "details"
                ? 3
                : ""}
            </div>
          </div>

          {searchParams.stage !== "complete" ? (
            <div className="w-full flex flex-col xl:flex-row mb-5 md:mb-20 gap-8 md:gap-20">
              <div className="flex-[2]">
                {searchParams.stage === "cart" ? (
                  <OrderCart />
                ) : searchParams.stage === "details" ? (
                  <OrderDetailsForm paymentOptions={paymentMethods} />
                ) : null}
              </div>
              <div className="flex-1">
                {searchParams.stage === "cart" && deliveryMethods ? (
                  <CartSummary deliveryMethods={deliveryMethods} />
                ) : searchParams.stage === "details" && deliveryMethods ? (
                  <OrderSummary deliveryMethods={deliveryMethods} />
                ) : null}
              </div>
              {searchParams?.stage === "details" ? (
                <div id="mobile_submit_container" className=""></div>
              ) : null}
            </div>
          ) : searchParams.stage === "complete" ? (
            <div className="flex items-center justify-center">
              <OrderCompleteCard />
            </div>
          ) : null}
        </div>
      </main>
    </AnimateWrapper>
  );
}
