"use client";

import Carousel from "@/app/components/ui/Carousel";
import GameCard from "./GameCard";

export default function GamesCarousel({ games, learnMoreLabel, carouselLabels }) {
  if (!games || games.length === 0) return null;

  return (
    <Carousel
      items={games}
      getKey={(game) => game.title}
      previousLabel={carouselLabels.previous}
      nextLabel={carouselLabels.next}
      slideClassName="flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_40%] xl:flex-[0_0_35%]"
      renderItem={(game) => <GameCard game={game} learnMoreLabel={learnMoreLabel} />}
    />
  );
}
