import { getTranslations } from "next-intl/server";
import Button from "@/app/components/ui/Button";
import Container from "@/app/components/ui/Container";

export default async function Hero() {
  const t = await getTranslations();
  const hero = t.raw("home.hero");
  const social = t.raw("site.social");
  const discordUrl = social.find((s) => s.key === "discord")?.url;

  return (
    <header className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-bg">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-45"
        src={hero.video}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grid" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,8,11,0.55) 0%, rgba(7,8,11,0.75) 55%, rgba(7,8,11,0.98) 100%)",
        }}
      />

      <Container className="relative z-10 py-28 sm:py-32">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-medium tracking-[0.15em] uppercase text-primary-300">
            <span className="text-text-faint">// </span>
            {hero.eyebrow}
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-text text-balance">
            {hero.title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-xl leading-relaxed">{hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={discordUrl} external size="lg">
              {hero.ctaPrimaryLabel}
            </Button>
            <Button href={hero.ctaSecondaryHref} variant="outline" size="lg">
              {hero.ctaSecondaryLabel}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
