import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // Browser-language auto-detection stays on: an English browser lands
  // on /en, a French one on /fr, and anything else (Accept-Language the
  // negotiator can't match to either) falls back to defaultLocale — fr.
});
