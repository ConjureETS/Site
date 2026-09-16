import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import PageHeader from "@/app/components/ui/PageHeader";
import Badge from "@/app/components/ui/Badge";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sponsors" });
  return { title: t("eyebrow"), description: t("description") };
}

// Tile sizing scales with rank: bronze = small, silver = bigger, gold = biggest.
const TIER_SIZES = {
  or: {
    grid: "grid-cols-1 sm:grid-cols-2",
    tile: "p-12",
    imageSize: 320,
  },
  argent: {
    grid: "grid-cols-2 sm:grid-cols-3",
    tile: "p-8",
    imageSize: 220,
  },
  bronze: {
    grid: "grid-cols-3 sm:grid-cols-4",
    tile: "p-5",
    imageSize: 140,
  },
};

function SponsorGrid({ tier, t }) {
  if (!tier.sponsors.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-text-faint italic">
        {t("emptyTemplate", { tier: tier.label.toLowerCase() })}
      </div>
    );
  }

  const size = TIER_SIZES[tier.key] ?? TIER_SIZES.bronze;

  return (
    <div className={`grid ${size.grid} gap-6`}>
      {tier.sponsors.map((sponsor) => (
        <a
          key={sponsor.name}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={sponsor.name}
          className={`group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-border ${size.tile} transition-all duration-200 hover:border-border-strong hover:-translate-y-0.5 ${
            sponsor.darkBg ? "bg-bg" : "bg-white"
          }`}
        >
          <Image
            src={sponsor.logo}
            alt={sponsor.name}
            width={size.imageSize}
            height={size.imageSize / 2}
            className="max-h-full max-w-full object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          {sponsor.description && (
            <p className="text-center text-xs text-text-faint italic">{sponsor.description}</p>
          )}
        </a>
      ))}
    </div>
  );
}

export default async function SponsorsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sponsors" });
  const tiers = t.raw("tiers");

  return (
    <div className="pb-24">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <section className="py-20">
        <Container className="flex flex-col gap-16">
          {tiers.map((tier) => (
            <div key={tier.key}>
              <Badge tone={tier.colorVar} className="mb-6">{tier.label}</Badge>
              <SponsorGrid tier={tier} t={t} />
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
