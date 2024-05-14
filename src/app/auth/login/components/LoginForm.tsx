"use client";

import { googleSignIn, signIn } from "@/app/actions/auth";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Credential } from "@/models/Credential";
import { validateOrReject } from "class-validator";
import { useAuthState } from "@/hooks/store/auth";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import DefaultButton from "@/app/components/customizable/DefaultButton";
import { GrGoogle } from "react-icons/gr";

interface ValidatorError {
  property: string;
  constraints: {
    isLength?: string;
    isBoolean?: string;
    isEmail?: string;
    matches?: string;
  };
}

type FormFieldValidity = {
  invalid: boolean;
  error: string;
};

const initialInvalidFormFields: {
  identifier: FormFieldValidity;
  password: FormFieldValidity;
} = {
  identifier: {
    invalid: false,
    error: "",
  },
  password: {
    invalid: false,
    error: "",
  },
};

const loginFormFieldsArray = ["identifier", "password"];

export default function LoginForm() {
  const [formValues, setFormValues] = useState<{
    identifier: string;
    password: string;
  }>({
    identifier: "",
    password: "",
  });

  const [invalidFormFields, setInvalidFormFields] = useState<{
    identifier: FormFieldValidity;
    password: FormFieldValidity;
  }>(initialInvalidFormFields);
  const [firstInvalidToScroll, setFirstInvalidToScroll] = useState<string>("");

  const [serverError, setServerError] = useState<string>("");

  const updateAuthState = useAuthState((state) => state.updateAuth);

  const router = useRouter();

  const searchParams = useSearchParams();

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setFirstInvalidToScroll("");
    setInvalidFormFields(initialInvalidFormFields);

    const credential = new Credential(
      formValues.identifier,
      formValues.password
    );

    try {
      await validateOrReject(credential);

      const result = await signIn({
        identifier: credential.identifier,
        password: credential.password,
      });

      if (result?.error) {
        throw new Error(result?.error);
      }

      if (result?.jwt && result?.username) {
        updateAuthState({ username: result.username, jwt: result.jwt });
      }

      let from = searchParams.get("from");

      if (from) {
        router.replace(from);
      } else router.replace("/");
    } catch (error: any) {
      if (Array.isArray(error)) {
        const errorProperties = error.map(
          (error: ValidatorError) => error.property
        );

        const firstInvalidField = loginFormFieldsArray.find((field) => {
          return errorProperties.includes(field);
        });

        setFirstInvalidToScroll(firstInvalidField || "");

        error.forEach(
          (error: { property: string; constraints: { isLength: string } }) => {
            setInvalidFormFields((prev) => ({
              ...prev,
              [error.property]: {
                invalid: true,
                error: error.constraints.isLength,
              },
            }));
          }
        );
      } else {
        setServerError(
          error?.message || "Something went wrong, please try again later"
        );
      }
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
    <>
      <form
        className="flex flex-col gap-8 justify-center xl:w-[65%]"
        onSubmit={onFormSubmit}
      >
        <p className="text-center md:text-start">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/register" className="text-[#38CB89] ">
            Sign up
          </Link>
        </p>
        <input
          id="identifier"
          name="identifier"
          className={`${
            invalidFormFields.identifier.invalid ? "border-red-500" : ""
          } border-b pb-4 outline-none bg-transparent scroll-m-32`}
          placeholder="Username or email address"
          value={formValues.identifier}
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormValues((prev) => ({ ...prev, identifier: e.target.value }));
          }}
          onFocus={() =>
            setInvalidFormFields((prev) => ({
              ...prev,
              identifier: { invalid: false, error: "" },
            }))
          }
        />
        <p
          className={`${
            invalidFormFields.identifier.error ? "opacity-100" : "opacity-0"
          } -mt-6 text-red-500 text-xs`}
        >
          {invalidFormFields.identifier.error}
        </p>
        <input
          id="password"
          name="password"
          className={`${
            invalidFormFields.password.invalid ? "border-red-500" : ""
          } border-b pb-4 outline-none bg-transparent scroll-m-32`}
          placeholder="Password"
          value={formValues.password}
          type="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormValues((prev) => ({ ...prev, password: e.target.value }));
          }}
          onFocus={() =>
            setInvalidFormFields((prev) => ({
              ...prev,
              password: { invalid: false, error: "" },
            }))
          }
        />
        <p
          className={`${
            invalidFormFields.password.error ? "opacity-100" : "opacity-0"
          } -mt-6 text-red-500 text-xs`}
        >
          {invalidFormFields.password.error}
        </p>
        <Link href="/reset-password" className="font-semibold -mt-4 ml-auto">
          Forget your password?
        </Link>
        <DefaultButton
          text="Log in"
          type="submit"
          className="w-full md:!w-fit"
        />
        <p
          className={`${
            serverError ? "opacity-100" : "opacity-0"
          } -mt-4 text-red-500 text-sm text-center mr-auto`}
        >
          {serverError}
        </p>
      </form>
      <div className="flex flex-col items-center md:items-start">
        <div className="w-full my-6 flex items-center justify-center md:justify-start gap-5 text-black-nav md:text-gray-text">
          <div className="h-[1px] w-16 bg-black-nav md:bg-gray-border" />
          or
          <div className="h-[1px] w-16 bg-black-nav md:bg-gray-border" />
        </div>
        <button
          onClick={() => googleSignIn()}
          className="ml-0 md:ml-12 py-4 px-16 md:px-4 md:w-20 h-20 relative flex items-center justify-center border border-black-nav md:border-gray-border rounded-full bg-black-header text-white"
        >
          <GrGoogle className="text-4xl text-white" />
        </button>
      </div>
    </>
  );
}
