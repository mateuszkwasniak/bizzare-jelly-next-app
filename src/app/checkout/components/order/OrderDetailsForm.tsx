"use client";

import DefaultButton from "@/app/components/customizable/DefaultButton";
import DefaultFormItem from "@/app/components/customizable/DefaultFormItem";
import RadioPanel from "@/app/components/customizable/RadioPanel";
import { useAuthState } from "@/hooks/store/auth";
import { useCartState } from "@/hooks/store/cart";
import {
  fetchPaymentMethods,
  fetchUserData,
  fetchUsersAddresses,
} from "@/utils/strapi/get";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import SelectShippingAddress from "./SelectShippingAddress";
import { ShippingAddress } from "@/models/ShippingAddress";
import { isEmail, validateOrReject } from "class-validator";
import { CardPayment } from "@/models/CardPayment";
import { createOrder } from "@/utils/strapi/post";
import { useOrderState } from "@/hooks/store/order";
import { createShippingAddressAndOrder } from "@/app/actions/order";
import { createPortal } from "react-dom";
import { useMediaQuery } from "react-responsive";
import { masks } from "@/utils/validation/input-masks/masks";

interface ValidatorError {
  property: string;
  constraints: {
    isLength?: string;
    isBoolean?: string;
    isEmail?: string;
    matches?: string;
  };
}

const fetchDeliveryMethodAndProductsCountFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  if (cart) {
    const cartData: {
      totalCount: number;
      deliveryMethod: string;
    } = JSON.parse(cart);
    return {
      totalCount: cartData.totalCount,
      deliveryMethod: cartData.deliveryMethod,
    };
  } else
    return {
      totalCount: 0,
      deliveryMethod: "",
    };
};

type OrderDetailsFormValue = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  local: string;
  postal: string;
  city: string;
  paymentMethod: string;
  cardNumber: string;
  cardExpDate: string;
  CVC: string;
};

const initialOrderDetailsFormValueNotLogged = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  street: "",
  local: "",
  postal: "",
  city: "",
  paymentMethod: "card",
  cardNumber: "",
  cardExpDate: "",
  CVC: "",
};

const orderDetailsFormFieldsArray = Object.keys(
  initialOrderDetailsFormValueNotLogged
);

type FormValidity = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  local: string;
  postal: string;
  city: string;
  paymentMethod: string;
  cardNumber: string;
  cardExpDate: string;
  CVC: string;
};

const initialInvalidFormFields: FormValidity = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  street: "",
  local: "",
  postal: "",
  city: "",
  paymentMethod: "",
  cardNumber: "",
  cardExpDate: "",
  CVC: "",
};

const customShippingAddress: IShippingAddress = {
  id: -1,
  street: "",
  local: "",
  city: "",
  postal: "",
  firstName: "",
  lastName: "",
  phone: "",
  main: false,
};

