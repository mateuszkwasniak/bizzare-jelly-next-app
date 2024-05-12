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
        <div className="h-full w-full flex flex-col md:flex-row ">
          <div className="w-full md:w-1/2 md:h-[calc(100vh-76px)] absolute md:relative -z-20 md:z-100 opacity-25 md:opacity-100 bg-gray-100">
            <Image
              src={`${process.env.STRAPI_BASE_URL}${signUpImage}`}
              alt="Sign Up Creatures"
              quality={100}
              width={960}
              height={1000}
              className="h-full w-full max-w-[960px] ml-auto object-contain object-right-top"
            />
          </div>

          <div className="max-w-[960px] md:pl-32 pb-10 pt-20 md:pt-0 px-5 md:px-0 flex-1">
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
