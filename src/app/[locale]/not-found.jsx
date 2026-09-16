import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import Button from "@/app/components/ui/Button";

// Note: Next.js ignores generateMetadata exported from this file for an
// implicitly-unmatched route (a known App Router limitation) — the tab
// title stays Next's generic "404: This page could not be found." The
// page content below is still fully localized.
//
// Rendered inside the [locale] segment's layout, so it still has a
// resolved locale from the request config (falls back to the default
// locale itself if the segment value was invalid — see i18n/request.js).
export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <Container className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 py-24">
      <span className="font-mono text-xs tracking-[0.15em] uppercase text-primary-300">{t("notFound.eyebrow")}</span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text">{t("notFound.title")}</h1>
      <p className="text-text-muted max-w-md">{t("notFound.description")}</p>
      <Button href="/">{t("backHome")}</Button>
    </Container>
  );
}
