// https://www.falldowngoboone.com/blog/share-variables-between-javascript-and-css/

export function cssValue(property: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export const fetchAsText = async (urlWithinApp: string) => {
  const prefixIsNonEmpty = process.env.PUBLIC_URL !== "";
  const maybeSeparator = prefixIsNonEmpty ? "/" : "";
  const url = process.env.PUBLIC_URL + maybeSeparator + urlWithinApp;

  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (e) {
    console.error(`fetchAsText("${urlWithinApp}"):`, url, e);
    return null;
  }
};
