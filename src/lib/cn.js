/**
 * Joins class names, skipping falsy values.
 * Small local replacement for `clsx` — not worth a dependency for this.
 *
 * @param  {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}