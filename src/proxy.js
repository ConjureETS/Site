import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Every route lives under /fr or /en. A request with no locale prefix
// gets redirected to the default locale, once, at the edge — pages
// never have to handle the un-prefixed case themselves.
export default createMiddleware(routing);

export const config = {
  // Skip Next internals and any request for a file with an extension
  // (images, video, favicon, ...) — only page routes get a locale.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
