"use client";
import { useEffect, useRef, useState } from "react";
import { HiChevronUp } from "react-icons/hi";

let isScrolling = false;

export default function ScrollToTopButton({ label = "Retour en haut" }) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    let mo = null;
    let footer = document.querySelector("footer");

    const rectsOverlap = (a, b) =>
      !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

    const updateFadeFromRect = () => {
      if (!footer || !btnRef.current) {
        setFadeOut(false);
        return;
      }
      const footerRect = footer.getBoundingClientRect();
      const btnRect = btnRef.current.getBoundingClientRect();
      setFadeOut(rectsOverlap(btnRect, footerRect));
    };

    const onScroll = () => {
      const showAfter = Math.min(400, Math.round(window.innerHeight * 0.15));
      setVisible(window.scrollY > showAfter);
      updateFadeFromRect();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFadeFromRect, { passive: true });
    onScroll();

    if (!footer) {
      mo = new MutationObserver(() => {
        footer = document.querySelector("footer");
        if (footer) {
          updateFadeFromRect();
          mo?.disconnect();
          mo = null;
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } else {
      updateFadeFromRect();
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateFadeFromRect);
      mo?.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    isScrolling = true;
    const animate = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0 && isScrolling) {
        window.requestAnimationFrame(animate);
        window.scrollTo(0, c - c / 8);
      }
    };
    animate();

    const stop = () => {
      isScrolling = false;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
  };

  const shouldShow = visible && !fadeOut;

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      aria-label={label}
      className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-surface border border-border-strong text-text
                 shadow-lg hover:border-primary-400 hover:text-primary-300 cursor-pointer"
      style={{
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? "auto" : "none",
        transition: "opacity 0.25s ease-in-out, transform 0.25s ease-in-out",
        transform: shouldShow ? "translateY(0)" : "translateY(6px)",
      }}
    >
      <HiChevronUp size={22} />
    </button>
  );
}
