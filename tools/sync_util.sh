#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source .env for PLUGIN_NAME
if [[ ! -f "$PROJECT_ROOT/.env" ]]; then
    echo "ERROR: .env file not found at $PROJECT_ROOT/.env" >&2
    exit 1
fi
# shellcheck source=/dev/null
source "$PROJECT_ROOT/.env"

if [[ -z "${PLUGIN_NAME:-}" ]]; then
    echo "ERROR: PLUGIN_NAME is not set in .env" >&2
    exit 1
fi

# Extract short plugin name from fully-qualified Perl package name
# e.g. Koha::Plugin::Com::LMSCloud::EventManagement -> EventManagement
SHORT_NAME="${PLUGIN_NAME##*::}"

VENDOR_DIR="$PROJECT_ROOT/vendor/koha-plugin-lmscloud-util"
TARGET_DIR="$PROJECT_ROOT/Koha/Plugin/Com/LMSCloud/$SHORT_NAME/Util"

if [[ ! -d "$VENDOR_DIR" ]]; then
    echo "ERROR: Vendor directory not found at $VENDOR_DIR" >&2
    echo "Have you initialized the submodule? Try: git submodule update --init" >&2
    exit 1
fi

mkdir -p "$TARGET_DIR"

# Copy .pm files and rewrite package namespace
for src in "$VENDOR_DIR"/*.pm; do
    filename="$(basename "$src")"
    dest="$TARGET_DIR/$filename"

    sed \
        -e "s/Koha::Plugin::Com::LMSCloud::Util::/Koha::Plugin::Com::LMSCloud::${SHORT_NAME}::Util::/g" \
        "$src" > "$dest"

    echo "Synced: $filename"
done

echo "Util modules synced into $SHORT_NAME namespace."
