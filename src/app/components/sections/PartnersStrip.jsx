import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import { Link } from "@/i18n/navigation";

export default async function PartnersStrip() {
  const t = await getTranslations();
  const tiers = t.raw("sponsors.tiers");
  const partners = t.raw("home.partners");
  const featured = tiers.flatMap((tier) => tier.sponsors);
  if (featured.length === 0) return null;

  return (
    <section className="py-16 border-b border-border">
      <Container className="flex flex-col items-center gap-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">{partners.kicker}</span>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {featured.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={sponsor.name}
              className={`flex h-20 w-40 items-center justify-center rounded-xl border border-border p-4 transition-all duration-200 hover:border-border-strong hover:-translate-y-0.5 ${
                sponsor.darkBg ? "bg-bg" : "bg-white"
              }`}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={140}
                height={64}
                className="max-h-full max-w-full object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </a>
          ))}
        </div>
        <Link href="/sponsors" className="text-sm text-primary-300 hover:underline">
          {partners.viewAll}
        </Link>
      </Container>
    </section>
  );
}
