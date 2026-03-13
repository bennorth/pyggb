export function publicIndexUrl(): URL {
  const publicUrl = import.meta.env.BASE_URL;
  const rawDirname = publicUrl === "" ? "/" : publicUrl;
  const dirnameWithSeparator = rawDirname.endsWith("/")
    ? rawDirname
    : `${rawDirname}/`;
  const fullpath = `${dirnameWithSeparator}index.html`;

  let currentUrl = new URL(window.location.href);
  let url = new URL(fullpath, currentUrl.origin);
  return url;
}
