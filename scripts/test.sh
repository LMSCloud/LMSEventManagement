#!/usr/bin/env bash
set -euo pipefail

# Run Perl integration tests inside a running Koha container.
#
# Usage:
#   ./Scripts/test.sh <container_name> [docker_binary] [test_glob]
#
# Examples:
#   ./Scripts/test.sh lmscloud-koha-1                    # run all tests
#   ./Scripts/test.sh lmscloud-koha-1 docker t/rooms.t   # run one test file
#   ./Scripts/test.sh koha_koha_1 podman                 # use podman

if [[ -z "${NO_COLOR:-}" ]]; then
    CYAN='\033[0;36m'
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    NC='\033[0m'
else
    CYAN='' GREEN='' RED='' NC=''
fi

die() { echo -e "${RED}$1${NC}" >&2; exit 1; }
info() { echo -e "${CYAN}$1${NC}"; }

CONTAINER="${1:?Usage: $0 <container_name> [docker_binary] [test_glob]}"
DOCKER="${2:-docker}"
TEST_GLOB="${3:-t}"

PLUGIN_DIR="/var/lib/koha/kohadev/plugins"

# Verify container is running
"$DOCKER" inspect --format '{{.State.Running}}' "$CONTAINER" >/dev/null 2>&1 \
    || die "Container '$CONTAINER' is not running."

# Copy plugin source + tests into the container
info "Copying plugin code into container..."
"$DOCKER" cp Koha "$CONTAINER:$PLUGIN_DIR/"
"$DOCKER" cp t    "$CONTAINER:$PLUGIN_DIR/"

# Install the plugin so tables + plugin_data rows exist
info "Installing plugin..."
"$DOCKER" exec "$CONTAINER" /kohadevbox/koha/misc/devel/install_plugins.pl

# Run prove
info "Running tests ($TEST_GLOB)..."
if "$DOCKER" exec "$CONTAINER" bash -c "prove -v $PLUGIN_DIR/$TEST_GLOB"; then
    echo -e "${GREEN}All tests passed.${NC}"
else
    die "Some tests failed."
fi
