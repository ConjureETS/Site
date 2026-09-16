import { FaCheck } from "react-icons/fa";
import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import PageHeader from "@/app/components/ui/PageHeader";
import Panel from "@/app/components/ui/Panel";
import Button from "@/app/components/ui/Button";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("eyebrow"), description: t("intro") };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const benefits = t.raw("membership.benefits");
  const discordUrl = (await getTranslations({ locale, namespace: "site" })).raw("social")
    .find((s) => s.key === "discord")?.url;

  return (
    <div className="pb-24">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("intro")} />

      <section className="py-20 border-b border-border">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text mb-4">{t("historyHeading")}</h2>
            <p className="text-text-muted leading-relaxed">{t("history")}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-text mb-4">{t("membership.title")}</h2>
            <p className="text-text-muted leading-relaxed mb-6">{t("membership.description")}</p>
            <ul className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-900/60 text-primary-300">
                    <FaCheck size={10} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Panel className="p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h2 className="font-display text-2xl font-semibold text-text">{t("ctaTitle")}</h2>
              <p className="text-text-muted mt-2">{t("ctaText")}</p>
            </div>
            <Button href={discordUrl} external size="lg" className="shrink-0">
              {t("ctaButton")}
            </Button>
          </Panel>
        </Container>
      </section>
    </div>
  );
}