export default function OrderDetailsForm({
  paymentOptions,
}: {
  paymentOptions: PaymentMethod[] | null;
}) {
  const [formValue, setFormValue] = useState<OrderDetailsFormValue>(
    initialOrderDetailsFormValueNotLogged
  );
  const [invalidFormFields, setInvalidFormFields] = useState<FormValidity>(
    initialInvalidFormFields
  );
  const [firstInvalidToScroll, setFirstInvalidToScroll] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[] | null | undefined
  >(paymentOptions);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(paymentOptions?.[0] || null);
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<IShippingAddress | null>(null);
  const [userShippingAddresses, setUserShippingAddresses] = useState<
    IShippingAddress[] | null
  >(null);
  const [serverError, setServerError] = useState<string>("");
  const [clearInputs, setClearInputs] = useState<boolean>(false);
  const [mobileSubmitContainer, setMobileSubmitContainer] =
    useState<HTMLElement | null>(null);

  const jwt = useAuthState((state) => state.auth.jwt);
  const products = useCartState((state) => state.products);
  const deliveryMethod = useCartState((state) => state.deliveryMethod);
  const updateOrder = useOrderState((state) => state.updateOrder);
  const processing = useOrderState((state) => state.processingOrder);
  const setProcessing = useOrderState((state) => state.setProcessingOrder);

  const router = useRouter();
  const isSmall = useMediaQuery({ query: "(max-width:1028px)" });

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setInvalidFormFields(initialInvalidFormFields);
    setFirstInvalidToScroll("");
    setProcessing(true);

    const email = formValue.email;

    let shippingAddress: ShippingAddress | null = null;
    let shippingAddressId: number | null = null;

    try {
      if (selectedShippingAddress && selectedShippingAddress?.id !== -1) {
        shippingAddressId = selectedShippingAddress.id as number;
      } else {
        shippingAddress = new ShippingAddress(
          formValue.street,
          formValue.local,
          formValue.city,
          formValue.postal,
          formValue.firstName,
          formValue.lastName,
          formValue.phone,
          false
        );

        try {
          await validateOrReject(shippingAddress);
        } catch (error: any) {
          if (!isEmail(email)) {
            throw [
              ...error,
              {
                property: "email",
                constraints: {
                  isEmail: "Please provide a valid email address",
                },
              },
            ];
          }
          throw error;
        }
      }

      if (!isEmail(email)) {
        throw [
          {
            property: "email",
            constraints: {
              isEmail: "Please provide a valid email address",
            },
          },
        ];
      }

      let cardPaymentMethod: CardPayment | null = null;
      let anotherPaymentMethod: string = "";

      switch (formValue.paymentMethod) {
        case "card": {
          cardPaymentMethod = new CardPayment(
            formValue.cardNumber,
            formValue.cardExpDate,
            formValue.CVC
          );

          await validateOrReject(cardPaymentMethod);

          break;
        }

        default:
          anotherPaymentMethod = formValue.paymentMethod;
      }

      let result: {
        data?: Order;
        error?: string;
      };

      const orderedProducts = products?.map((product) => ({
        id: product.id,
        count: product.count,
      }));

      if (!orderedProducts) throw new Error("Empty cart!!");

      if (jwt && shippingAddressId) {
        result = await createOrder(
          shippingAddressId,
          orderedProducts,
          email,
          deliveryMethod,
          anotherPaymentMethod ? anotherPaymentMethod : "card",
          jwt
        );
      } else {
        if (!shippingAddress) {
          throw new Error("No shipping address!");
        }

        result = await createShippingAddressAndOrder(
          {
            street: shippingAddress.street,
            local: shippingAddress.local,
            city: shippingAddress.city,
            postal: shippingAddress.postal,
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            phone: shippingAddress.phone,
            main: false,
          },
          orderedProducts,
          email,
          deliveryMethod,
          anotherPaymentMethod ? anotherPaymentMethod : "card"
        );
      }

      if (result?.error) {
        throw new Error(result?.error);
      }

      updateOrder(result.data as Order);

      router.push("/checkout?stage=complete");
    } catch (error: any) {
      if (Array.isArray(error)) {
        const errorProperties = error.map(
          (error: ValidatorError) => error.property
        );

        const firstInvalidField = orderDetailsFormFieldsArray.find((field) => {
          return errorProperties.includes(field);
        });

        setFirstInvalidToScroll(firstInvalidField || "");

        error.forEach((error: ValidatorError, idx) => {
          setInvalidFormFields((prev) => ({
            ...prev,
            [error.property]:
              error.constraints?.isLength ||
              error.constraints?.isBoolean ||
              error?.constraints?.isEmail ||
              error.constraints?.matches,
          }));
        });
      } else {
        if (error?.message === "401") {
          router.replace(
            "/auth/login?from=/checkout?stage=details&signed-out=true"
          );
        } else
          setServerError(
            error?.message || "Something went wrong, please try again later"
          );
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const fetchDataOrRedirect = async () => {
      const localStorageCartData =
        fetchDeliveryMethodAndProductsCountFromLocalStorage();
      if (
        (products?.length === 0 || !deliveryMethod) &&
        (localStorageCartData.totalCount === 0 ||
          !localStorageCartData.deliveryMethod)
      ) {
        router.replace("/");
      } else if (jwt) {
        try {
          const [userShippingAddressesResponse, userDataResponse] =
            await Promise.all([fetchUsersAddresses(jwt), fetchUserData(jwt)]);

          if (userShippingAddressesResponse?.error) {
            throw new Error(userShippingAddressesResponse?.error);
          }

          if (userDataResponse?.error) {
            throw new Error(userShippingAddressesResponse?.error);
          }

          userShippingAddressesResponse?.data &&
            setUserShippingAddresses([
              ...userShippingAddressesResponse?.data,
              customShippingAddress,
            ]);

          if (
            userShippingAddressesResponse?.data &&
            userShippingAddressesResponse?.data?.length > 0
          ) {
            const mainAddress = userShippingAddressesResponse.data.find(
              (address) => address.main
            ) as IShippingAddress;

            setSelectedShippingAddress(mainAddress);
            setFormValue((prev) => ({
              ...prev,
              email: userDataResponse?.data?.email || "",
              paymentMethod: "card",
            }));
          } else
            setFormValue((prev) => ({
              ...prev,
              firstName: userDataResponse?.data?.firstName || "",
              lastName: userDataResponse?.data?.lastName || "",
              email: userDataResponse?.data?.email || "",
            }));
        } catch (error: any) {
          if (error?.message === "401") {
            router.replace(
              "/auth/login?from=/checkout?stage=details&signed-out=true"
            );
          } else {
            setServerError("Something went wrong");
          }
        }
      } else {
        const paymentMethodsResponse = await fetchPaymentMethods();

        if (paymentMethodsResponse?.error) {
          throw new Error(paymentMethodsResponse?.error);
        }

        setPaymentMethods(paymentMethodsResponse?.data);
      }
    };

    fetchDataOrRedirect();
  }, [router, deliveryMethod, products, jwt]);

  useEffect(() => {
    if (selectedPaymentMethod) {
      setFormValue((prev) => ({
        ...prev,
        paymentMethod: selectedPaymentMethod.name,
      }));
    }
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (selectedShippingAddress) {
      if (selectedShippingAddress?.id === -1 && !clearInputs) {
        return;
      }
      setFormValue((prev) => ({
        ...prev,
        firstName: selectedShippingAddress.firstName,
        lastName: selectedShippingAddress.lastName,
        phone: selectedShippingAddress.phone,
        street: selectedShippingAddress.street,
        local: selectedShippingAddress.local,
        postal: selectedShippingAddress.postal,
        city: selectedShippingAddress.city,
      }));

      if (clearInputs) {
        setClearInputs(false);
      }
    }
  }, [selectedShippingAddress, clearInputs]);

  useEffect(() => {
    setMobileSubmitContainer(
      document?.getElementById("mobile_submit_container")
    );
  }, []);

  useEffect(() => {
    if (firstInvalidToScroll) {
      const element = document.querySelector(
        `input[name=${firstInvalidToScroll}]`
      );

      if (element) {
        element?.scrollIntoView(true);
      }
    }
  }, [firstInvalidToScroll]);

  return (
    <motion.form
      className={`w-full relative flex flex-col gap-6`}
      name="order_form"
      onSubmit={onFormSubmit}
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {processing ? (
        <>
          <div className="absolute left-0 top-0 bottom-0 right-0 opacity-50 bg-white z-10" />
        </>
      ) : null}
      {userShippingAddresses &&
      userShippingAddresses?.length > 0 &&
      selectedShippingAddress ? (
        <SelectShippingAddress
          shippingAddresses={userShippingAddresses}
          selectedShippingAddress={selectedShippingAddress as any}
          setSelectedShippingAddress={setSelectedShippingAddress}
          setClearInputs={setClearInputs}
          clearInvalidFormFields={() =>
            setInvalidFormFields(initialInvalidFormFields)
          }
        />
      ) : null}
      <div className="w-full px-6 py-5 md:py-10 border border-gray-deep rounded flex flex-col gap-3 md:gap-6 shadow-custom">
        <h3 className="font-medium text-sm mb-4 md:mb-0 md:text-xl text-black">
          Contact Information
        </h3>
        <div className="flex items-center gap-3 md:gap-6">
          <DefaultFormItem
            label={"FIRST NAME"}
            name={"firstName"}
            value={formValue.firstName}
            setValue={setFormValue}
            onChange={() => {
              if (
                selectedShippingAddress &&
                selectedShippingAddress.id !== -1
              ) {
                setSelectedShippingAddress(customShippingAddress);
              }
            }}
            className="flex-1"
            disabledInput={false}
            placeholder="First name"
            error={invalidFormFields.firstName}
            setInvalidFormFields={setInvalidFormFields}
          />
          <DefaultFormItem
            label={"LAST NAME"}
            name={"lastName"}
            value={formValue.lastName}
            setValue={setFormValue}
            onChange={() => {
              if (
                selectedShippingAddress &&
                selectedShippingAddress?.id !== -1
              ) {
                setSelectedShippingAddress(customShippingAddress);
              }
            }}
            className="flex-1"
            disabledInput={false}
            placeholder="Last name"
            error={invalidFormFields.lastName}
            setInvalidFormFields={setInvalidFormFields}
          />
        </div>
        <DefaultFormItem
          label={"PHONE NUMBER"}
          name={"phone"}
          mask={masks.phone}
          value={formValue.phone}
          setValue={setFormValue}
          onChange={() => {
            if (selectedShippingAddress && selectedShippingAddress?.id !== -1) {
              setSelectedShippingAddress(customShippingAddress);
            }
          }}
          disabledInput={false}
          placeholder="Phone number"
          error={invalidFormFields.phone}
          setInvalidFormFields={setInvalidFormFields}
        />
        <DefaultFormItem
          label={"EMAIL ADDRESS"}
          name={"email"}
          value={formValue.email}
          setValue={setFormValue}
          disabledInput={false}
          placeholder="Your Email"
          error={invalidFormFields.email}
          setInvalidFormFields={setInvalidFormFields}
        />
      </div>
      <div className="w-full px-6 py-5 md:py-10 border border-gray-deep rounded flex flex-col gap-3 md:gap-6 shadow-custom">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm mb-4 md:mb-0 md:text-xl text-black">
            Shipping Address
          </h3>
        </div>
        <DefaultFormItem
          label={"STREET"}
          name={"street"}
          value={formValue.street}
          setValue={setFormValue}
          onChange={() => {
            if (selectedShippingAddress && selectedShippingAddress?.id !== -1) {
              setSelectedShippingAddress(customShippingAddress);
            }
          }}
          disabledInput={false}
          placeholder="Street"
          error={invalidFormFields.street}
          setInvalidFormFields={setInvalidFormFields}
        />
        <DefaultFormItem
          label={"LOCAL"}
          name={"local"}
          value={formValue.local}
          setValue={setFormValue}
          disabledInput={false}
          placeholder="Local"
          error={invalidFormFields.local}
          setInvalidFormFields={setInvalidFormFields}
        />
        <div className="flex items-center gap-3 md:gap-6">
          <DefaultFormItem
            label={"CITY"}
            name={"city"}
            value={formValue.city}
            setValue={setFormValue}
            className="flex-1"
            disabledInput={false}
            placeholder="City"
            error={invalidFormFields.city}
            setInvalidFormFields={setInvalidFormFields}
          />
          <DefaultFormItem
            label={"POSTAL CODE"}
            name={"postal"}
            mask={masks.postal}
            value={formValue.postal}
            setValue={setFormValue}
            onChange={() => {
              if (
                selectedShippingAddress &&
                selectedShippingAddress?.id !== -1
              ) {
                setSelectedShippingAddress(customShippingAddress);
              }
            }}
            className="flex-1"
            disabledInput={false}
            placeholder="Postal Code"
            error={invalidFormFields.postal}
            setInvalidFormFields={setInvalidFormFields}
          />
        </div>
      </div>
      <motion.div className={"md:h-[500px] relative"}>
        <motion.div className="w-full h-fit px-6 py-5 md:py-10 border border-gray-deep rounded flex flex-col gap-3 md:gap-6 shadow-custom">
          <h3 className="font-medium text-sm mb-4 md:mb-0 md:text-xl text-black">
            Payment method
          </h3>
          {paymentMethods?.map((method) => (
            <RadioPanel
              key={method.id}
              value={method}
              selectedValue={selectedPaymentMethod}
              setSelectedValue={setSelectedPaymentMethod}
            />
          ))}
          {selectedPaymentMethod?.name === "card" && (
            <motion.div
              className="w-full h-fit pt-6 mt-2 flex flex-col gap-3 md:gap-6 border-t border-gray-deep"
              layout
              animate={{ opacity: [0, 1] }}
              exit={{ opacity: [1, 0] }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <DefaultFormItem
                label={"CARD NUMBER"}
                name={"cardNumber"}
                mask={masks.cardNumber}
                value={formValue.cardNumber}
                setValue={setFormValue}
                className="flex-1"
                disabledInput={false}
                placeholder="1234 1234 1234 1234"
                error={invalidFormFields.cardNumber}
                setInvalidFormFields={setInvalidFormFields}
              />
              <div className="flex items-center gap-3 md:gap-6">
                <DefaultFormItem
                  label={"EXPIRATION DATE"}
                  name={"cardExpDate"}
                  mask={masks.cardExpDate}
                  value={formValue.cardExpDate}
                  setValue={setFormValue}
                  className="flex-1"
                  disabledInput={false}
                  placeholder="MM/YY"
                  error={invalidFormFields.cardExpDate}
                  setInvalidFormFields={setInvalidFormFields}
                />
                <DefaultFormItem
                  label={"CVC"}
                  name={"CVC"}
                  value={formValue.CVC}
                  setValue={setFormValue}
                  className="flex-1"
                  disabledInput={false}
                  placeholder="CVC code"
                  error={invalidFormFields.CVC}
                  setInvalidFormFields={setInvalidFormFields}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
        {isSmall && mobileSubmitContainer ? (
          createPortal(
            <div className="flex flex-col">
              <DefaultButton
                type="button"
                onClick={(e) => onFormSubmit(e as any)}
                text="Order"
                loading={processing}
                className="w-full ml-auto !text-xl"
              />
              <p
                className={`flex-1 mt-5 ${
                  serverError ? "opacity-100" : "opacity-0"
                } text-red-500 text-xs text-center`}
              >
                {serverError}
              </p>
            </div>,
            mobileSubmitContainer
          )
        ) : (
          <div
            className={`w-full flex flex-col mt-10 items-center justify-center gap-5 absolute ${
              selectedPaymentMethod?.name === "card" ? "" : ""
            }`}
          >
            <DefaultButton
              type="submit"
              text="Order"
              loading={processing}
              className="w-1/3 ml-auto text-xl"
            />
            <p
              className={`flex-1 ${
                serverError ? "opacity-100" : "opacity-0"
              } text-red-500 text-sm text-center`}
            >
              {serverError}
            </p>
          </div>
        )}
      </motion.div>
    </motion.form>
  );
}
