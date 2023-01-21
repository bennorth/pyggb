#!/bin/bash

GITROOT="$(git rev-parse --show-toplevel)"
python3 "${GITROOT}"/tools/build_examples_index.py \
    "${GITROOT}"/public/examples \
    > "${GITROOT}"/public/examples/index.json
