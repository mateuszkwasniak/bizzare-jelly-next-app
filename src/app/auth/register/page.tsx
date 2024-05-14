import RegisterForm from "./components/RegisterForm";
import Image from "next/image";
import { Metadata } from "next";

import { fetchSignUpPageDetails } from "@/utils/strapi/get";
import AnimateWrapper from "@/app/components/layout/root/AnimateWrapper";

export async function generateMetadata(): Promise<Metadata> {
  let SEO: SEO | undefined;

  const response = await fetchSignUpPageDetails();
  SEO = response?.data?.SEO;

  return {
    title: SEO?.metaTitle || "Bizzare Jelly register page",
    description: SEO?.metaDescription || "Register!",
  };
}

export default async function RegisterPage() {
  let signUpImage: string = "";

  try {
    const response = await fetchSignUpPageDetails();
    if (response?.data) {
      signUpImage = response.data.signUpImage;
    } else throw new Error(response?.error);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }

  return (
    <AnimateWrapper>
      <main className="h-full flex justify-center bg-transparent">
        <div className="h-full w-full flex flex-col md:flex-row relative">
          <div className="absolute top-0 bottom-0 left-0 right-0 md:right-1/2 -z-10 md:z-0 opacity-20 md:opacity-100 bg-gray-100">
            <Image
              src={`${process.env.STRAPI_BASE_URL}${signUpImage}`}
              alt="Sign Up Creatures"
              quality={100}
              width={960}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden md:block md:w-1/2" />
          <div className="max-w-[960px] md:min-h-[calc(100vh-76px)] md:self-end px-4 md:pl-16 2xl:pl-32 pb-10 pt-20 md:pt-0 flex-1">
            <h2 className="text-4xl mb-6 md:mt-48 font-medium text-center md:text-start">
              Sign up
            </h2>
            <RegisterForm />
          </div>
        </div>
      </main>
    </AnimateWrapper>
  );
}
