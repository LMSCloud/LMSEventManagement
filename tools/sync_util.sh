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

# Walk every .pm under the vendor root (skipping VCS / test trees) and
# rewrite the package namespace in place, preserving the directory layout
# under TARGET_DIR. This lets the vendor ship nested modules
# (e.g. Reporting/Metric/Counter.pm) without losing the namespace
# rewrite that consumers depend on.
while IFS= read -r -d '' src; do
    rel="${src#"$VENDOR_DIR/"}"
    dest="$TARGET_DIR/$rel"

    mkdir -p "$(dirname "$dest")"
    sed \
        -e "s/Koha::Plugin::Com::LMSCloud::Util::/Koha::Plugin::Com::LMSCloud::${SHORT_NAME}::Util::/g" \
        "$src" > "$dest"

    echo "Synced: $rel"
done < <(find "$VENDOR_DIR" \
    \( -name .git -o -name t \) -prune -o \
    -type f -name '*.pm' -print0)

echo "Util modules synced into $SHORT_NAME namespace."
