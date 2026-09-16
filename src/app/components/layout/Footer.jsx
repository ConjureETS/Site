import Image from "next/image";
import { getTranslations } from "next-intl/server";

import Container from "@/app/components/ui/Container";
import { SOCIAL_ICONS } from "@/app/components/ui/SocialIcons";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations();
  const site = t.raw("site");
  const navbar = t.raw("navbar");
  const common = t.raw("common");
  const flatLinks = navbar.flatMap((item) => (item.items ? item.items : [item]));

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12 grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-flex w-fit">
            <Image
              src="/conjure/conjure_blanc.png"
              alt="Conjure"
              width={160}
              height={34}
              style={{ width: "140px", height: "auto" }}
            />
          </Link>
          <p className="text-sm text-text-muted max-w-xs">
            {site.tagline} — {site.school}, {site.foundedYear}.
          </p>
          <div className="flex items-center gap-5">
            {site.social.map(({ key, label, url }) => {
              const Icon = SOCIAL_ICONS[key];
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Conjure — ${label}`}
                  className="text-text-muted hover:text-primary-300 transition-colors"
                >
                  {Icon && <Icon size={20} />}
                </a>
              );
            })}
          </div>
        </div>

        <nav aria-label={common.footer.navigationHeading}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">
            {common.footer.navigationHeading}
          </span>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 list-none">
            {flatLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-text-muted hover:text-primary-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">
            {common.footer.contactHeading}
          </span>
          <div className="mt-4 flex flex-col gap-2 text-sm text-text-muted">
            <a href={`mailto:${site.email}`} className="hover:text-primary-300 w-fit">
              {site.email}
            </a>
            <span>{site.address.room}, {site.address.line1}</span>
            <span>{site.address.line2}</span>
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-5 text-center text-xs text-text-faint">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Conjure. {common.footer.rights}
        </Container>
      </div>
    </footer>
  );
}
