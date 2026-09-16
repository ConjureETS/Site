import { getTranslations } from "next-intl/server";
import Container from "@/app/components/ui/Container";
import PageHeader from "@/app/components/ui/PageHeader";
import EventCard from "@/app/components/events/EventCard";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return { title: t("title"), description: t("description") };
}

export default async function EventsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  const items = t.raw("items");
  const carouselLabels = (await getTranslations({ locale, namespace: "common" })).raw("carousel");

  return (
    <div className="pb-24">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <section className="py-20">
        <Container className="flex flex-col gap-10 max-w-4xl">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-text-faint italic">
              {t("emptyText")}
            </div>
          ) : (
            items.map((event) => <EventCard key={event.name} event={event} carouselLabels={carouselLabels} />)
          )}
        </Container>
      </section>
    </div>
  );
}
