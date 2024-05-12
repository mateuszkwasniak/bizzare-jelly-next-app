import LoginForm from "./components/LoginForm";
import Image from "next/image";
import { Metadata } from "next";

import { fetchSignInPageDetails } from "@/utils/strapi/get";
import AnimateWrapper from "@/app/components/layout/root/AnimateWrapper";

export async function generateMetadata(): Promise<Metadata> {
  let SEO: SEO | undefined;

  const response = await fetchSignInPageDetails();
  SEO = response?.data?.SEO;

  return {
    title: SEO?.metaTitle || "Bizzare Jelly login page",
    description: SEO?.metaDescription || "Login!",
  };
}

export default async function LoginPage() {
  let signInImage: string = "";

  try {
    const response = await fetchSignInPageDetails();
    if (response?.data) {
      signInImage = response.data.signInImage;
    } else throw new Error(response?.error);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }

  return (
    <AnimateWrapper>
      <main className="h-full flex justify-center">
        <div className="h-full w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:h-[calc(100vh-76px)] absolute -z-10 md:z-0 opacity-20 md:opacity-100 md:relative bg-gray-100">
            <Image
              src={`${process.env.STRAPI_BASE_URL}${signInImage}`}
              alt="Sign In Creatures"
              quality={100}
              width={960}
              height={1000}
              className="h-full w-full object-contain object-right-top"
            />
          </div>
          <div className="max-w-[960px] md:pl-32 pb-10 pt-20 md:pt-0 flex-1 px-5 md:px-0">
            <h2 className="text-4xl mb-6 md:mt-48 font-medium text-center md:text-start">
              Sign in
            </h2>
            <LoginForm />
          </div>
        </div>
      </main>
    </AnimateWrapper>
  );
}
