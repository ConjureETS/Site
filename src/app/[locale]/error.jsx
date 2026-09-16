"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Container from "@/app/components/ui/Container";
import Button from "@/app/components/ui/Button";

// Next.js file-based error boundary: wraps every route automatically.
// It renders inside the [locale] layout's NextIntlClientProvider (the
// provider wraps `children`, and this substitutes for `children` on
// error), so it still has access to the current locale's messages.
export default function Error({ error, reset }) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 py-24">
      <span className="font-mono text-xs tracking-[0.15em] uppercase text-primary-300">{t("error.eyebrow")}</span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text">{t("error.title")}</h1>
      <p className="text-text-muted max-w-md">{t("error.description")}</p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>{t("error.retry")}</Button>
        <Button href="/" variant="outline">
          {t("backHome")}
        </Button>
      </div>
    </Container>
  );
}
