import { cn } from "@/lib/cn";

/**
 * Centered max-width content wrapper. Use this instead of repeating
 * `max-w-*xl mx-auto px-4` on every page — one place to change the
 * site's content width.
 */
export default function Container({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </Tag>
  );
}
