// https://www.falldowngoboone.com/blog/share-variables-between-javascript-and-css/

export function cssValue(property: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}
