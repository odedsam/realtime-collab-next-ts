export function formatFullName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Zא-ת\s'-]/g, '')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
