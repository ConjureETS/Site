"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import NavDropdown from "./NavDropdown";
import LocaleSwitcher from "./LocaleSwitcher";
import Button from "@/app/components/ui/Button";
import Container from "@/app/components/ui/Container";
import useScrollNav from "@/app/hooks/useScrollNav";
import { Link } from "@/i18n/navigation";

function renderNavItem(item) {
  if (item.items) {
    return (
      <NavDropdown
        key={item.label}
        label={item.label}
        ariaLabel={item.label + " menu"}
        items={item.items.map((sub) => ({ href: sub.href, text: sub.label }))}
      />
    );
  }

  return (
    <Link
      key={item.label}
      href={item.href}
      // Padding + matching negative margin grow the hit area beyond the text
      // without shifting it or nudging surrounding layout (gap, alignment).
      className="text-sm font-medium tracking-wide text-text hover:text-primary-300 transition-colors -mx-3 -my-2 px-3 py-2"
    >
      {item.label}
    </Link>
  );
}

function renderMobileNavItem(item, onNavigate) {
  if (item.items) {
    return (
      <li key={item.label} className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-text-faint">{item.label}</span>
        <ul className="flex flex-col gap-3 pl-1">
          {item.items.map((sub) => (
            <li key={sub.label}>
              <Link
                href={sub.href}
                onClick={onNavigate}
                className="block text-lg text-text hover:text-primary-300 -mx-3 -my-2 px-3 py-2"
              >
                {sub.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li key={item.label}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className="block text-lg text-text hover:text-primary-300 -mx-3 -my-2 px-3 py-2"
      >
        {item.label}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const [show] = useScrollNav(true, 80);
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const navbarData = t.raw("navbar");
  const common = t.raw("common");
  const donationUrl = t("site.donationUrl");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handle = (e) => {
      if (e.matches) setOpen(false);
    };
    if (mq.matches) setOpen(false);
    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Lock background scroll while the full-height mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header
        style={{
          transform: show ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 300ms cubic-bezier(.2,.8,.2,1)",
          willChange: "transform",
          pointerEvents: show ? "auto" : "none",
        }}
        className="fixed top-0 left-0 w-full z-50 border-b border-border bg-bg/85 backdrop-blur-md"
        aria-label="Navigation principale"
      >
        <Container className="h-[72px] flex items-center justify-between py-3">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/conjure/conjure_blanc_couleur.png"
              alt="Conjure"
              height={72}
              width={480}
              priority
              style={{ width: "auto", height: "32px" }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6 lg:gap-8 m-0 list-none">
              {navbarData.map((item) => (
                <li key={item.label}>{renderNavItem(item)}</li>
              ))}
            </ul>
            <LocaleSwitcher className="text-sm font-medium tracking-wide" />
            {/* Wrapper (not a class on Button itself) controls visibility: Button's own
                base classes already force display:inline-flex, which would otherwise
                fight a "hidden" override passed straight into its className. */}
            <div className="hidden lg:block">
              <Button href={donationUrl} external size="md">
                {common.nav.contribute}
              </Button>
            </div>
          </nav>

          <button
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 -mr-2 rounded-md text-text hover:text-primary-300 cursor-pointer"
          >
            <span className="sr-only">{open ? common.nav.closeMenu : common.nav.openMenu}</span>
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </Container>

        {open && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-border bg-bg h-[calc(100vh-72px)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <nav className="p-6">
              <ul className="flex flex-col gap-6 m-0 list-none">
                {navbarData.map((item) => renderMobileNavItem(item, () => setOpen(false)))}
              </ul>
              <LocaleSwitcher
                className="mt-6 text-base font-medium tracking-wide"
                onNavigate={() => setOpen(false)}
              />
              <Button
                href={donationUrl}
                external
                size="lg"
                className="mt-6 w-full"
                onClick={() => setOpen(false)}
              >
                {common.nav.contribute}
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent layout jump under the fixed header */}
      <div aria-hidden className="h-[72px]" />
    </>
  );
}
