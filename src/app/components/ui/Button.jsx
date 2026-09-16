import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const VARIANTS = {
  primary: "bg-primary text-white border border-primary-400/40 hover:bg-primary-600 active:bg-primary-700",
  outline: "border border-border-strong text-text hover:border-primary-400 hover:text-primary-300",
  ghost: "text-text-muted hover:text-text",
};

const SIZES = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

/**
 * Single button/link component for every CTA in the app.
 * Renders a <Link> when `href` is set, otherwise a <button>.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-200 cursor-pointer",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (href) {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <Link href={href} className={classes} {...externalProps} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
