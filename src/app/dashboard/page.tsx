import React from "react";
import AccountForm from "./components/AccountForm";
import { fetchUserData } from "@/utils/strapi/get";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AnimateWrapper from "../components/layout/root/AnimateWrapper";

export default async function DashboardPage() {
  const jwt = cookies().get(
    process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string
  )?.value;

  let user: User;

  try {
    const response = await fetchUserData(jwt);

    if (response?.data) {
      user = response.data;
    } else throw new Error(response?.error);
  } catch (error: any) {
    if (error.message === "401") {
      redirect(`/auth/login?from=/dashboard&signed-out=true`);
    } else {
      throw new Error(
        error?.message || "Something went wrong, please try again later"
      );
    }
  }

  return (
    <AnimateWrapper>
      <main className="max-w-[1200px] w-full flex flex-col">
        <section className="flex flex-col w-full">
          <AccountForm userData={user} />
        </section>
      </main>
    </AnimateWrapper>
  );
}
