import DefaultButton from "@/app/components/customizable/DefaultButton";
import Loader from "@/app/components/loaders/Loader";
import { useAuthState } from "@/hooks/store/auth";
import { ShippingAddress } from "@/models/ShippingAddress";
import { createShippingAddress } from "@/utils/strapi/post";
import { validateOrReject } from "class-validator";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { FormEvent, SetStateAction, useEffect, useState } from "react";
import FormItem from "../../../components/customizable/DefaultFormItem";
import { updateShippingAddress } from "@/utils/strapi/put";
import { masks } from "@/utils/validation/input-masks/masks";

interface ValidatorError {
  property: string;
  constraints: {
    isLength?: string;
    isBoolean?: string;
    matches?: string;
  };
}

type ShippingAddressFormValue = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  local: string;
  postal: string;
  city: string;
  main: boolean;
};

const generateInitialShippingAddressFormValue = (addressesCount: number) => ({
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  local: "",
  postal: "",
  city: "",
  main: addressesCount === 0 ? true : false,
});

type FormValidity = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  local: string;
  postal: string;
  city: string;
};

const initialInvalidFormFields: FormValidity = {
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  local: "",
  postal: "",
  city: "",
};

const shippingDetailsFormFieldsArray = Object.keys(initialInvalidFormFields);

