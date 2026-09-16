import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import PageHeader from "@/app/components/ui/PageHeader";
import Panel from "@/app/components/ui/Panel";
import GamesCarousel from "@/app/components/games/GamesCarousel";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "games" });
  return { title: t("title"), description: t("description") };
}

export default async function GamesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "games" });
  const gamelab = t.raw("gamelab");
  const gameJams = t.raw("gameJams");
  const labels = t.raw("labels");
  const carouselLabels = (await getTranslations({ locale, namespace: "common" })).raw("carousel");
  const gamelabYears = Object.entries(gamelab.games).sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="pb-24">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <section className="py-20 border-b border-border">
        <Container>
          <h2 className="font-display text-3xl font-semibold text-text mb-8">{gamelab.title}</h2>

          <div className="grid gap-8 lg:grid-cols-2 mb-14">
            <Panel className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-text mb-3">{gamelab.whatIsTitle}</h3>
              {gamelab.whatIsParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-text-muted leading-relaxed ${i < gamelab.whatIsParagraphs.length - 1 ? "mb-4" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </Panel>

            <Panel className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-text mb-3">{gamelab.participateTitle}</h3>
              <p className="text-text-muted leading-relaxed mb-3">{gamelab.participateIntro}</p>
              <ul className="list-disc list-inside text-text-muted space-y-1 mb-4">
                {gamelab.participateList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold text-text mb-2">{gamelab.benefitsTitle}</h3>
              <p className="text-text-muted leading-relaxed">{gamelab.benefitsText}</p>
            </Panel>
          </div>

          {gamelabYears.length === 0 ? (
            <div className="text-center text-text-faint italic py-12">{gamelab.emptyText}</div>
          ) : (
            gamelabYears.map(([year, yearGames]) => (
              <div key={year} className="mb-12 last:mb-0">
                <h3 className="font-display text-xl font-semibold text-text mb-5">{year}</h3>
                <GamesCarousel games={yearGames} learnMoreLabel={labels.learnMore} carouselLabels={carouselLabels} />
              </div>
            ))
          )}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="font-display text-3xl font-semibold text-text mb-8">{gameJams.title}</h2>
          {gameJams.items.length === 0 ? (
            <div className="text-center text-text-faint italic py-12">{gameJams.emptyText}</div>
          ) : (
            gameJams.items.map((jam) => (
              <div key={jam.name} className="mb-12 last:mb-0">
                {jam.url ? (
                  <a
                    href={jam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-xl font-semibold text-primary-300 hover:underline block mb-1"
                  >
                    {jam.name}
                  </a>
                ) : (
                  <h3 className="font-display text-xl font-semibold text-text mb-1">{jam.name}</h3>
                )}
                <div className="text-sm text-text-faint mb-2">{jam.date}</div>
                <p className="text-text-muted mb-5">{jam.description}</p>
                <GamesCarousel games={jam.games} learnMoreLabel={labels.learnMore} carouselLabels={carouselLabels} />
              </div>
            ))
          )}
        </Container>
      </section>
    </div>
  );
}
