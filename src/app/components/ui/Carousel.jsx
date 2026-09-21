"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { cn } from "@/lib/cn";

/**
 * Generic embla-backed carousel. Both the games grid and the event
 * image galleries use this — previously each page hand-rolled its
 * own copy of the same embla + hold-to-scroll wiring.
 *
 * @param {any[]} items
 * @param {(item: any, index: number) => React.ReactNode} renderItem
 * @param {(item: any, index: number) => string|number} [getKey]
 * @param {string} [slideClassName] - flex-basis classes for one slide
 * @param {string} [gapClassName] - gap between slides
 * @param {boolean} [fill] - stretch the carousel to fill an absolutely-positioned
 *   parent (e.g. an aspect-ratio image box), instead of sizing to slide content
 */
export default function Carousel({
  items,
  renderItem,
  getKey,
  slideClassName,
  gapClassName = "gap-6",
  fill = false,
  previousLabel = "Previous",
  nextLabel = "Next",
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
  });

  const [prevEnabled, setPrevEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);
  const holdInterval = useRef(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const startHoldScroll = (direction) => {
    if (holdInterval.current) clearInterval(holdInterval.current);
    const scrollFn = direction === "prev" ? scrollPrev : scrollNext;
    scrollFn();
    holdInterval.current = setInterval(scrollFn, 150);
  };
  const stopHoldScroll = () => {
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdInterval.current = null;
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevEnabled(emblaApi.canScrollPrev());
    setNextEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Sync once with Embla's current state on mount, then the listeners
    // below keep it in sync — same external-system-sync pattern as any
    // other subscription effect, the rule just can't tell that apart
    // from a plain render-time setState.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!items || items.length === 0) return null;

  const showControls = items.length > 1;

  return (
    <div className={cn("relative", fill && "absolute inset-0 h-full")}>
      <div className={cn("overflow-hidden", fill && "h-full")} ref={emblaRef}>
        <div className={cn("flex", gapClassName, fill && "h-full")}>
          {items.map((item, idx) => (
            <div
              key={getKey ? getKey(item, idx) : idx}
              className={
                slideClassName ??
                cn("flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_40%] xl:flex-[0_0_35%]", fill && "h-full")
              }
            >
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            onMouseDown={() => startHoldScroll("prev")}
            onMouseUp={stopHoldScroll}
            onMouseLeave={stopHoldScroll}
            onTouchStart={() => startHoldScroll("prev")}
            onTouchEnd={stopHoldScroll}
            disabled={!prevEnabled}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-border-strong bg-bg/80 backdrop-blur p-2 text-text
                       transition-all duration-200 hover:border-primary-400 hover:text-primary-300 disabled:opacity-0 cursor-pointer"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onMouseDown={() => startHoldScroll("next")}
            onMouseUp={stopHoldScroll}
            onMouseLeave={stopHoldScroll}
            onTouchStart={() => startHoldScroll("next")}
            onTouchEnd={stopHoldScroll}
            disabled={!nextEnabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-border-strong bg-bg/80 backdrop-blur p-2 text-text
                       transition-all duration-200 hover:border-primary-400 hover:text-primary-300 disabled:opacity-0 cursor-pointer"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
