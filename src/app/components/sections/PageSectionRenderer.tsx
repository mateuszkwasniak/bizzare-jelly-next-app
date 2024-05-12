import React from "react";
import HeroSection from "./HeroSection";
import ArrivalsSection from "./ArrivalsSection";

const blockTypes = {
  HeroSection: "page-sections.hero-section",
  ArrivalsSection: "page-sections.arrivals-section",
};

export default function PageSectionRenderer({
  pageSectionData,
}: {
  pageSectionData: any;
}) {
  switch (pageSectionData.__component) {
    case blockTypes.HeroSection:
      return (
        <HeroSection
          header={pageSectionData.header}
          description={pageSectionData.description}
          CTA={pageSectionData.CTA}
          heroImage={`${process.env.STRAPI_BASE_URL}${pageSectionData.heroImage?.data?.attributes?.url}`}
        />
      );

    case blockTypes.ArrivalsSection:
      return (
        <ArrivalsSection
          header={pageSectionData.header}
          newProducts={pageSectionData.newProducts.data}
        />
      );
    default:
      return null;
  }
}
