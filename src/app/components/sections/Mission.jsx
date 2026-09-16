import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import SectionHeading from "@/app/components/ui/SectionHeading";

function countGamelabGames(gamelabGames) {
  return Object.values(gamelabGames).reduce((total, list) => total + list.length, 0);
}

export default async function Mission() {
  const t = await getTranslations();
  const mission = t.raw("home.mission");
  const foundedYear = t.raw("site.foundedYear");
  const gamelabGames = t.raw("games.gamelab.games");
  const sponsorTiers = t.raw("sponsors.tiers");

  const yearsActive = new Date().getFullYear() - foundedYear;
  const gamelabYears = Object.keys(gamelabGames).length;
  const partnersCount = sponsorTiers.reduce((total, tier) => total + tier.sponsors.length, 0);

  const stats = [
    { label: mission.stats.years, value: `${yearsActive}+` },
    { label: mission.stats.gamelabGames, value: `${countGamelabGames(gamelabGames)}` },
    { label: mission.stats.gamelabEditions, value: `${gamelabYears}` },
    { label: mission.stats.partners, value: `${partnersCount}` },
  ];

  return (
    <section className="py-24 border-b border-border">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <SectionHeading eyebrow={mission.eyebrow} title={mission.title} description={mission.text} />

        {/* gap-px + bg-border draws hairline dividers between cells in both directions */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-bg p-6">
              <dd className="font-display text-3xl font-semibold text-primary-300">{stat.value}</dd>
              <dt className="mt-1 text-xs text-text-faint">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
