#!/bin/bash

set -e

if ! hash poetry 2> /dev/null; then
    >&2 echo "Could not find poetry"
    >&2 echo "See https://python-poetry.org/docs/ for installation docs"
    exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)

(
    cd "$REPO_ROOT"/public
    doc_link_target=../doc/build/html

    if ! [ -e doc ]; then
        >&2 echo "Creating symlink public/doc -> $doc_link_target"
        ln -s "$doc_link_target" doc
    else
        if ! [ -L doc ]; then
            >&2 echo "public/doc must be a symbolic link"
            exit 1
        fi

        link_target=$(readlink doc)
        if [ "$link_target" != "$doc_link_target" ]; then
            >&2 echo "public/doc must be a symbolic link to $doc_link_target"
            exit 1
        fi
    fi
)

(
    cd "$REPO_ROOT"/doc
    poetry install
    poetry run make html
)

export REACT_APP_DOCS_BASE_URL_WITHIN_APP=doc

exec npm start
