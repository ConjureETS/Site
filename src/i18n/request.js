import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
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

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const modules = await Promise.all(
    NAMESPACES.map((namespace) => import(`../messages/${locale}/${namespace}.json`))
  );

  return {
    locale,
    messages: Object.fromEntries(NAMESPACES.map((namespace, i) => [namespace, modules[i].default])),
  };
});
