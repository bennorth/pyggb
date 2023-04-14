#!/bin/bash

# Abandon whole script if any error, including failed "cd":
set -e


########################################################################

: "${PYGGB_ORIGIN_REPO:?}"
: "${PYGGB_HOSTED_BASE_PATH:=python}"

have_all_tools=yes
for tool in grep mktemp rsync node npm git python3; do
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

node_version=$(node --version)
if [ "$(echo "$node_version" | grep -c -E '^v18[.]')" -ne 1 ]; then
    echo Need node v18 but have "$node_version"
    exit 1
fi


########################################################################

workdir=$(mktemp -d)
cd "$workdir"
echo Working in "$workdir"

git clone "${PYGGB_ORIGIN_REPO:?}" repo

(
    cd repo
    npm clean-install
    ./tools/build-examples.sh
    PUBLIC_URL=/"$PYGGB_HOSTED_BASE_PATH" npm run build
)

mkdir www
rsync -r repo/build/ www/"$PYGGB_HOSTED_BASE_PATH"


########################################################################

echo "Built files have been left in (a \"${PYGGB_HOSTED_BASE_PATH}\" subdir of)"
echo
echo "${workdir}/www"
echo
echo "If you have docker installed, you can serve this build by running"
echo
echo "docker run --rm -v \"${workdir}/www\":/usr/share/nginx/html:ro -p 80:80/tcp nginx"
