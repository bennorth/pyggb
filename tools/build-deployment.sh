#!/bin/bash

cd_or_fail() { cd "$1" || exit 1; }

node_version=$(node --version)
if [ "$(echo "$node_version" | grep -c -E '^v18[.]')" -ne 1 ]; then
    echo Need node v18 but have "$node_version"
    exit 1
fi

PUBLIC_URL=/pyggb
export PUBLIC_URL

REPO_ROOT=$(cd_or_fail "$(dirname "$0")"; cd_or_fail ..; pwd -P)
cd_or_fail "$REPO_ROOT"

npm run build
