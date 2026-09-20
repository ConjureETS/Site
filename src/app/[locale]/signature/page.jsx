import PageHeader from "@/app/components/ui/PageHeader";
import Container from "@/app/components/ui/Container";
import SignatureGenerator from "@/app/components/signature/SignatureGenerator";

// Internal tool, not part of the public site nav or i18n content — kept
// under [locale] only so it inherits the shared layout/middleware, same
// as it lived at a single /fr/signature route on the old Astro site.
export const metadata = {
  title: "Signature",
  robots: { index: false, follow: false },
};

export default function SignaturePage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Outil interne"
        title="Générateur de signature"
        description="Entrez votre nom et votre rôle, puis copiez la signature pour la coller dans Outlook ou Gmail."
      />
      <section className="py-16">
        <Container className="max-w-3xl">
          <SignatureGenerator />
        </Container>
      </section>
    </div>
  );
}
