"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * FR/EN toggle. Swaps only the locale, keeping the current page —
 * next-intl's `usePathname` already returns the path with the locale
 * segment stripped, so `Link` just needs to be told which locale to
 * switch to.
 *
 * `inline-flex items-center leading-none` keeps this vertically
 * centered against its sibling nav links: as a plain inline block its
 * own line-height (driven by its font/size) doesn't necessarily match
 * the nav links', so despite the parent row also using items-center,
 * the two texts could sit half a pixel off from each other.
 */
export default function LocaleSwitcher({ className, onNavigate }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={`inline-flex items-center leading-none ${className ?? ""}`}
      role="group"
      aria-label="Choisir la langue / Choose language"
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i > 0 && <span className="text-text-faint px-1" aria-hidden="true">/</span>}
          {l === locale ? (
            <span className="text-primary-300" aria-current="true">
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={l}
              onClick={onNavigate}
              className="text-text-muted hover:text-primary-300"
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
