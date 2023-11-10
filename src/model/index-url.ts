export function publicIndexUrl(): URL {
  const publicUrl = process.env.PUBLIC_URL;
  const rawDirname = publicUrl === "" ? "/" : publicUrl;
  const dirnameWithSeparator = rawDirname.endsWith("/")
    ? rawDirname
    : `${rawDirname}/`;
  const fullpath = `${dirnameWithSeparator}index.html`;

  let currentUrl = new URL(window.location.href);
  let url = new URL(fullpath, currentUrl.origin);
  return url;
}
