/** Join class names; falsy values omitted */
export function cn(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ')
}
