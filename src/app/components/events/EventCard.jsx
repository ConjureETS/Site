"use client";

import Image from "next/image";
import Carousel from "@/app/components/ui/Carousel";
import Panel from "@/app/components/ui/Panel";

export default function EventCard({ event, carouselLabels }) {
  return (
    <Panel hover className="overflow-hidden">
      <div className="relative aspect-[16/9] bg-bg">
        <Carousel
          items={event.images}
          fill
          gapClassName="gap-0"
          slideClassName="flex-[0_0_100%] relative h-full"
          previousLabel={carouselLabels.previous}
          nextLabel={carouselLabels.next}
          renderItem={(src, idx) => (
            <Image
              src={src}
              alt={`${event.name} — photo ${idx + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          )}
        />
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-text">{event.name}</h2>
        <div className="text-sm text-text-faint mt-1">
          {event.date} — {event.location}
        </div>
        <p className="text-text-muted mt-4 whitespace-pre-line leading-relaxed">{event.description}</p>
      </div>
    </Panel>
  );
}
