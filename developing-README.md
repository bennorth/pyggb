# Development notes

## Brief outline of design

The design consists of various parts:

### Python implementation

Provided by [Skulpt](https://skulpt.org/), brought in as "vendored" code.

The user's Python code is compiled into JavaScript by Skulpt and run.
A custom module (see below) provides the connection between Python and
GeoGebra, creating GeoGebra objects and wrapping them in a Python
object.

There is a custom `sleep()` implementation, to allow the user to
interrupt program execution and also to allow GeoGebra the chance to
run.

### GeoGebra engine

Brought in via its [embedding
mechanism](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_Embedding)
and using its
[API](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API).

### Python–GeoGebra glue

Via a Skulpt/Python module written in TypeScript.  Various GeoGebra
objects are wrapped so that Python-level access is possible.

### Webapp

The front-end, written using React, with
[easy-peasy](https://easy-peasy.vercel.app/) for state management.
User's files are persisted using in-browser IndexedDB storage.


## Running for development

The script

``` shell
dev-server.sh
```

at the top level of this repo will build the docs, link to them from
the `public` directory, and launch the development live-reload server.
This requires `poetry`; the script will point you to installation docs
if needed.


## Release process

For deploying to `github.io`, assuming a git worktree `./pages/`
checked out on the branch `github-pages`:

``` shell
./tools/build-examples.sh
PUBLIC_URL=/pyggb npm run build
rsync --exclude='*~' --exclude=.git --exclude=vendor/geogebra/GeoGebra --delete --checksum -rtvn build/ pages/
# Then if that looks OK, same without "vn" options:
rsync --exclude='*~' --exclude=.git --exclude=vendor/geogebra/GeoGebra --delete --checksum -rt build/ pages/

( cd doc; poetry run make clean && poetry run make html )
rsync --delete --checksum -rt doc/build/html/ pages/doc

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
/public/vendor/geogebra/GeoGebra/
```

The above "Release process" instructions refer to this vendor bundle,
but should work whether or not you are using a local copy of the
bundle.


## Future work

### Wrap the `FitPoly()` command

Generating the command is fairly straightforward, and produces the
correct GeoGebra object.  However, what you get back is a `function`
object, which is not currently wrapped.

### Export project to GeoGebra

A "download as GGB file" feature should not be too difficult to write.

### Investigate inheritance

Is it worth providing common functionality (like setting the colour of
an object, or the label-style and -visibility properties) via a Python
and/or JavaScript base class?  Currently, every object type explicitly
declares the methods it supports.

### Investigate GeoGebra object deletion

Some programs generate large numbers of temporary GeoGebra objects.
There is currently no way to delete them.  Although you can hide them
(by setting `is_visible` to `False`), they do continue to exist, which
slows GeoGebra down.  Skulpt does not support `__del__()` but we could
support an explicit `.delete()` method on wrapped Ggb objects.  Some
care will be needed as to how to handle a Python object wrapping a
deleted Ggb object.
