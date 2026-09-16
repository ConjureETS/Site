import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained .next/standalone server (only the deps
  // actually used, no full node_modules needed at runtime) — this is
  // what the Dockerfile copies into the production image.
  output: "standalone",
  // next-intl's plugin (below) attaches a webpack() config, but on this
  // Next.js version it doesn't reliably detect that --turbopack is active
  // in time to attach a matching turbopack config — which trips Next's
  // "webpack is configured while Turbopack is not" warning even though
  // Turbopack is the only bundler actually in use. This mirrors, under
  // Turbopack, the same alias next-intl's webpack path sets up: code
  // that imports "next-intl/config" (used internally by next-intl) gets
  // resolved to our actual request config instead of next-intl's stub.
  // An empty `turbopack: {}` doesn't count for Next's check — it needs
  // an actual key present.
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.js",
    },
  },
};

export default withNextIntl(nextConfig);
