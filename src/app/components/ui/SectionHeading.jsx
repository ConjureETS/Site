import { cn } from "@/lib/cn";

/**
 * Standard section header: monospace "// tag" kicker + display title +
 * optional description. The kicker is a plain code-comment-style tag
 * (no pill/badge chrome) — reads as a lab/engineering label rather
 * than a generic marketing eyebrow.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={cn("flex flex-col gap-3 max-w-2xl", alignClass, className)}>
      {eyebrow && (
        <span className="font-mono text-xs font-medium tracking-[0.15em] uppercase text-primary-300">
          <span className="text-text-faint">// </span>
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text text-balance">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-text-muted text-base sm:text-lg leading-relaxed text-pretty">{description}</p>
      )}
    </div>
  );
}