export default function AddOrEditAddressForm({
  setOpenForm,
  addressesCount,
  edit = false,
  addressDetails,
}: {
  setOpenForm: React.Dispatch<SetStateAction<boolean>>;
  addressesCount: number;
  edit?: boolean;
  addressDetails?: IShippingAddress;
}) {
  const [formValue, setFormValue] = useState<ShippingAddressFormValue>(
    addressDetails
      ? { ...addressDetails }
      : generateInitialShippingAddressFormValue(addressesCount)
  );
  const [firstInvalidToScroll, setFirstInvalidToScroll] = useState<string>("");
  const [invalidFormFields, setInvalidFormFields] = useState<FormValidity>(
    initialInvalidFormFields
  );
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const jwt = useAuthState((state) => state.auth.jwt);

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setInvalidFormFields(initialInvalidFormFields);
    setFirstInvalidToScroll("");
    setLoading(true);

    const shippingAddress = new ShippingAddress(
      formValue.street,
      formValue.local,
      formValue.city,
      formValue.postal,
      formValue.firstName,
      formValue.lastName,
      formValue.phone,
      formValue.main
    );

    try {
      await validateOrReject(shippingAddress);

      let response: {
        data?: any;
        error?: string;
      };

      if (edit && addressDetails?.id) {
        response = await updateShippingAddress(
          addressDetails.id,
          {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            phone: shippingAddress.phone,
            street: shippingAddress.street,
            local: shippingAddress.local,
            postal: shippingAddress.postal,
            city: shippingAddress.city,
            main: shippingAddress.main,
          },
          jwt
        );
      } else {
        response = await createShippingAddress(shippingAddress, jwt);
      }

      if (response?.error) throw new Error(response?.error);

      setInvalidFormFields(initialInvalidFormFields);
      setOpenForm(false);
      router.refresh();
    } catch (error: any) {
      if (Array.isArray(error)) {
        const errorProperties = error.map(
          (error: ValidatorError) => error.property
        );

        const firstInvalidField = shippingDetailsFormFieldsArray.find(
          (field) => {
            return errorProperties.includes(field);
          }
        );

        setFirstInvalidToScroll(firstInvalidField || "");

        error.forEach(
          (error: {
            property: string;
            constraints: {
              isLength?: string;
              isBoolean?: string;
              matches?: string;
            };
          }) => {
            setInvalidFormFields((prev) => ({
              ...prev,
              [error.property]:
                error.constraints?.isLength ||
                error.constraints?.isBoolean ||
                error.constraints?.matches,
            }));
          }
        );
      } else {
        if (error?.message === "401") {
          router.replace(
            "/auth/login?from=/dashboard/addresses&signed-out=true"
          );
        } else
          setServerError(
            error?.message || "Something went wrong, please try again later"
          );
      }
    } finally {
      setLoading(false);
    }
  };

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
      className={`${edit ? "order-1" : ""} w-full relative flex flex-col`}
      layout
      onSubmit={onFormSubmit}
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {loading ? (
        <>
          <div className="absolute left-0 top-0 bottom-0 right-0 opacity-50 bg-white z-10" />
          <div className="absolute w-fit h-fit left-1/2 top-1/2 -translate-x-[50%] -translate-y-[10%] z-30">
            <Loader />
          </div>
        </>
      ) : null}
      <h2 className="font-semibold text-xl text-black mb-6">
        {edit ? "Edit" : "New"} Address
      </h2>
      <ul className="flex flex-col gap-3 md:gap-6">
        <FormItem
          label={"FIRST NAME"}
          name={"firstName"}
          value={formValue.firstName}
          setValue={setFormValue}
          error={invalidFormFields.firstName}
          disabledInput={false}
          setInvalidFormFields={setInvalidFormFields}
        />
        <FormItem
          label={"LAST NAME"}
          name={"lastName"}
          value={formValue.lastName}
          setValue={setFormValue}
          error={invalidFormFields.lastName}
          disabledInput={false}
          setInvalidFormFields={setInvalidFormFields}
        />
        <FormItem
          label={"PHONE NUMBER"}
          name={"phone"}
          mask={masks.phone}
          value={formValue.phone}
          setValue={setFormValue}
          error={invalidFormFields.phone}
          disabledInput={false}
          setInvalidFormFields={setInvalidFormFields}
        />
        <div className="flex w-full items-center gap-4">
          <FormItem
            label={"STREET"}
            name={"street"}
            value={formValue.street}
            setValue={setFormValue}
            error={invalidFormFields.street}
            disabledInput={false}
            className={"flex-1"}
            setInvalidFormFields={setInvalidFormFields}
          />
          <FormItem
            label={"LOCAL"}
            name={"local"}
            value={formValue.local}
            setValue={setFormValue}
            error={invalidFormFields.local}
            disabledInput={false}
            className={"flex-1"}
            setInvalidFormFields={setInvalidFormFields}
          />
        </div>
        <div className="flex w-full items-center gap-4">
          <FormItem
            label={"POSTAL CODE"}
            name={"postal"}
            mask={masks.postal}
            value={formValue.postal}
            setValue={setFormValue}
            error={invalidFormFields.postal}
            disabledInput={false}
            className={"flex-1"}
            setInvalidFormFields={setInvalidFormFields}
          />
          <FormItem
            label={"CITY"}
            name={"city"}
            value={formValue.city}
            setValue={setFormValue}
            error={invalidFormFields.city}
            disabledInput={false}
            className={"flex-1"}
            setInvalidFormFields={setInvalidFormFields}
          />
        </div>
        <div className="flex flex-col">
          <label
            className="text-xs font-bold text-gray-deep mb-2"
            htmlFor="main"
          >
            MAIN
          </label>
          <button
            id="main"
            className="h-fit w-fit disabled:cursor-not-allowed"
            type="button"
            disabled={
              addressesCount === 0 || (edit && addressDetails?.main)
                ? true
                : false
            }
            onClick={() =>
              setFormValue((prev) => ({ ...prev, main: !prev.main }))
            }
          >
            <div
              className={`w-12 h-6 p-1 flex items-center border border-[#CBCBCB] rounded-full transition duration-300 ${
                formValue.main
                  ? "justify-end bg-black-nav border-none"
                  : "justify-start bg-white"
              }`}
            >
              <motion.div
                layout
                transition={{
                  duration: 0.3,
                  type: "keyframes",
                }}
                className={`w-4 h-4 rounded-full border-[1.5px] border-[#CBCBCB] shadow-custom ${
                  formValue.main ? "bg-white border-none" : "bg-gray-border"
                }`}
              />
            </div>
          </button>
        </div>
      </ul>
      <div className="w-full flex items-center justify-center gap-12">
        <p
          className={`flex-1 mt-10 ${
            serverError ? "opacity-100" : "opacity-0"
          } text-red-500 text-sm text-center`}
        >
          {serverError}
        </p>
        <div className="w-fit flex justify-end gap-2 mt-10">
          <DefaultButton
            type="button"
            text="Cancel"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0 });
              setTimeout(() => {
                setInvalidFormFields(initialInvalidFormFields);
                setOpenForm(false);
              }, 200);
            }}
            className="!bg-white !text-black-nav border border-gray-deep"
          />
          <DefaultButton text={edit ? "Submit" : "Add"} type="submit" />
        </div>
      </div>
    </motion.form>
  );
}
