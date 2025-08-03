export function formatFullName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Zא-ת\s'-]/g, '')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
