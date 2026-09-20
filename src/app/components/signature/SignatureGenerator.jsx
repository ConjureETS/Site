"use client";

import { useMemo, useState } from "react";
import Panel from "@/app/components/ui/Panel";
import Button from "@/app/components/ui/Button";

const DEFAULT_NAME = "John Doe";
const DEFAULT_ROLE = "VP Partenariat | VP Sponsors";

const EMAIL = "conjure@etsmtl.ca";
const SITE_URL = "https://conjure.etsmtl.ca";
const SITE_LABEL = "conjure.etsmtl.ca";

const SOCIAL_LINKS = [
  { key: "itchio", label: "itch.io", url: "https://conjure.itch.io/", icon: "itchio.png" },
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com/conjure_ets/", icon: "instagram.png" },
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/conjure-ets/", icon: "linkedin.png" },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Builds the literal HTML that gets pasted into an email client. Table
 * layout + pt-based inline styles + no external CSS is intentional: it's
 * the only markup shape Outlook's Word rendering engine reproduces
 * faithfully. `origin` is blank for the on-page preview (relative paths
 * resolve fine in-app) and window.location.origin at copy time, since a
 * pasted email needs fully-qualified image URLs.
 */
function buildSignatureHtml({ name, role, origin }) {
  const asset = (file) => `${origin}/signature/${file}`;
  const safeName = escapeHtml(name.trim() || DEFAULT_NAME);
  const safeRole = escapeHtml(role.trim() || DEFAULT_ROLE);

  const socialCells = SOCIAL_LINKS.map(
    ({ label, url, icon }) => `
                <td style="text-align:left;width:36pt;padding:0.75pt 6pt 0.75pt 0;box-sizing:border-box;">
                  <a href="${url}" style="margin:0;" target="_blank" rel="noopener noreferrer">
                    <img style="width:28px;height:28px;max-width:100%;margin:0;" src="${asset(icon)}" alt="${label}" />
                  </a>
                </td>`
  ).join("");

  return `<table id="signature" style="color: rgb(36, 36, 36) !important; text-align: left; background-color: white !important; border-spacing: 0px; border-collapse: collapse; box-sizing: border-box;" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td style="text-align:left;width:180.65pt;height:140.4pt;padding:0.75pt 7.5pt 0.75pt 0.75pt;border-right:1.5pt solid darkgray;box-sizing:border-box;word-break:break-word;">
        <p style="font-size:12pt;font-family:Aptos,sans-serif;text-align:center;margin:0;">
          <span style="color: black !important;">
            <img style="width:195.49pt;height:59.99pt;margin:0;" src="${asset("logo.png")}" alt="Conjure" />
          </span>
        </p>
      </td>
      <td style="text-align:left;width:165.25pt;height:140.4pt;padding:0.75pt 0.75pt 0.75pt 7.5pt;box-sizing:border-box;word-break:break-word;">
        <table style="text-align:left;border-spacing:0;border-collapse:collapse;box-sizing:border-box;" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td style="text-align:left;width:183.15pt;height:16.5pt;padding:0.75pt;box-sizing:border-box;">
                <p style="font-size:12pt;font-family:Aptos,sans-serif;text-align:left;margin:0;">
                  <span style="color: black !important;"><b>${safeName}</b></span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:left;width:183.15pt;height:33.3pt;padding:0.75pt 0.75pt 3.75pt 0.75pt;word-break:break-word;">
                <p style="font-size:12pt;font-family:Aptos,sans-serif;text-align:left;margin:0;">
                  <span style="color: black !important;"><b>${safeRole}</b></span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:left;width:183.15pt;height:27.9pt;padding:0.75pt;word-break:break-word;">
                <p style="font-size:12pt;font-family:Aptos,sans-serif;text-align:left;margin:0;">
                  <span style="color: black !important;">Courriel: <u><a style="color: black !important; margin: 0px;" href="mailto:${EMAIL}">${EMAIL}</a></u></span>
                </p>
                <p style="font-size:12pt;font-family:Aptos,sans-serif;text-align:left;margin:0;">
                  <span style="color: black !important;">Site: &nbsp;<u><a style="color: black !important; margin: 0px;" href="${SITE_URL}">${SITE_LABEL}</a></u></span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:left;width:173.55pt;height:35.4pt;padding:3.75pt 0.75pt 0.75pt 0.75pt;word-break:break-word;">
                <table style="text-align:left;border-spacing:0;border-collapse:collapse;box-sizing:border-box;" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>${socialCells}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

export default function SignatureGenerator() {
  const [name, setName] = useState(DEFAULT_NAME);
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [status, setStatus] = useState("idle");

  const previewHtml = useMemo(() => buildSignatureHtml({ name, role, origin: "" }), [name, role]);

  const handleCopy = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const html = buildSignatureHtml({ name, role, origin });
    const plainName = name.trim() || DEFAULT_NAME;
    const plainRole = role.trim() || DEFAULT_ROLE;
    const text = `${plainName}\n${plainRole}\nCourriel : ${EMAIL}\nSite : ${SITE_LABEL}`;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      setStatus("copied");
    } catch (err) {
      console.error("Failed to copy signature:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Panel className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="nameInput" className="block text-xs uppercase tracking-[0.2em] text-text-faint mb-2">
              Nom
            </label>
            <input
              id="nameInput"
              name="nameInput"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setStatus("idle");
              }}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-text focus:outline-none focus:border-primary-400"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="roleInput" className="block text-xs uppercase tracking-[0.2em] text-text-faint mb-2">
              Rôle
            </label>
            <input
              id="roleInput"
              name="roleInput"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setStatus("idle");
              }}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-text focus:outline-none focus:border-primary-400"
            />
          </div>
          <Button type="button" onClick={handleCopy} className="shrink-0">
            Copier
          </Button>
        </div>
        {status === "copied" && (
          <p className="mt-3 text-sm text-primary-300">Signature copiée dans le presse-papiers.</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">Échec de la copie, veuillez réessayer.</p>
        )}
      </Panel>

      <Panel className="p-6 overflow-x-auto">
        {/* Rendered from the exact same HTML string that gets copied, so the
            preview is never out of sync with what lands in the email. */}
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </Panel>
    </div>
  );
}
