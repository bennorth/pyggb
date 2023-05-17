# Development notes

## Release process

For deploying to `github.io`:

``` shell
./tools/build-examples.sh
PUBLIC_URL=/pyggb npm run build
rsync --exclude=.git --exclude vendor/geogebra/GeoGebra --delete --checksum -nrtv build/ pages/
# Then if that looks OK, same without "-nv":
rsync --exclude=.git --exclude vendor/geogebra/GeoGebra --delete --checksum -rt build/ pages/
# Commit in pages/ worktree
# Push to GitHub
# Wait a few minutes
```

## Build from fresh clone

For deploying to `https://some.site.com/python`:

``` shell
# If default "node" is not v18, something like:
nvm use v18

# Adjust PYGGB_ORIGIN_REPO if required:
PYGGB_ORIGIN_REPO=https://github.com/geogebra/pyggb.git ./tools/build-from-clone.sh
```

The script, if successful, will finish by printing a summary to
stdout, including printing a docker command line to serve the
directory via Nginx.

If deployment will be a path other than `python`, you can override
this via the `PYGGB_HOSTED_BASE_PATH` environment variable:

``` shell
PYGGB_ORIGIN_REPO=https://github.com/geogebra/pyggb.git \
    PYGGB_HOSTED_BASE_PATH=pyggb \
    ./tools/build-from-clone.sh
```


## Where to get GeoGebra bundle

A recent copy of `deployggb.js` is checked in to the repo. By default, the app
uses GeoGebra's CDN to provide the main files. To override this for local
development, fetch the latest GeoGebra bundle from the GeoGebra site:

- [GeoGebra Math Apps Bundle](https://download.geogebra.org/package/geogebra-math-apps-bundle)

as per [GeoGebra's
instructions](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding#Offline_and_Self-Hosted_Solution).
Unzip this into `public/vendor/geogebra`, which will result in a directory
`public/vendor/geogebra/GeoGebra`. It will also result in a file
`public/vendor/geogebra/README.txt`, which can be removed. Then run the
development server with

``` shell
REACT_APP_LOCAL_GEOGEBRA=yes npm start
```

To avoid the contents of this bundle showing up as untracked files in Git, add a
line to your local `.git/info/exclude` file:

``` shell
public/vendor/geogebra/GeoGebra
```

The above "Release process" instructions refer to this vendor bundle,
but should work whether or not you are using a local copy of the
bundle.


## Use of Piwik tracking code

The tracking code is disabled while developing.  This is detected by
asking whether the location is `localhost:3000`.  See comment in
`index.html` for details.
