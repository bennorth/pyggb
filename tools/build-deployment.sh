#!/bin/bash

cd_or_fail() { cd "$1" || exit 1; }

node_version=$(node --version)
if [ "$(echo "$node_version" | grep -c -E '^v24[.]')" -ne 1 ]; then
    echo Need node v24 but have "$node_version"
    exit 1
fi

REPO_ROOT=$(cd_or_fail "$(dirname "$0")"; cd_or_fail ..; pwd -P)
cd_or_fail "$REPO_ROOT"

npx vite build --base=/pyggb/
