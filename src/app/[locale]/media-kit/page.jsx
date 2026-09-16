import Image from "next/image";
import { HiDownload } from "react-icons/hi";
import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import PageHeader from "@/app/components/ui/PageHeader";
import Panel from "@/app/components/ui/Panel";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediaKit" });
  return { title: t("title"), description: t("intro") };
}

export default async function MediaKitPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mediaKit" });
  const logos = t.raw("logos");
  const colors = t.raw("colors");
  const typography = t.raw("typography");

  return (
    <div className="pb-24">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("intro")} />

      <section className="py-20 border-b border-border">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-text mb-8">{t("logosHeading")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {logos.map((logo) => (
              <Panel key={logo.png} className="overflow-hidden flex flex-col">
                <div
                  className={`flex items-center justify-center p-8 ${
                    logo.surface === "dark" ? "bg-bg" : "bg-white"
                  }`}
                >
                  <Image src={logo.png} alt={logo.label} width={220} height={70} style={{ width: "100%", height: "auto" }} />
                </div>
                <div className="p-4 border-t border-border">
                  <span className="text-sm text-text-muted">{logo.label}</span>
                </div>
                <div className="border-t border-border divide-y divide-border">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-xs text-text">
                      PNG <span className="text-text-faint font-mono">· {logo.resolution}</span>
                    </span>
                    <a
                      href={logo.png}
                      download
                      aria-label={`${t("downloadLabel")} PNG`}
                      className="shrink-0 p-1.5 -m-1.5 rounded-md text-primary-300 hover:bg-surface-2 hover:text-primary-300"
                    >
                      <HiDownload size={16} />
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-xs text-text">SVG</span>
                    <a
                      href={logo.svg}
                      download
                      aria-label={`${t("downloadLabel")} SVG`}
                      className="shrink-0 p-1.5 -m-1.5 rounded-md text-primary-300 hover:bg-surface-2 hover:text-primary-300"
                    >
                      <HiDownload size={16} />
                    </a>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 border-b border-border">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text mb-8">{t("colorsHeading")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {colors.map((color) => (
                <div key={color.hex} className="rounded-xl border border-border overflow-hidden">
                  <div className={`h-20 ${color.className}`} />
                  <div className="p-3 bg-surface">
                    <div className="text-sm text-text">{color.name}</div>
                    <div className="text-xs text-text-faint font-mono">{color.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-text mb-8">{t("typographyHeading")}</h2>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wide text-text-faint mb-1">
                {t("typographyFieldLabel")}
              </div>
              <div className="text-2xl text-text">{typography.name}</div>
              <p className="text-sm text-text-muted mt-3">{typography.usage}</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
