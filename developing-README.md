# Development notes

## Release process

```
PUBLIC_URL=/pyggb npm run build
rsync --exclude=.git --exclude vendor/geogebra/GeoGebra --delete --checksum -nrtv build/ pages/
# Then if that looks OK, same without "-nv":
rsync --exclude=.git --exclude vendor/geogebra/GeoGebra --delete --checksum -rt build/ pages/
# Commit in pages/ worktree
# Push to GitHub
# Wait a few minutes
```

## Where to get GeoGebra bundle

A recent copy of `deployggb.js` is checked in to the repo. By default, the app
uses GeoGebra's CDN to provide the main files. To override this for local
development, fetch the latest GeoGebra bundle from

- [https://download.geogebra.org/package/geogebra-math-apps-bundle]

as per [GeoGebra's
instructions](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding#Offline_and_Self-Hosted_Solution).
Unzip this into `public/vendor/geogebra`, which will result in a directory
`public/vendor/geogebra/GeoGebra`. It will also result in a file
`public/vendor/geogebra/README.txt`, which can be removed. Then run the
development server with

```
REACT_APP_LOCAL_GEOGEBRA=yes npm start
```

To avoid the contents of this bundle showing up as untracked files in Git, add a
line to your local `.git/info/exclude` file:

```
public/vendor/geogebra/GeoGebra
```

The above "Release instructions" refer to this vendor bundle, but
should work whether or not you are using a local copy of the bundle.
