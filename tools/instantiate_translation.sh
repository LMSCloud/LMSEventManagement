#!/bin/bash
set -euo pipefail

if [[ -z "${LOCALE:-}" ]]; then
    echo "Usage: LOCALE=de_DE $0 <pot-file>"
    exit 1
fi

POT_FILE="${1:?Usage: LOCALE=de_DE $0 <pot-file>}"
PO_FILE="locales/${LOCALE}.po"

mkdir -p locales

if [ ! -f "$PO_FILE" ]; then
    msginit --input="$POT_FILE" --locale="$LOCALE" --output-file="$PO_FILE"
else
    msgmerge --update "$PO_FILE" "$POT_FILE"
fi
