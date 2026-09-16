import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import SectionHeading from "@/app/components/ui/SectionHeading";
import Panel from "@/app/components/ui/Panel";
import { OFFERING_ICONS } from "@/app/components/ui/OfferingIcons";

export default async function Offerings() {
  const t = await getTranslations();
  const offerings = t.raw("home.offerings");
  const items = t.raw("offerings");

  return (
    <section className="py-24 border-b border-border bg-surface/40">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={offerings.eyebrow}
          title={offerings.title}
          className="mx-auto text-center mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((offering, index) => {
            const Icon = OFFERING_ICONS[offering.icon];
            return (
              <Panel key={offering.title} hover className="p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-primary-700 bg-primary-900/30 text-primary-300">
                    {Icon && <Icon size={18} />}
                  </span>
                  <span className="font-mono text-xs text-text-faint">0{index + 1}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-text">{offering.title}</h3>
                <p className="text-text-muted leading-relaxed">{offering.description}</p>
              </Panel>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
