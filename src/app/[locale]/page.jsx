import { getTranslations } from "next-intl/server";
import Hero from "@/app/components/sections/Hero";
import Mission from "@/app/components/sections/Mission";
import Offerings from "@/app/components/sections/Offerings";
import ActivitiesPreview from "@/app/components/sections/ActivitiesPreview";
import PartnersStrip from "@/app/components/sections/PartnersStrip";
import CtaBand from "@/app/components/sections/CtaBand";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  // The root layout's title.template only applies to descendant
  // segments, not to a page co-located with the layout that defines it
  // (this page IS that segment) — so the "Page - Brand" format has to
  // be built by hand here instead of relying on the template.
  return { title: `${t.raw("navbar")[0].label} - ${t("site.brandName")}` };
}

// Homepage is just a stack of section components, each owning its own
// data import. To add/reorder a section: create it under
// components/sections and add/move one line here.
export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <Offerings />
      <ActivitiesPreview />
      <PartnersStrip />
      <CtaBand />
    </>
  );
}
