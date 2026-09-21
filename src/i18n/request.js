import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

// One JSON file per namespace under messages/<locale>/ — keeps each
// section's copy in its own small file instead of one giant blob.
// Add a namespace: create <locale>/<name>.json for every locale, then
// add "<name>" here.
const NAMESPACES = [
  "common",
  "site",
  "navbar",
  "home",
  "about",
  "offerings",
  "games",
  "events",
  "sponsors",
  "mediaKit",
  "contact",
];

// Next.js 16.3+ / next-intl: `locale` arrives directly for most requests.
// The `next/root-params` fallback (reading the [locale] segment straight
// off the route) is what keeps Server Components that call
// getTranslations() with no arguments eligible for static rendering —
// the older setRequestLocale() approach stopped reliably preserving
// static rendering for the page co-located with this root layout.
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  const modules = await Promise.all(
    NAMESPACES.map((namespace) => import(`../messages/${locale}/${namespace}.json`))
  );

  return {
    locale,
    messages: Object.fromEntries(NAMESPACES.map((namespace, i) => [namespace, modules[i].default])),
  };
});
