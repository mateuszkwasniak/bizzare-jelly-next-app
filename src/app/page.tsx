import { fetchHomePageDetails } from "@/utils/strapi/get";
import { Metadata } from "next";
import PageSectionRenderer from "./components/sections/PageSectionRenderer";
import AnimateWrapper from "./components/layout/root/AnimateWrapper";

export async function generateMetadata(): Promise<Metadata> {
  let SEO: SEO | undefined;

  const response = await fetchHomePageDetails();

  SEO = response?.data?.SEO;

  return {
    title: SEO?.metaTitle || "Bizzare Jelly Home Page",
    description: SEO?.metaDescription || "Welcome to Bizzare Jelly!",
  };
}

export default async function HomePage() {
  let pageSectionsData: PageSectionData[] = [];

  try {
    const response = await fetchHomePageDetails();
    if (response?.data) {
      pageSectionsData = response.data.pageSectionsData;
    } else throw new Error(response?.error);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }

  return (
    <AnimateWrapper>
      <main className="max-w-[1920px] h-full">
        {pageSectionsData.map((sectionData: any) => (
          <PageSectionRenderer
            pageSectionData={sectionData}
            key={sectionData.id}
          />
        ))}
      </main>
    </AnimateWrapper>
  );
}
