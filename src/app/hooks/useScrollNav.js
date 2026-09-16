"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook to show/hide navigation bar on scroll.
 *
 * Behavior:
 * - Accumulates downward scroll distance; once accumulated down > hideThreshold the nav hides.
 * - Any upward scroll immediately shows the nav.
 *
 * @param initial - initial visibility state
 * @param hideThreshold - total downward distance (px) required to hide the nav
 * @returns {[boolean]} - [show]
 */
export default function useScrollNav(initial = true, hideThreshold = 80) {
  const [show, setShow] = useState(initial);
  const lastY = useRef(0);
  const accumulatedDown = useRef(0);
  const lastDirection = useRef(0); // 1 = down, -1 = up, 0 = init
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = typeof window !== "undefined" ? window.scrollY : 0;
    accumulatedDown.current = 0;
    lastDirection.current = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY.current;

          if (currentY <= 0) {
            // at very top: always show and treat as top
            setShow(true);
            accumulatedDown.current = 0;
            lastDirection.current = 0;
          } else if (delta > 0) {
            // scrolling down: accumulate distance (works for slow or fast)
            if (lastDirection.current !== 1) {
              accumulatedDown.current = 0;
            }
            accumulatedDown.current += delta;

            if (accumulatedDown.current > hideThreshold) {
              setShow(false);
            }
            lastDirection.current = 1;
          } else if (delta < 0) {
            // scrolling up: show immediately
            setShow(true);
            accumulatedDown.current = 0;
            lastDirection.current = -1;
          }

          lastY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideThreshold]);

  return [show];
}
