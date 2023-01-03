#!/bin/bash

GITROOT="$(git rev-parse --show-toplevel)"
python "${GITROOT}"/tools/build_examples_index.py \
    "${GITROOT}"/public/examples \
    > "${GITROOT}"/public/examples/index.json
