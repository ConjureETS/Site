import { cn } from "@/lib/cn";

/**
 * Elevated surface used for cards throughout the site (games, events,
 * offerings, contact block, ...). Keeping one Panel component means
 * "make cards look different" is a one-file change.
 */
export default function Panel({ as: Tag = "div", hover = false, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-border bg-surface",
        hover && "transition-all duration-200 hover:border-border-strong hover:bg-surface-2",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
