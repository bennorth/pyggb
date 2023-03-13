// https://www.falldowngoboone.com/blog/share-variables-between-javascript-and-css/

import { Action, action, State } from "easy-peasy";

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

// For exhaustiveness checking, as per TypeScript Handbook.
export const assertNever = (x: never): never => {
  throw Error(`should not be here; got ${x}`);
};

export function propSetterAction<
  ModelT extends object,
  PropNameT extends keyof State<ModelT>
>(propName: PropNameT): Action<ModelT, State<ModelT>[PropNameT]> {
  return action((s, val) => {
    s[propName] = val;
  });
}

export const delaySeconds = (nSeconds: number) => {
  const timeoutMs = 1000.0 * nSeconds;
  return new Promise((r) => setTimeout(r, timeoutMs));
};

// To allow testing to hook into various aspects of behaviour:
const PYGGB_CYPRESS_default = {};
export const PYGGB_CYPRESS = () => {
  if ((window as any).PYGGB_CYPRESS == null) {
    (window as any).PYGGB_CYPRESS = PYGGB_CYPRESS_default;
  }
  return (window as any).PYGGB_CYPRESS;
};
