import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import PageHeader from "@/app/components/ui/PageHeader";
import Panel from "@/app/components/ui/Panel";
import { SOCIAL_ICONS } from "@/app/components/ui/SocialIcons";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const site = await getTranslations({ locale, namespace: "site" });
  return { title: t("eyebrow"), description: `${t("description")} — ${site("email")}` };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const site = await getTranslations({ locale, namespace: "site" });
  const address = site.raw("address");
  const social = site.raw("social");

  return (
    <div className="pb-24">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <section className="py-16">
        <Container className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Panel className="p-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-text-faint mb-2">{t("emailHeading")}</h2>
              <a href={`mailto:${site("email")}`} className="text-lg text-primary-300 hover:underline break-all">
                {site("email")}
              </a>
            </Panel>

            <Panel className="p-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-text-faint mb-2">{t("addressHeading")}</h2>
              <p className="text-text">
                {address.room}, {address.line1}
                <br />
                {address.line2}
              </p>
            </Panel>

            <Panel className="p-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-text-faint mb-3">{t("socialHeading")}</h2>
              <div className="flex flex-wrap gap-4">
                {social.map(({ key, label, url }) => {
                  const Icon = SOCIAL_ICONS[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-text-muted hover:text-primary-300"
                    >
                      {Icon && <Icon size={20} />}
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            </Panel>
          </div>

          <Panel className="overflow-hidden min-h-[320px]">
            <iframe
              title={t("mapTitle")}
              src={site("mapEmbedUrl")}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Panel>
        </Container>
      </section>
    </div>
  );
}
