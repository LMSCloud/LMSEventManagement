#!/bin/bash
set -euo pipefail

# Configuration variables
OUTPUT_FILE=""
SOURCE_PATTERNS=()
TEMPLATE_PATTERNS=()

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
    -o | --output)
        OUTPUT_FILE="$2"
        shift
        ;;
    -s | --source)
        SOURCE_PATTERNS+=("$2")
        shift
        ;;
    -t | --template)
        TEMPLATE_PATTERNS+=("$2")
        shift
        ;;
    *)
        echo "Unknown parameter passed: $1"
        exit 1
        ;;
    esac
    shift
done

# Check if all required arguments are provided
if [ -z "$OUTPUT_FILE" ] || [ ${#SOURCE_PATTERNS[@]} -eq 0 ] || [ ${#TEMPLATE_PATTERNS[@]} -eq 0 ]; then
    echo "Usage: $0 --output OUTPUT_FILE --source GLOB --template GLOB"
    exit 1
fi

# Expand glob patterns into file lists via find.
# Converts e.g. "src/**/*.ts" into: find src -name '*.ts'
expand_glob() {
    local pattern="$1"
    local dir="${pattern%%/\*\**}"
    local ext="${pattern##*.}"
    find "$dir" -name "*.${ext}" -type f 2>/dev/null | sort
}

SOURCE_FILES=""
for pat in "${SOURCE_PATTERNS[@]}"; do
    SOURCE_FILES="$SOURCE_FILES $(expand_glob "$pat")"
done

TEMPLATE_FILES=""
for pat in "${TEMPLATE_PATTERNS[@]}"; do
    TEMPLATE_FILES="$TEMPLATE_FILES $(expand_glob "$pat")"
done

# Create the output file if it doesn't exist
if [ ! -f "$OUTPUT_FILE" ]; then
    touch "$OUTPUT_FILE"
fi

# Extract strings from source files
xgettext --from-code=utf-8 --force-po --output="$OUTPUT_FILE" \
    --keyword=__ --keyword=attr__ --keyword=gtx.gettext --keyword=i18n:1,2 \
    $SOURCE_FILES

# Extract strings from .tt files and merge with existing .pot file
if command -v xgettext-tt2 &>/dev/null; then
    xgettext-tt2 --from-code=utf-8 --force-po --output="$OUTPUT_FILE" \
        --keyword=__ --keyword=gtx.gettext --keyword=i18n:1,2 \
        --join-existing \
        $TEMPLATE_FILES
else
    echo "Warning: xgettext-tt2 not found, skipping .tt template extraction"
fi
