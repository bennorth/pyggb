#!/bin/bash

set -e

REPO_ROOT="$(dirname "$(realpath "$0")")"
GGB_BUNDLE_URL=https://download.geogebra.org/package/geogebra-math-apps-bundle
DEPLOYGGB_PATH=public/vendor/geogebra/deployggb.js
VENDOR_BUNDLE_PATH=public/vendor/geogebra/GeoGebra

cd "$REPO_ROOT"

########################################################################

have_all_tools=yes
for tool in git unzip curl ; do
    if ! hash "$tool" 2> /dev/null; then
        echo Could not find "$tool"
        have_all_tools=no
    fi
done

if [ "$have_all_tools" = "no" ]; then
    echo
    echo "Required tool/s missing.  Please install it/them and try again."
    exit 1
fi


########################################################################

js_status=$(git status --porcelain -- "$DEPLOYGGB_PATH")
if [ -n "$js_status" ]; then
    echo Not clean in git: "$DEPLOYGGB_PATH"
    exit 1
fi

if [ -d "$VENDOR_BUNDLE_PATH" ]; then
    echo Already exists: "$VENDOR_BUNDLE_PATH"
    exit 1
fi


########################################################################

WORKDIR=$(mktemp -d -t ggb-bundle-XXXXXXXXXXXX)

(
    cd "$WORKDIR"
    curl -s -o ggb.zip -L "$GGB_BUNDLE_URL"
    if ! [ -r ggb.zip ]; then
        echo Failed to fetch
        exit 1
    fi

    unzip -q ggb.zip
    mv GeoGebra "$REPO_ROOT"/"$VENDOR_BUNDLE_PATH"
)

mv public/vendor/geogebra/GeoGebra/deployggb.js public/vendor/geogebra

echo You can run "rm -r $WORKDIR" to clean up
