import { cn } from "@/lib/cn";

/**
 * Small pill label. `tone` maps to a `--color-*` token so sponsor
 * tiers (gold/silver/bronze) and brand accents share one component.
 */
const TONES = {
  primary: "text-primary-300 border-primary-700 bg-primary-900/40",
  accent: "text-accent-300 border-accent-700 bg-accent-700/20",
  "tier-gold": "text-tier-gold border-tier-gold/40 bg-tier-gold/10",
  "tier-silver": "text-tier-silver border-tier-silver/40 bg-tier-silver/10",
  "tier-bronze": "text-tier-bronze border-tier-bronze/40 bg-tier-bronze/10",
  neutral: "text-text-muted border-border-strong bg-surface-2",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        TONES[tone] ?? TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
