"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HiChevronDown } from "react-icons/hi";

export default function NavDropdown({ label, items, ariaLabel = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const menuStyle = {
    transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out",
    transformOrigin: "top",
    opacity: open ? 1 : 0,
    transform: open ? "scale(1) translateY(0)" : "scale(0.97) translateY(-6px)",
    pointerEvents: open ? "auto" : "none",
  };

  const chevronStyle = {
    transition: "transform 150ms ease-in-out",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        // Padding + matching negative margin grow the hit area beyond the
        // label without shifting it or nudging the surrounding nav layout.
        className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors cursor-pointer -mx-3 -my-2 px-3 py-2 ${
          open ? "text-primary-300" : "text-text hover:text-primary-300"
        }`}
      >
        {label}
        <HiChevronDown className="w-4 h-4" style={chevronStyle} />
      </button>
      <ul
        role="menu"
        aria-label={ariaLabel}
        aria-hidden={!open}
        style={menuStyle}
        className="absolute left-0 mt-3 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-2xl z-50"
      >
        {items.map(({ href, text }, idx) => (
          <li role="none" key={idx}>
            <Link
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface-2 hover:text-primary-300"
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
