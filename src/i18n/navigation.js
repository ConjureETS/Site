import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link/usePathname/useRouter — Link auto-prefixes internal
// paths with the active locale (`/games` -> `/fr/games`), so components
// pass plain app paths and never build the prefix by hand. External URLs
// (http/https, mailto:) pass through untouched.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
