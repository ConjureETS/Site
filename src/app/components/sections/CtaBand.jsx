import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import Button from "@/app/components/ui/Button";

export default async function CtaBand() {
  const t = await getTranslations();
  const cta = t.raw("home.cta");
  const social = t.raw("site.social");
  const discordUrl = social.find((s) => s.key === "discord")?.url;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid" aria-hidden="true" />
      <Container className="relative z-10 flex flex-col items-center text-center gap-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text max-w-2xl text-balance">
          {cta.title}
        </h2>
        <p className="text-text-muted max-w-xl">{cta.text}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={discordUrl} external size="lg">
            {cta.discordButton}
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            {cta.contactButton}
          </Button>
        </div>
      </Container>
    </section>
  );
}
