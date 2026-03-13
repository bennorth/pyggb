// https://www.falldowngoboone.com/blog/share-variables-between-javascript-and-css/

import { Action, action, State } from "easy-peasy";

export function cssValue(property: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export const fullUrlWithinApp = (urlWithinApp: string) => {
  const prefix = import.meta.env.BASE_URL;

  // BASE_URL should either be "/" or "/some/multi-component/path/",
  // so should always end with exactly one "/".
  const oneTrailingSlash = new RegExp("(^|[^/])/$");
  if (!prefix.match(oneTrailingSlash)) {
    throw new Error(`BASE_URL "${prefix}" does not end with exactly one '/'`);
  }

  // Similarly, `path` should start with exactly one "/".
  const oneLeadingSlash = new RegExp("^/($|[^/])");
  if (!urlWithinApp.match(oneLeadingSlash)) {
    throw new Error(
      `urlWithinApp "${urlWithinApp}" does not start with exactly one '/'`
    );
  }

  // Now we can correctly join the parts.
  const pathTail = urlWithinApp.substring(1);
  const fullPath = `${prefix}${pathTail}`;

  return fullPath;
};

// Currently this is not used in any meaningful way.  The idea was to be
// able to have the docs at a location whose path included some kind of
// version identifier (e.g., the git commit SHA).  But that would mean
// links to pages of the docs were not stable as we release new
// versions.  For now, the env.var is always just "doc", but leaving
// this code here in case we want to revisit in future.
export const fullUrlWithinDocs = (relativeUrl: string) => {
  const mUrl = import.meta.env.VITE_DOCS_BASE_URL_WITHIN_APP;
  if (mUrl == null) {
    throw new Error("Env.var VITE_DOCS_BASE_URL_WITHIN_APP not set");
  }

  const urlWithinApp = `${mUrl}/${relativeUrl}`;
  return fullUrlWithinApp(urlWithinApp);
};

export const fetchAsText = async (urlWithinApp: string) => {
  const url = fullUrlWithinApp(urlWithinApp);

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
  PropNameT extends keyof State<ModelT>,
>(propName: PropNameT): Action<ModelT, State<ModelT>[PropNameT]> {
  return action((s, val) => {
    s[propName] = val;
  });
}

export function propSetterNonNullAction<
  ModelT extends object,
  PropNameT extends keyof State<ModelT>,
>(propName: PropNameT): Action<ModelT, NonNullable<State<ModelT>[PropNameT]>> {
  return action((s, val) => {
    s[propName] = val;
  });
}

export const delaySeconds = (nSeconds: number) => {
  const timeoutMs = 1000.0 * nSeconds;
  return new Promise((r) => setTimeout(r, timeoutMs));
};

export const nullaryEventHandler = (f: (...args: any) => any) => () => f();

// To allow testing to hook into various aspects of behaviour:
const PYGGB_CYPRESS_default = {};
export const PYGGB_CYPRESS = () => {
  if ((window as any).PYGGB_CYPRESS == null) {
    (window as any).PYGGB_CYPRESS = PYGGB_CYPRESS_default;
  }
  return (window as any).PYGGB_CYPRESS;
};
