import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import SectionHeading from "@/app/components/ui/SectionHeading";
import Button from "@/app/components/ui/Button";
import Panel from "@/app/components/ui/Panel";
import Badge from "@/app/components/ui/Badge";

function latestGame(gamelabGames) {
  const years = Object.keys(gamelabGames).sort((a, b) => b.localeCompare(a));
  const latestYear = years[0];
  const game = gamelabGames[latestYear]?.[0];
  return game ? { ...game, year: latestYear } : null;
}

export default async function ActivitiesPreview() {
  const t = await getTranslations();
  const activities = t.raw("home.activities");
  const featuredGame = latestGame(t.raw("games.gamelab.games"));
  const featuredEvent = t.raw("events.items")[0];

  return (
    <section className="py-24 border-b border-border">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <SectionHeading eyebrow={activities.eyebrow} title={activities.title} description={activities.description} />
          <div className="flex gap-3 shrink-0">
            <Button href="/games" variant="outline">
              {activities.gamesButton}
            </Button>
            <Button href="/events" variant="outline">
              {activities.eventsButton}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredGame && (
            <Panel hover className="overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] bg-bg">
                <Image
                  src={featuredGame.image}
                  alt={featuredGame.title}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <Badge tone="primary">
                  {activities.gamelabBadgePrefix} {featuredGame.year}
                </Badge>
                <h3 className="font-display text-xl font-semibold text-text">{featuredGame.title}</h3>
                {featuredGame.description && (
                  <p className="text-text-muted text-sm whitespace-pre-line">{featuredGame.description}</p>
                )}
              </div>
            </Panel>
          )}

          {featuredEvent && (
            <Panel hover className="overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] bg-bg">
                <Image
                  src={featuredEvent.images[0]}
                  alt={featuredEvent.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <Badge tone="accent">{activities.eventBadge}</Badge>
                <h3 className="font-display text-xl font-semibold text-text">{featuredEvent.name}</h3>
                <p className="text-text-muted text-sm whitespace-pre-line">{featuredEvent.description}</p>
              </div>
            </Panel>
          )}
        </div>
      </Container>
    </section>
  );
}
