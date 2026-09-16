import Container from "@/app/components/ui/Container";
import SectionHeading from "@/app/components/ui/SectionHeading";

/**
 * Shared header band for every inner page (About, Events, Games,
 * Sponsors, Contact, Media kit) — was previously copy-pasted into
 * each page with a background fade (a masked grid) that faded out
 * partway down and happened to land across the description text,
 * reading as a glitch rather than a design choice.
 *
 * Here the grid texture is flat/uniform (no fade of its own — see
 * .bg-grid in globals.css) and the only fade is a deliberate glow
 * anchored to a corner, well clear of the text column, plus the
 * section's bottom border to end it cleanly.
 */
export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(900px 420px at 10% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 65%)",
        }}
      />
      <Container className="relative pt-16 pb-14 sm:pt-20 sm:pb-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {children}
      </Container>
    </section>
  );
}
