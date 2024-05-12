"use client";

import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SignUpCredential } from "@/models/SignUpCredential";
import { validateOrReject } from "class-validator";
import { useAuthState } from "@/hooks/store/auth";
import { useRouter } from "next/navigation";
import DefaultButton from "@/app/components/customizable/DefaultButton";

interface ValidatorError {
  property: string;
  constraints: {
    isLength?: string;
    isBoolean?: string;
    isEmail?: string;
    matches?: string;
  };
}

type SignUpFormFields = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type InvalidFormFields = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const initialInvalidFormFields: InvalidFormFields = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const registerFormFieldsArray = Object.keys(initialInvalidFormFields);

export default function RegisterForm() {
  const [formValues, setFormValues] = useState<SignUpFormFields>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [invalidFormFields, setInvalidFormFields] = useState<InvalidFormFields>(
    initialInvalidFormFields
  );
  const [firstInvalidToScroll, setFirstInvalidToScroll] = useState<string>("");

  const [serverError, setServerError] = useState<string>("");

  const updateAuthState = useAuthState((state) => state.updateAuth);

  const router = useRouter();

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setInvalidFormFields(initialInvalidFormFields);
    setFirstInvalidToScroll("");

    const credential = new SignUpCredential(
      formValues.username,
      formValues.firstName,
      formValues.lastName,
      formValues.email,
      formValues.password
    );

    try {
      await validateOrReject(credential);

      const result = await signUp({
        username: credential.username,
        firstName: credential.firstName,
        lastName: credential.lastName,
        email: credential.email,
        password: credential.password,
      });

      if (result?.error) {
        throw new Error(result?.error);
      }

      if (result?.jwt && result?.username) {
        updateAuthState({ username: result.username, jwt: result.jwt });
        router.push("/");
      }
    } catch (error: any) {
      if (Array.isArray(error)) {
        const errorProperties = error.map(
          (error: ValidatorError) => error.property
        );

        const firstInvalidField = registerFormFieldsArray.find((field) => {
          return errorProperties.includes(field);
        });

        setFirstInvalidToScroll(firstInvalidField || "");
        error.forEach(
          (error: {
            property: string;
            constraints: { isLength?: string; isEmail?: string };
          }) => {
            setInvalidFormFields((prev) => ({
              ...prev,
              [error.property]:
                error.constraints?.isLength || error.constraints?.isEmail,
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
    <form
      className="flex flex-col gap-8 justify-center md:w-[65%]"
      onSubmit={onFormSubmit}
    >
      <p className="text-center md:text-start">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#38CB89] ">
          Sign in
        </Link>
      </p>
      <input
        id="username"
        name="username"
        className={`${
          invalidFormFields?.username ? "border-red-500" : ""
        } border-b pb-4 outline-none bg-transparent scroll-m-32`}
        placeholder="Username"
        value={formValues.username}
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFormValues((prev) => ({ ...prev, username: e.target.value }));
        }}
        onFocus={() =>
          setInvalidFormFields((prev) => ({
            ...prev,
            username: "",
          }))
        }
      />
      <p
        className={`${
          invalidFormFields?.username ? "opacity-100" : "opacity-0"
        } -mt-6 text-red-500 text-xs`}
      >
        {invalidFormFields?.username}
      </p>
      <input
        id="firstName"
        name="firstName"
        className={`${
          invalidFormFields?.firstName ? "border-red-500" : ""
        } border-b pb-4 outline-none bg-transparent scroll-m-32`}
        placeholder="First Name"
        value={formValues.firstName}
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFormValues((prev) => ({ ...prev, firstName: e.target.value }));
        }}
        onFocus={() =>
          setInvalidFormFields((prev) => ({
            ...prev,
            firstName: "",
          }))
        }
      />
      <p
        className={`${
          invalidFormFields?.firstName ? "opacity-100" : "opacity-0"
        } -mt-6 text-red-500 text-xs`}
      >
        {invalidFormFields?.firstName}
      </p>
      <input
        id="lastName"
        name="lastName"
        className={`${
          invalidFormFields?.lastName ? "border-red-500" : ""
        } border-b pb-4 outline-none bg-transparent scroll-m-32`}
        placeholder="Last Name"
        value={formValues.lastName}
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFormValues((prev) => ({ ...prev, lastName: e.target.value }));
        }}
        onFocus={() =>
          setInvalidFormFields((prev) => ({
            ...prev,
            lastName: "",
          }))
        }
      />
      <p
        className={`${
          invalidFormFields?.lastName ? "opacity-100" : "opacity-0"
        } -mt-6 text-red-500 text-xs`}
      >
        {invalidFormFields?.lastName}
      </p>
      <input
        id="email"
        name="email"
        className={`${
          invalidFormFields?.email ? "border-red-500" : ""
        } border-b pb-4 outline-none bg-transparent scroll-m-32`}
        placeholder="Email"
        value={formValues.email}
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFormValues((prev) => ({ ...prev, email: e.target.value }));
        }}
        onFocus={() =>
          setInvalidFormFields((prev) => ({
            ...prev,
            email: "",
          }))
        }
      />
      <p
        className={`${
          invalidFormFields?.email ? "opacity-100" : "opacity-0"
        } -mt-6 text-red-500 text-xs`}
      >
        {invalidFormFields?.email}
      </p>
      <input
        id="password"
        name="password"
        className={`${
          invalidFormFields?.password ? "border-red-500" : ""
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
            password: "",
          }))
        }
      />
      <p
        className={`${
          invalidFormFields?.password ? "opacity-100" : "opacity-0"
        } -mt-6 text-red-500 text-xs`}
      >
        {invalidFormFields?.password}
      </p>

      <DefaultButton
        text="Sign Up"
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
  );
}
