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
    locale = await rootParams.locale();
  }

  // `locale` can arrive directly from routing even when it isn't one of
  // ours — e.g. bots probing paths like /robots.txt or /.env get matched
  // as a `[locale]` segment. Validate unconditionally so those 404
  // instead of crashing on a dynamic import that can never resolve.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const modules = await Promise.all(
    NAMESPACES.map((namespace) => import(`../messages/${locale}/${namespace}.json`))
  );

  return {
    locale,
    messages: Object.fromEntries(NAMESPACES.map((namespace, i) => [namespace, modules[i].default])),
  };
});
