import { Inter, Chakra_Petch } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import ScrollToTopButton from "@/app/components/layout/ScrollToTopButton";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    metadataBase: new URL("https://conjure.etsmtl.ca"),
    title: {
      // Page-specific part first: browser tabs truncate from the right,
      // so the part that's actually unique per page should survive.
      default: `${t("brandName")} - ${t("tagline")}`,
      template: `%s - ${t("brandName")}`,
    },
    description: `${t("name")} — ${t("tagline")}.`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080b",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("common");

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${chakraPetch.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
          >
            {t("skipToContent")}
          </a>
          <Navbar />
          <main id="main-content" className="flex-1 w-full">
            {children}
          </main>
          <ScrollToTopButton label={t("scrollToTop")} />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
